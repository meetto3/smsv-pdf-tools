import type { ReactNode } from 'react';
import type { SplitSettings } from '../types';

type OperationPanelProps = {
  splitSettings: SplitSettings;
  onSplitSettingsChange: (settings: SplitSettings) => void;
};

export function OperationPanel({ splitSettings, onSplitSettingsChange }: OperationPanelProps) {
  const setSplitSettings = (patch: Partial<SplitSettings>) => {
    onSplitSettingsChange({ ...splitSettings, ...patch });
  };

  return (
    <section className="stack">
      <div className="section-head">
        <div>
          <p className="eyebrow">Edit</p>
          <h2>操作</h2>
        </div>
      </div>

      <article className="card stack">
        <FieldGroup title="対象ページ">
          <Chips
            items={['全ページ', '奇数ページ', '偶数ページ', '範囲指定', '周期指定']}
          />
        </FieldGroup>

        <FieldGroup title="ページ操作">
          <Chips items={['回転', '分割', '削除', '並べ替え', '結合']} />
        </FieldGroup>

        <FieldGroup title="2-in-1分割">
          <div className="split-settings">
            <div className="toggle-row">
              <button
                className={`chip ${splitSettings.direction === 'vertical' ? 'chip-active' : ''}`}
                type="button"
                onClick={() => setSplitSettings({ direction: 'vertical' })}
              >
                左右分割
              </button>
              <button
                className={`chip ${splitSettings.direction === 'horizontal' ? 'chip-active' : ''}`}
                type="button"
                onClick={() => setSplitSettings({ direction: 'horizontal' })}
              >
                上下分割
              </button>
            </div>

            <div className="field-grid">
              <label>
                <span>分割位置</span>
                <input
                  type="range"
                  min="0.35"
                  max="0.65"
                  step="0.01"
                  value={splitSettings.position}
                  onChange={(event) => setSplitSettings({ position: Number(event.target.value) })}
                />
              </label>

              <label>
                <span>重なり(mm)</span>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={splitSettings.overlapMm}
                  onChange={(event) => setSplitSettings({ overlapMm: Number(event.target.value) })}
                />
              </label>

              <label>
                <span>外側余白(mm)</span>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={splitSettings.marginMm}
                  onChange={(event) => setSplitSettings({ marginMm: Number(event.target.value) })}
                />
              </label>
            </div>

            <div className="toggle-row">
              <button
                className={`chip ${splitSettings.order === 'left-right' ? 'chip-active' : ''}`}
                type="button"
                onClick={() => setSplitSettings({ order: 'left-right' })}
              >
                左→右
              </button>
              <button
                className={`chip ${splitSettings.order === 'right-left' ? 'chip-active' : ''}`}
                type="button"
                onClick={() => setSplitSettings({ order: 'right-left' })}
              >
                右→左
              </button>
              <button
                className={`chip ${splitSettings.order === 'top-bottom' ? 'chip-active' : ''}`}
                type="button"
                onClick={() => setSplitSettings({ order: 'top-bottom' })}
              >
                上→下
              </button>
              <button
                className={`chip ${splitSettings.order === 'bottom-top' ? 'chip-active' : ''}`}
                type="button"
                onClick={() => setSplitSettings({ order: 'bottom-top' })}
              >
                下→上
              </button>
            </div>

            <div className="toggle-row">
              <button
                className={`chip ${splitSettings.scope === 'all' ? 'chip-active' : ''}`}
                type="button"
                onClick={() => setSplitSettings({ scope: 'all' })}
              >
                全ページ
              </button>
              <button
                className={`chip ${splitSettings.scope === 'odd' ? 'chip-active' : ''}`}
                type="button"
                onClick={() => setSplitSettings({ scope: 'odd' })}
              >
                奇数ページ
              </button>
              <button
                className={`chip ${splitSettings.scope === 'even' ? 'chip-active' : ''}`}
                type="button"
                onClick={() => setSplitSettings({ scope: 'even' })}
              >
                偶数ページ
              </button>
              <button
                className={`chip ${splitSettings.scope === 'range' ? 'chip-active' : ''}`}
                type="button"
                onClick={() => setSplitSettings({ scope: 'range' })}
              >
                範囲指定
              </button>
            </div>
          </div>
        </FieldGroup>

        <FieldGroup title="回転">
          <div className="slider-row">
            <label htmlFor="rotate">角度</label>
            <input id="rotate" type="range" min="0" max="270" step="90" defaultValue={90} />
          </div>
        </FieldGroup>

        <div className="button-row">
          <button className="secondary-button" type="button">
            プレビュー更新
          </button>
          <button className="primary-button" type="button">
            適用
          </button>
        </div>
      </article>
    </section>
  );
}

function FieldGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="field-group">
      <h3>{title}</h3>
      {children}
    </div>
  );
}

function Chips({ items }: { items: string[] }) {
  return (
    <div className="chip-row">
      {items.map((item) => (
        <button key={item} className="chip" type="button">
          {item}
        </button>
      ))}
    </div>
  );
}
