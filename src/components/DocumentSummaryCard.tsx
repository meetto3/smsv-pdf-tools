import type { PdfSummary } from '../types';

type DocumentSummaryCardProps = {
  summary: PdfSummary | null;
};

export function DocumentSummaryCard({ summary }: DocumentSummaryCardProps) {
  if (!summary) {
    return (
      <section className="stack">
        <div className="section-head">
          <div>
            <p className="eyebrow">Document</p>
            <h2>PDF情報</h2>
          </div>
        </div>

        <article className="card empty-state">
          <p>PDFを読み込むと、ここにファイル名やメタデータが表示されます。</p>
        </article>
      </section>
    );
  }

  return (
    <section className="stack">
      <div className="section-head">
        <div>
          <p className="eyebrow">Document</p>
          <h2>PDF情報</h2>
        </div>
      </div>

      <article className="card">
        <div className="card-grid">
          <InfoRow label="保存ファイル名" value={summary.fileName} />
          <InfoRow label="PDF文書タイトル" value={summary.title} />
          <InfoRow label="ページ数" value={summary.pages ? `${summary.pages} pages` : '未解析'} />
          <InfoRow label="容量" value={`${summary.sizeMb.toFixed(1)} MB`} />
          <InfoRow label="向き" value={summary.orientation} />
          <InfoRow label="ページサイズ" value={summary.pageSize} />
          <InfoRow label="暗号化" value={summary.encrypted ? 'あり' : 'なし'} />
          <InfoRow label="作成者" value={summary.author} />
          <InfoRow label="件名" value={summary.subject} />
          <InfoRow label="キーワード" value={summary.keywords.join(' / ')} />
          <InfoRow label="作成日時" value={summary.createdAt} />
          <InfoRow label="更新日時" value={summary.updatedAt} />
        </div>
      </article>
    </section>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="info-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
