import type { ExportStatus } from '../types';

type OutputSettingsDialogProps = {
  title: string;
  onTitleChange: (value: string) => void;
  onExport: () => void;
  exportStatus: ExportStatus;
  exportMessage?: string;
  disabled?: boolean;
};

export function OutputSettingsDialog({
  title,
  onTitleChange,
  onExport,
  exportStatus,
  exportMessage,
  disabled,
}: OutputSettingsDialogProps) {
  return (
    <section className="stack">
      <div className="section-head">
        <div>
          <p className="eyebrow">Output</p>
          <h2>書き出し</h2>
        </div>
      </div>

      <article className="card stack">
        <label>
          <span>PDF文書タイトル</span>
          <input value={title} onChange={(event) => onTitleChange(event.target.value)} />
        </label>
        <label>
          <span>注意</span>
          <textarea
            defaultValue="PDFメタデータは真正性を証明しません。契約書や証明書の偽装用途では使わないでください。"
            rows={4}
          />
        </label>

        <div className="button-row">
          <button className="secondary-button" type="button">
            下書きを保存
          </button>
          <button className="primary-button" type="button" onClick={onExport} disabled={disabled || exportStatus === 'exporting'}>
            {exportStatus === 'exporting' ? '書き出し中...' : '書き出し'}
          </button>
        </div>

        {exportMessage ? <p className={`export-state ${exportStatus}`}>{exportMessage}</p> : null}
      </article>
    </section>
  );
}
