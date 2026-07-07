import { useEffect, useMemo, useState } from 'react';
import './styles.css';
import { BottomBar } from './components/BottomBar';
import { DocumentSummaryCard } from './components/DocumentSummaryCard';
import { FileDropZone } from './components/FileDropZone';
import { FilenameTemplateEditor } from './components/FilenameTemplateEditor';
import { HelpPanel } from './components/HelpPanel';
import { MetadataEditor } from './components/MetadataEditor';
import { OperationPanel } from './components/OperationPanel';
import { OutputSettingsDialog } from './components/OutputSettingsDialog';
import { PageThumbnailGrid } from './components/PageThumbnailGrid';
import { SplitPreviewCard } from './components/SplitPreviewCard';
import { DocumentList } from './components/DocumentList';
import { RulePresetPanel } from './components/RulePresetPanel';
import { ShellLayout } from './components/ShellLayout';
import { TopBar } from './components/TopBar';
import { mockPdfSummary, mockPresets } from './data/mock';
import { buildExportPdfBlob } from './pdf/exportPdf';
import { analyzePdf } from './pdf/analyzePdf';
import type { ExportStatus, LoadedDocument, PagePreview, SplitSettings } from './types';

export function App() {
  const [documents, setDocuments] = useState<LoadedDocument[]>([]);
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [splitTargetPagesByDocument, setSplitTargetPagesByDocument] = useState<
    Record<string, number[]>
  >({});
  const [splitSelectionAnchorByDocument, setSplitSelectionAnchorByDocument] = useState<
    Record<string, number | null>
  >({});
  const [pagesByDocument, setPagesByDocument] = useState<Record<string, PagePreview[]>>({});
  const [splitSettings, setSplitSettings] = useState<SplitSettings>({
    direction: 'vertical',
    order: 'left-right',
    position: 0.5,
    overlapMm: 2,
    marginMm: 5,
    scope: 'all',
  });
  const [exportTitle, setExportTitle] = useState('');
  const [exportStatus, setExportStatus] = useState<ExportStatus>('idle');
  const [exportMessage, setExportMessage] = useState('');

  const activeDocument = useMemo(
    () => documents.find((document) => document.id === activeDocumentId) ?? null,
    [activeDocumentId, documents],
  );
  const activePages = activeDocumentId ? pagesByDocument[activeDocumentId] ?? [] : [];
  const activeSplitTargetPages = activePages.filter((page) => page.splitTarget).map((page) => page.number);

  async function handleFilesSelected(files: FileList | File[]) {
    const nextFiles = Array.from(files).filter((file) => file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'));
    if (nextFiles.length === 0) {
      return;
    }

    setLoading(true);

    try {
      const preparedDocuments = nextFiles.map((file) => ({
        id: crypto.randomUUID(),
        file,
        objectUrl: URL.createObjectURL(file),
        summary: {
          ...mockPdfSummary,
          fileName: file.name,
          title: file.name.replace(/\.pdf$/i, ''),
          sizeMb: file.size / (1024 * 1024),
          pages: null,
          orientation: 'mixed' as const,
          pageSize: '未解析',
          encrypted: false,
          author: '未解析',
          subject: '',
          keywords: [],
          createdAt: '未取得',
          updatedAt: '未取得',
        },
        status: 'loading' as const,
      }));

      setDocuments((current) => [...preparedDocuments, ...current]);
      setActiveDocumentId(preparedDocuments[0]?.id ?? null);
      setPagesByDocument((current) => {
        const next = { ...current };
        for (const document of preparedDocuments) {
          next[document.id] = buildInitialPages(0);
        }
        return next;
      });

      for (const document of preparedDocuments) {
        try {
          const summary = await analyzePdf(document.file);
          setDocuments((current) =>
            current.map((item) =>
              item.id === document.id
                ? { ...item, summary, status: 'ready' as const }
                : item,
            ),
          );
          setPagesByDocument((current) => ({
            ...current,
            [document.id]: buildInitialPages(summary.pages ?? 0),
          }));
        } catch (error) {
          setDocuments((current) =>
            current.map((item) =>
              item.id === document.id
                ? {
                    ...item,
                    status: 'error' as const,
                    error: error instanceof Error ? error.message : 'PDFの読み込みに失敗しました',
                  }
                : item,
            ),
          );
        }
      }
    } finally {
      setLoading(false);
    }
  }

  function handleRemoveDocument(id: string) {
    setDocuments((current) => {
      const target = current.find((item) => item.id === id);
      if (target) {
        URL.revokeObjectURL(target.objectUrl);
      }

      const next = current.filter((item) => item.id !== id);
      if (activeDocumentId === id) {
        setActiveDocumentId(next[0]?.id ?? null);
      }
      return next;
    });
    setSplitTargetPagesByDocument((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
    setSplitSelectionAnchorByDocument((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
    setPagesByDocument((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
  }

  const summary = activeDocument?.summary ?? null;
  const pageCount = activePages.filter((page) => !page.removed).length;
  const pages = useMemo(
    () => activePages.filter((page) => !page.removed),
    [activePages],
  );

  useEffect(() => {
    setExportTitle(summary ? `${summary.title} - 分割版` : '');
    setExportStatus('idle');
    setExportMessage('');
  }, [summary?.title, activeDocumentId]);

  useEffect(() => {
    if (!activeDocumentId) {
      return;
    }

    setSplitTargetPagesByDocument((current) => {
      const existing = current[activeDocumentId] ?? [];
      const visiblePageNumbers = (pagesByDocument[activeDocumentId] ?? [])
        .filter((page) => !page.removed)
        .map((page) => page.number)
        .sort((a, b) => a - b);

      if (visiblePageNumbers.length === 0) {
        return { ...current, [activeDocumentId]: [] };
      }

      const normalized = existing.filter((page) => visiblePageNumbers.includes(page));
      if (normalized.length > 0) {
        if (normalized.length === existing.length) {
          return current;
        }
        return { ...current, [activeDocumentId]: normalized };
      }

      return {
        ...current,
        [activeDocumentId]: visiblePageNumbers.slice(0, Math.min(2, visiblePageNumbers.length)),
      };
    });
  }, [activeDocumentId, pageCount, pagesByDocument]);

  function applySplitTargetPages(pageNumbers: number[], anchorPageNumber: number | null = null) {
    if (!activeDocumentId) {
      return;
    }

    const normalizedNext = Array.from(new Set(pageNumbers)).sort((a, b) => a - b);

    setSplitTargetPagesByDocument((current) => ({
      ...current,
      [activeDocumentId]: normalizedNext,
    }));
    setSplitSelectionAnchorByDocument((current) => ({
      ...current,
      [activeDocumentId]: anchorPageNumber ?? normalizedNext[normalizedNext.length - 1] ?? null,
    }));
    updateActivePages((pages) =>
      pages.map((page) => {
        if (page.removed) {
          return page;
        }

        const shouldSelect = normalizedNext.includes(page.number);
        return { ...page, splitTarget: shouldSelect, selected: shouldSelect };
      }),
    );
  }

  function handleToggleSplitTarget(
    pageNumber: number,
    modifiers?: { shiftKey: boolean; metaKey: boolean; ctrlKey: boolean },
  ) {
    if (!activeDocumentId) {
      return;
    }

    const activePageNumbers = activePages.filter((page) => !page.removed).map((page) => page.number);
    const currentSelected = activePages.filter((page) => page.splitTarget && !page.removed).map((page) => page.number);
    const anchorPageNumber = splitSelectionAnchorByDocument[activeDocumentId] ?? currentSelected.at(-1) ?? pageNumber;

    if (modifiers?.shiftKey) {
      const startIndex = activePageNumbers.indexOf(anchorPageNumber);
      const endIndex = activePageNumbers.indexOf(pageNumber);
      if (startIndex !== -1 && endIndex !== -1) {
        const rangeStart = Math.min(startIndex, endIndex);
        const rangeEnd = Math.max(startIndex, endIndex);
        applySplitTargetPages(activePageNumbers.slice(rangeStart, rangeEnd + 1), anchorPageNumber);
        return;
      }
    }

    if (modifiers?.metaKey || modifiers?.ctrlKey) {
      const next = currentSelected.includes(pageNumber)
        ? currentSelected.filter((page) => page !== pageNumber)
        : [...currentSelected, pageNumber];
      applySplitTargetPages(next, pageNumber);
      return;
    }

    const next = currentSelected.includes(pageNumber)
      ? currentSelected.filter((page) => page !== pageNumber)
      : [...currentSelected, pageNumber];
    applySplitTargetPages(next, pageNumber);
  }

  function updateActivePages(
    updater: (pages: PagePreview[]) => PagePreview[],
    onAfterUpdate?: (pages: PagePreview[]) => void,
  ) {
    if (!activeDocumentId) {
      return;
    }

    setPagesByDocument((current) => {
      const existing = current[activeDocumentId] ?? [];
      const next = updater(existing);
      onAfterUpdate?.(next);
      return { ...current, [activeDocumentId]: next };
    });
  }

  function handleRotatePage(pageNumber: number, direction: 'left' | 'right') {
    updateActivePages((pages) =>
      pages.map((page) => {
        if (page.number !== pageNumber || page.removed) {
          return page;
        }

        const rotationSteps = direction === 'right' ? 1 : 3;
        const nextRotation = ((page.rotated / 90 + rotationSteps) % 4) * 90;
        return { ...page, rotated: nextRotation as PagePreview['rotated'] };
      }),
    );
  }

  function handleDeletePage(pageNumber: number) {
    updateActivePages(
      (pages) =>
        pages.map((page) =>
          page.number === pageNumber ? { ...page, removed: true, splitTarget: false } : page,
        ),
      (pages) => {
        const remainingSelected = pages.filter((page) => page.splitTarget && !page.removed).map((page) => page.number);
        setSplitTargetPagesByDocument((current) => {
          if (!activeDocumentId) {
            return current;
          }

          return { ...current, [activeDocumentId]: remainingSelected };
        });
        setSplitSelectionAnchorByDocument((current) => {
          if (!activeDocumentId) {
            return current;
          }

          return { ...current, [activeDocumentId]: remainingSelected.at(-1) ?? null };
        });
      },
    );
  }

  function handleMovePage(pageNumber: number, direction: 'up' | 'down') {
    updateActivePages((pages) => {
      const currentIndex = pages.findIndex((page) => page.number === pageNumber && !page.removed);
      if (currentIndex === -1) {
        return pages;
      }

      const nextIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (nextIndex < 0 || nextIndex >= pages.length) {
        return pages;
      }

      const next = [...pages];
      const [movedPage] = next.splice(currentIndex, 1);
      next.splice(nextIndex, 0, movedPage);
      return next;
    });
  }

  function handleReorderPage(sourcePageNumber: number, targetPageNumber: number) {
    updateActivePages((pages) => {
      const sourceIndex = pages.findIndex((page) => page.number === sourcePageNumber && !page.removed);
      const targetIndex = pages.findIndex((page) => page.number === targetPageNumber && !page.removed);
      if (sourceIndex === -1 || targetIndex === -1 || sourceIndex === targetIndex) {
        return pages;
      }

      const next = [...pages];
      const [movedPage] = next.splice(sourceIndex, 1);
      const adjustedTargetIndex = sourceIndex < targetIndex ? targetIndex - 1 : targetIndex;
      next.splice(adjustedTargetIndex, 0, movedPage);
      return next;
    });
  }

  async function handleExportPdf() {
    if (!activeDocument || !summary) {
      setExportStatus('error');
      setExportMessage('PDFを読み込んでから書き出してください。');
      return;
    }

    try {
      setExportStatus('exporting');
      setExportMessage('');

      const sourceBytes = await activeDocument.file.arrayBuffer();
      const result = await buildExportPdfBlob(sourceBytes, {
        title: exportTitle.trim() || summary.title,
        sourceSummary: summary,
        pages: activePages,
        splitSettings,
      });

      const downloadUrl = URL.createObjectURL(result.blob);
      const anchor = document.createElement('a');
      anchor.href = downloadUrl;
      anchor.download = result.fileName;
      anchor.style.display = 'none';
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);

      setExportStatus('done');
      setExportMessage(`${result.fileName} を書き出しました。`);
    } catch (error) {
      setExportStatus('error');
      setExportMessage(error instanceof Error ? error.message : '書き出しに失敗しました。');
    }
  }

  return (
    <ShellLayout
      topBar={<TopBar />}
      leftPane={
        <div className="stack">
          <FileDropZone onFilesSelected={handleFilesSelected} loading={loading} />
          <DocumentList
            documents={documents}
            activeId={activeDocumentId}
            onSelect={setActiveDocumentId}
            onRemove={handleRemoveDocument}
          />
          <DocumentSummaryCard summary={summary} />
          <RulePresetPanel presets={mockPresets} />
        </div>
      }
      centerPane={
        <div className="stack">
          <SplitPreviewCard
            settings={splitSettings}
            selectedPages={activeSplitTargetPages}
          />
          <PageThumbnailGrid
            pages={pages}
            onToggleSplitTarget={handleToggleSplitTarget}
            onRotatePage={handleRotatePage}
            onDeletePage={handleDeletePage}
            onMovePage={handleMovePage}
            onReorderPage={handleReorderPage}
          />
          <OutputSettingsDialog
            title={exportTitle}
            onTitleChange={setExportTitle}
            onExport={handleExportPdf}
            exportStatus={exportStatus}
            exportMessage={exportMessage}
            disabled={!summary || pageCount === 0}
          />
        </div>
      }
      rightPane={
        <div className="stack">
          <OperationPanel
            splitSettings={splitSettings}
            onSplitSettingsChange={setSplitSettings}
          />
          <MetadataEditor />
          <FilenameTemplateEditor />
          <HelpPanel />
        </div>
      }
      bottomBar={<BottomBar activeFileName={summary?.fileName} activePages={pageCount} />}
    />
  );
}

function buildInitialPages(pageCount: number): PagePreview[] {
  return Array.from({ length: pageCount }, (_, index) => {
    const pageNumber = index + 1;
    const isSplitTarget = pageNumber === 1 || pageNumber === 2;

    return {
      number: pageNumber,
      label: `P${pageNumber}`,
      rotated: pageNumber % 4 === 0 ? 90 : 0,
      selected: isSplitTarget,
      splitTarget: isSplitTarget,
      removed: false,
      splitHint: pageNumber % 2 === 0 ? ('right' as const) : ('left' as const),
    };
  });
}
