interface Props {
  step: number;
  total: number;
  titles: readonly { id: number; short: string }[];
}

export function ProgressBar({ step, total, titles }: Props) {
  const pct = ((step - 1) / (total - 1)) * 100;

  return (
    <div className="progress" aria-label={`Bosqich ${step} / ${total}`}>
      <div className="progress-meta">
        <span>
          Bosqich {step} / {total}
        </span>
        <span>{titles[step - 1]?.short}</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <ol className="progress-dots">
        {titles.map((t) => (
          <li key={t.id} className={t.id === step ? 'active' : t.id < step ? 'done' : ''}>
            <span className="dot" />
            <span className="dot-label">{t.short}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
