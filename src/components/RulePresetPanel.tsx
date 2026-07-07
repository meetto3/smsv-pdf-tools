import type { RulePreset } from '../types';

type RulePresetPanelProps = {
  presets: RulePreset[];
};

export function RulePresetPanel({ presets }: RulePresetPanelProps) {
  return (
    <section className="stack">
      <div className="section-head">
        <div>
          <p className="eyebrow">Rules</p>
          <h2>プリセット</h2>
        </div>
      </div>

      <article className="card stack">
        {presets.map((preset) => (
          <div key={preset.name} className="preset-card">
            <div>
              <strong>{preset.name}</strong>
              <p>{preset.summary}</p>
            </div>
            <ul>
              {preset.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          </div>
        ))}
      </article>
    </section>
  );
}
