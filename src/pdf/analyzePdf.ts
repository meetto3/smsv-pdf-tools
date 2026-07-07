import type { PdfSummary } from '../types';

function decodePdfLiteral(input: string) {
  return input
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\b/g, '\b')
    .replace(/\\f/g, '\f')
    .replace(/\\\(/g, '(')
    .replace(/\\\)/g, ')')
    .replace(/\\\\/g, '\\');
}

function readMetadataValue(text: string, key: string) {
  const literalMatch = text.match(new RegExp(`/${key}\\s*\\(([^)]*)\\)`, 'i'));
  if (literalMatch?.[1]) {
    return decodePdfLiteral(literalMatch[1]).trim();
  }

  const hexMatch = text.match(new RegExp(`/${key}\\s*<([0-9A-Fa-f\\s]+)>`, 'i'));
  if (hexMatch?.[1]) {
    const hex = hexMatch[1].replace(/\s+/g, '');
    if (hex.length % 2 === 0) {
      const bytes = hex.match(/.{2}/g)?.map((chunk) => Number.parseInt(chunk, 16)) ?? [];
      return new TextDecoder('utf-8').decode(new Uint8Array(bytes)).trim();
    }
  }

  return '';
}

function detectOrientation(fileName: string): PdfSummary['orientation'] {
  if (/\b(a3|a4|b4|b5|portrait)\b/i.test(fileName)) {
    return 'portrait';
  }
  if (/\b(landscape|wide|横)\b/i.test(fileName)) {
    return 'landscape';
  }
  return 'mixed';
}

export async function analyzePdf(file: File): Promise<PdfSummary> {
  const buffer = await file.arrayBuffer();
  const text = new TextDecoder('latin1').decode(buffer);
  const pageMatches = text.match(/\/Type\s*\/Page(?!s)\b/g) ?? [];

  const title = readMetadataValue(text, 'Title') || file.name.replace(/\.pdf$/i, '');
  const author = readMetadataValue(text, 'Author') || '未指定';
  const subject = readMetadataValue(text, 'Subject') || '';
  const keywords = readMetadataValue(text, 'Keywords')
    .split(/[,\s、]+/g)
    .map((keyword) => keyword.trim())
    .filter(Boolean);
  const createdAt = readMetadataValue(text, 'CreationDate') || '未取得';
  const updatedAt = readMetadataValue(text, 'ModDate') || '未取得';

  return {
    fileName: file.name,
    title,
    pages: pageMatches.length > 0 ? pageMatches.length : null,
    sizeMb: file.size / (1024 * 1024),
    orientation: detectOrientation(file.name),
    pageSize: '未解析',
    encrypted: /\/Encrypt\b/.test(text),
    author,
    subject,
    keywords,
    createdAt,
    updatedAt,
  };
}
