'use client';

import { Placeholder } from './Placeholder';
import { useFunnel } from './FunnelProvider';

type Props = {
  slot: string;
  description?: string;
  className?: string;
  height?: string;
  as?: 'div' | 'p' | 'section';
};

export function Copy({ slot, description, className = '', height, as = 'div' }: Props) {
  const funnel = useFunnel();
  const value = funnel.copy[slot];
  if (!value) {
    return <Placeholder name={slot} description={description} className={className} height={height} />;
  }
  const Tag = as;
  return <Tag className={`whitespace-pre-wrap ${className}`}>{value}</Tag>;
}
