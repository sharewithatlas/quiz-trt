// Visual marker for content slots that need client-approved copy/imagery
// before deploy. Renders a dashed box in dev to make it obvious.
// Replace each <Placeholder> with the real component/content when ready.

type Props = {
  name: string;
  description?: string;
  className?: string;
  height?: string;
};

export function Placeholder({ name, description, className = '', height = 'auto' }: Props) {
  return (
    <div
      className={`my-4 rounded-lg border-2 border-dashed border-amber-600/60 bg-amber-50/40 p-4 ${className}`}
      style={{ minHeight: height }}
    >
      <div className="text-xs font-mono uppercase tracking-wider text-amber-700">
        Placeholder · {name}
      </div>
      {description && (
        <div className="mt-1 text-sm text-ink-700">{description}</div>
      )}
    </div>
  );
}
