import type { SplitSettings } from '../types';

type SplitPreviewCardProps = {
  settings: SplitSettings;
  selectedPages: number[];
};

export function SplitPreviewCard({ settings, selectedPages }: SplitPreviewCardProps) {
  const title =
    settings.direction === 'vertical'
      ? settings.order === 'right-left'
        ? '右→左の順で左右に分割'
        : '左→右の順で左右に分割'
      : settings.order === 'bottom-top'
        ? '下→上の順で上下に分割'
        : '上→下の順で上下に分割';

  const orderLabel =
    settings.direction === 'vertical'
      ? settings.order === 'right-left'
        ? '右, 左'
        : '左, 右'
      : settings.order === 'bottom-top'
        ? '下, 上'
        : '上, 下';

  return (
    <section className="stack">
      <div className="section-head">
        <div>
          <p className="eyebrow">Split Preview</p>
          <h2>2-in-1分割プレビュー</h2>
        </div>
        <div className="section-badge">{selectedPages.length}ページ選択中</div>
      </div>

      <article className="card stack">
        <p className="muted">{title}</p>

        <div className={`split-preview split-${settings.direction}`}>
          <div className="split-preview-label">元ページ</div>
          <div className="split-preview-source">
            <div className="split-preview-guide" />
            <div className="split-preview-source-text">
              <strong>1ページを{settings.direction === 'vertical' ? '左右' : '上下'}に分ける</strong>
              <p>位置 {Math.round(settings.position * 100)}% / 余白 {settings.marginMm} mm / 重なり {settings.overlapMm} mm</p>
            </div>
          </div>
          <div className="split-preview-result">
            <div className="split-preview-page">1</div>
            <div className="split-preview-arrow">→</div>
            <div className="split-preview-page">2</div>
          </div>
        </div>

        <div className="split-preview-meta">
          <div>
            <span>適用対象</span>
            <strong>
              {settings.scope === 'all'
                ? '全ページ'
                : settings.scope === 'odd'
                  ? '奇数ページ'
                  : settings.scope === 'even'
                    ? '偶数ページ'
                    : '範囲指定'}
            </strong>
          </div>
          <div>
            <span>出力順</span>
            <strong>{orderLabel}</strong>
          </div>
        </div>

        <div className="selected-page-list">
          <span>選択ページ</span>
          <strong>{selectedPages.length > 0 ? selectedPages.map((page) => `P${page}`).join(', ') : '未選択'}</strong>
        </div>

        <p className="muted">Shift+クリックで範囲選択、Ctrl/Cmd+クリックで追加・解除できます。</p>
      </article>
    </section>
  );
}
