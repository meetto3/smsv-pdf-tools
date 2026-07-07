export function FilenameTemplateEditor() {
  return (
    <section className="stack">
      <div className="section-head">
        <div>
          <p className="eyebrow">Export</p>
          <h2>保存名</h2>
        </div>
      </div>

      <article className="card stack">
        <label>
          <span>保存ファイル名テンプレート</span>
          <input defaultValue="{originalName}_{startPage}-{endPage}.pdf" />
        </label>

        <div className="token-row">
          {['{originalName}', '{originalTitle}', '{index}', '{startPage}', '{endPage}', '{pages}'].map((token) => (
            <button key={token} className="token" type="button">
              {token}
            </button>
          ))}
        </div>

        <p className="muted">
          例: score-set_1-16.pdf
        </p>
      </article>
    </section>
  );
}
