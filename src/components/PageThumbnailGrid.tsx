import { useState } from 'react';
import type { PagePreview } from '../types';

type PageThumbnailGridProps = {
  pages: PagePreview[];
  onToggleSplitTarget: (
    pageNumber: number,
    modifiers?: { shiftKey: boolean; metaKey: boolean; ctrlKey: boolean },
  ) => void;
  onRotatePage: (pageNumber: number, direction: 'left' | 'right') => void;
  onDeletePage: (pageNumber: number) => void;
  onMovePage: (pageNumber: number, direction: 'up' | 'down') => void;
  onReorderPage: (sourcePageNumber: number, targetPageNumber: number) => void;
};

export function PageThumbnailGrid({
  pages,
  onToggleSplitTarget,
  onRotatePage,
  onDeletePage,
  onMovePage,
  onReorderPage,
}: PageThumbnailGridProps) {
  const [draggedPageNumber, setDraggedPageNumber] = useState<number | null>(null);

  if (pages.length === 0) {
    return (
      <section className="stack">
        <div className="section-head">
          <div>
            <p className="eyebrow">Canvas</p>
            <h2>ページ一覧とプレビュー</h2>
          </div>
        </div>

        <article className="card empty-state">
          <p>PDFを読み込むと、ここにページサムネイルが並びます。</p>
        </article>
      </section>
    );
  }

  return (
    <section className="stack">
      <div className="section-head">
        <div>
          <p className="eyebrow">Canvas</p>
          <h2>ページ一覧とプレビュー</h2>
        </div>
        <div className="section-badge">選択中 {pages.filter((page) => page.splitTarget).length}</div>
      </div>

      <article className="card thumbnail-grid">
        {pages.map((page) => (
          <div
            key={page.number}
            className={`thumbnail-item ${page.selected ? 'selected' : ''} ${page.splitTarget ? 'split-target' : ''} ${draggedPageNumber === page.number ? 'dragging' : ''}`}
            draggable
            onDragStart={(event) => {
              setDraggedPageNumber(page.number);
              event.dataTransfer.setData('text/plain', String(page.number));
              event.dataTransfer.effectAllowed = 'move';
            }}
            onDragOver={(event) => {
              event.preventDefault();
              event.dataTransfer.dropEffect = 'move';
            }}
            onDrop={(event) => {
              event.preventDefault();
              const sourcePageNumber = Number(event.dataTransfer.getData('text/plain'));
              if (!Number.isNaN(sourcePageNumber) && sourcePageNumber !== page.number) {
                onReorderPage(sourcePageNumber, page.number);
              }
            }}
            onDragEnd={() => setDraggedPageNumber(null)}
          >
            <button
              className="thumbnail"
              type="button"
              onClick={(event) =>
                onToggleSplitTarget(page.number, {
                  shiftKey: event.shiftKey,
                  metaKey: event.metaKey,
                  ctrlKey: event.ctrlKey,
                })
              }
            >
              <span className="thumbnail-page">P{page.number}</span>
              <span className="thumbnail-meta">{page.rotated ? `回転 ${page.rotated}` : '標準'}</span>
              <span className="thumbnail-meta">{page.splitHint === 'left' ? '左側' : '右側'}</span>
              <span className="thumbnail-chip">{page.splitTarget ? '2-in-1対象' : '対象外'}</span>
            </button>

            <div className="thumbnail-actions">
              <button className="mini-button" type="button" onClick={() => onMovePage(page.number, 'up')}>
                ↑
              </button>
              <button className="mini-button" type="button" onClick={() => onMovePage(page.number, 'down')}>
                ↓
              </button>
              <button className="mini-button" type="button" onClick={() => onRotatePage(page.number, 'left')}>
                ↺
              </button>
              <button className="mini-button" type="button" onClick={() => onRotatePage(page.number, 'right')}>
                ↻
              </button>
              <button className="mini-button danger" type="button" onClick={() => onDeletePage(page.number)}>
                削除
              </button>
            </div>
          </div>
        ))}
      </article>
    </section>
  );
}
