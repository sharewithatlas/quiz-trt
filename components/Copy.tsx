import { COPY, type CopySlot } from '@/content/copy';
import { Placeholder } from './Placeholder';

type Props = {
  slot: CopySlot;
  description?: string;
  className?: string;
  height?: string;
  as?: 'div' | 'p' | 'section';
};

// Renders the copy registered at `slot`. If the slot is empty, renders
// a visible <Placeholder> in dev/staging so the content team knows where
// to drop client-approved copy.
export function Copy({ slot, description, className = '', height, as = 'div' }: Props) {
  const value = COPY[slot];
  if (!value) {
    return <Placeholder name={slot} description={description} className={className} height={height} />;
  }
  const Tag = as;
  return (
    <Tag
      className={`whitespace-pre-wrap ${className}`}
      // Whitespace and line breaks from the copy.ts string render verbatim.
    >
      {value}
    </Tag>
  );
}
