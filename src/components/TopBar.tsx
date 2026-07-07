export function TopBar() {
  return (
    <div className="top-bar-inner">
      <div>
        <p className="eyebrow">SMSV PDF Tools</p>
        <h1>PDFを端末内でまとめて整える</h1>
      </div>

      <div className="top-bar-actions">
        <button className="ghost-button" type="button">
          PDFを追加
        </button>
        <button className="ghost-button" type="button">
          プリセット
        </button>
        <button className="ghost-button" type="button">
          ヘルプ
        </button>
      </div>
    </div>
  );
}
