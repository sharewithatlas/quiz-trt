'use client';

type Props = {
  label: string;
  selected: boolean;
  onClick: () => void;
  variant?: 'radio' | 'checkbox';
  disabled?: boolean;
};

export function OptionButton({ label, selected, onClick, variant = 'radio', disabled = false }: Props) {
  const isCheckbox = variant === 'checkbox';
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full items-center gap-3 rounded-xl border px-5 py-4 text-left text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
        selected
          ? 'border-amber-600 bg-amber-400 text-ink'
          : 'border-ink/15 bg-white/40 text-ink hover:border-ink/40'
      }`}
    >
      <span
        className={`flex h-5 w-5 flex-shrink-0 items-center justify-center border-2 ${
          isCheckbox ? 'rounded-md' : 'rounded-full'
        } ${selected ? 'border-ink bg-ink text-amber-400' : 'border-ink/40'}`}
      >
        {selected && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span className="flex-1">{label}</span>
    </button>
  );
}
