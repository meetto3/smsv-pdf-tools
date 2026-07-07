export function MetadataEditor() {
  return (
    <section className="stack">
      <div className="section-head">
        <div>
          <p className="eyebrow">Metadata</p>
          <h2>PDF内部情報</h2>
        </div>
      </div>

      <article className="card form-grid">
        <label>
          <span>Title</span>
          <input defaultValue="練習用スコア集" />
        </label>
        <label>
          <span>Author</span>
          <input defaultValue="SMSV PDF Tools" />
        </label>
        <label>
          <span>Subject</span>
          <input defaultValue="見開き分割と回転のサンプル" />
        </label>
        <label>
          <span>Keywords</span>
          <input defaultValue="楽譜, PDF, SMSV" />
        </label>
        <label>
          <span>Creator</span>
          <input defaultValue="SMSV PDF Tools" />
        </label>
        <label>
          <span>Producer</span>
          <input defaultValue="SMSV PDF Tools / pdf-lib" />
        </label>
      </article>
    </section>
  );
}
