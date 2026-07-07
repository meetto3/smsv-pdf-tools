import { useRef, useState } from 'react';

type FileDropZoneProps = {
  onFilesSelected: (files: FileList | File[]) => void;
  loading?: boolean;
};

export function FileDropZone({ onFilesSelected, loading }: FileDropZoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <section className="stack">
      <div className="section-head">
        <div>
          <p className="eyebrow">Input</p>
          <h2>読み込み</h2>
        </div>
      </div>

      <div
        className={`drop-zone ${isDragging ? 'dragging' : ''}`}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          if (event.dataTransfer.files.length > 0) {
            onFilesSelected(event.dataTransfer.files);
          }
        }}
      >
        <strong>PDFをここへドロップ</strong>
        <p>端末から選択、複数ファイルの読み込みにも対応する想定です。</p>
        <input
          ref={inputRef}
          accept="application/pdf"
          multiple
          type="file"
          hidden
          onChange={(event) => {
            if (event.target.files) {
              onFilesSelected(event.target.files);
            }
          }}
        />
        <button
          className="primary-button"
          type="button"
          onClick={() => inputRef.current?.click()}
        >
          PDFを選択
        </button>
        <span className="muted">{loading ? '読み込み中...' : 'PDFを選択して開始'}</span>
      </div>
    </section>
  );
}
