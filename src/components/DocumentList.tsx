import type { LoadedDocument } from '../types';

type DocumentListProps = {
  documents: LoadedDocument[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
};

export function DocumentList({ documents, activeId, onSelect, onRemove }: DocumentListProps) {
  return (
    <section className="stack">
      <div className="section-head">
        <div>
          <p className="eyebrow">Files</p>
          <h2>読み込み済み</h2>
        </div>
      </div>

      <article className="card stack">
        {documents.length === 0 ? (
          <p className="muted">まだPDFがありません。</p>
        ) : (
          documents.map((doc) => (
            <div
              key={doc.id}
              className={`document-item ${doc.id === activeId ? 'active' : ''}`}
            >
              <button type="button" className="document-item-main" onClick={() => onSelect(doc.id)}>
                <span className="document-item-title">{doc.summary.fileName}</span>
                <span className="document-item-meta">
                  {doc.status === 'loading'
                    ? '読み込み中'
                    : doc.status === 'error'
                      ? 'エラー'
                      : `${doc.summary.pages ?? '未解析'} pages`}
                </span>
              </button>
              <button
                className="document-item-action"
                type="button"
                onClick={() => onRemove(doc.id)}
              >
                削除
              </button>
            </div>
          ))
        )}
      </article>
    </section>
  );
}
