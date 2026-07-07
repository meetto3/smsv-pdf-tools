export function HelpPanel() {
  return (
    <section className="stack">
      <div className="section-head">
        <div>
          <p className="eyebrow">Help</p>
          <h2>注意と使い方</h2>
        </div>
      </div>

      <article className="card help-card">
        <p>
          PDFは端末内で処理します。サーバーへ送信しない前提で、読み込み・分割・回転・結合・メタデータ編集を行います。
        </p>
        <ul>
          <li>大きいPDFは処理に時間がかかります。</li>
          <li>真正性のある書類の改ざん用途には使わないでください。</li>
          <li>保存名とPDFタイトルは別々に扱います。</li>
        </ul>
      </article>
    </section>
  );
}
