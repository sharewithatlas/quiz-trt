type Props = { section: string; position?: string };

export function SectionTag({ section, position }: Props) {
  if (!section || section === 'INTRO') return null;
  return (
    <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-ink-700">
      <span>{section}</span>
      {position && <span>{position}</span>}
    </div>
  );
}
