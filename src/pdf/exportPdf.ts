import { degrees, PDFDocument, type PDFPage } from 'pdf-lib';
import type { PagePreview, PdfSummary, SplitSettings } from '../types';

const MM_TO_PT = 72 / 25.4;

type ExportPdfOptions = {
  title: string;
  sourceSummary: PdfSummary;
  pages: PagePreview[];
  splitSettings: SplitSettings;
};

type SplitBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function sanitizeFileName(input: string) {
  return input
    .replace(/[\\/:*?"<>|]+/g, '_')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\.+$/g, '');
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getSplitBoxes(width: number, height: number, settings: SplitSettings) {
  const margin = clamp(settings.marginMm * MM_TO_PT, 0, Math.min(width, height) / 3);
  const overlap = Math.max(0, settings.overlapMm * MM_TO_PT);

  if (settings.direction === 'horizontal') {
    const splitY = height * settings.position;
    const bottomHeight = clamp(splitY + overlap / 2 - margin, 1, height - margin * 2);
    const topY = clamp(splitY - overlap / 2, margin, height - margin);
    const topHeight = clamp(height - topY - margin, 1, height - margin * 2);

    return {
      first: { x: margin, y: margin, width: width - margin * 2, height: bottomHeight },
      second: { x: margin, y: topY, width: width - margin * 2, height: topHeight },
    };
  }

  const splitX = width * settings.position;
  const leftWidth = clamp(splitX + overlap / 2 - margin, 1, width - margin * 2);
  const rightX = clamp(splitX - overlap / 2, margin, width - margin);
  const rightWidth = clamp(width - rightX - margin, 1, width - margin * 2);

  return {
    first: { x: margin, y: margin, width: leftWidth, height: height - margin * 2 },
    second: { x: rightX, y: margin, width: rightWidth, height: height - margin * 2 },
  };
}

function getSplitOrder(settings: SplitSettings) {
  if (settings.direction === 'horizontal') {
    return settings.order === 'bottom-top' ? ['second', 'first'] as const : ['first', 'second'] as const;
  }

  return settings.order === 'right-left' ? ['second', 'first'] as const : ['first', 'second'] as const;
}

function setPageCrop(page: PDFPage, box: SplitBox) {
  page.setCropBox(box.x, box.y, box.width, box.height);
  page.setSize(box.width, box.height);
}

export async function buildExportPdfBlob(
  sourceBytes: ArrayBuffer,
  {
    title,
    sourceSummary,
    pages,
    splitSettings,
  }: ExportPdfOptions,
) {
  const sourceDoc = await PDFDocument.load(sourceBytes);
  const targetDoc = await PDFDocument.create();

  targetDoc.setTitle(title);
  targetDoc.setAuthor(sourceSummary.author || 'SMSV PDF Tools');
  targetDoc.setSubject(sourceSummary.subject || '');
  targetDoc.setKeywords(sourceSummary.keywords);
  targetDoc.setCreator('SMSV PDF Tools');
  targetDoc.setProducer('SMSV PDF Tools / pdf-lib');
  targetDoc.setCreationDate(new Date());
  targetDoc.setModificationDate(new Date());

  const splitOrder = getSplitOrder(splitSettings);
  const splitPages = new Set(pages.filter((page) => page.splitTarget && !page.removed).map((page) => page.number));

  for (const pageState of pages) {
    if (pageState.removed) {
      continue;
    }

    const sourceIndex = pageState.number - 1;
    const sourcePage = sourceDoc.getPages()[sourceIndex];
    if (!sourcePage) {
      continue;
    }

    if (!splitPages.has(pageState.number)) {
      const [copiedPage] = await targetDoc.copyPages(sourceDoc, [sourceIndex]);
      targetDoc.addPage(copiedPage);
      copiedPage.setRotation(degrees(pageState.rotated));
      continue;
    }

    const width = sourcePage.getWidth();
    const height = sourcePage.getHeight();
    const boxes = getSplitBoxes(width, height, splitSettings);

    for (const key of splitOrder) {
      const [copiedPage] = await targetDoc.copyPages(sourceDoc, [sourceIndex]);
      targetDoc.addPage(copiedPage);
      setPageCrop(copiedPage, boxes[key]);
      copiedPage.setRotation(degrees(pageState.rotated));
    }
  }

  const pdfBytes = await targetDoc.save();
  const pdfArrayBuffer = pdfBytes.buffer.slice(
    pdfBytes.byteOffset,
    pdfBytes.byteOffset + pdfBytes.byteLength,
  ) as ArrayBuffer;
  const fileNameBase = sanitizeFileName(title || sourceSummary.title || sourceSummary.fileName.replace(/\.pdf$/i, ''));

  return {
    blob: new Blob([pdfArrayBuffer], { type: 'application/pdf' }),
    fileName: `${fileNameBase || 'export'}.pdf`,
  };
}
