'use client';

import Link from 'next/link';
import { Copy } from '@/components/Copy';
import { useFunnel } from '@/components/FunnelProvider';
import type { CTASectionBlock } from '@/lib/funnels/shared/blocks';

export function CTASection({ block }: { block: CTASectionBlock }) {
  const funnel = useFunnel();
  const labelFromSlot = block.ctaLabelSlot ? funnel.copy[block.ctaLabelSlot] : undefined;
  const label = labelFromSlot || block.ctaLabelStatic || 'Continue';
  const variant = block.variant ?? 'primary';
  const buttonCls = variant === 'primary'
    ? 'inline-block rounded-xl bg-ink px-8 py-3 font-semibold text-cream'
    : 'inline-block rounded-xl border border-ink/30 bg-transparent px-8 py-3 font-semibold text-ink';

  return (
    <section className="my-8 space-y-3 text-center">
      {block.headlineSlot && (
        <Copy slot={block.headlineSlot} description="CTA section headline" className="font-serif text-2xl text-ink" />
      )}
      {block.subheadSlot && (
        <Copy slot={block.subheadSlot} description="CTA section subhead" className="text-ink-700" as="p" />
      )}
      <div>
        {block.ctaHref ? (
          <Link href={block.ctaHref} className={buttonCls}>{label}</Link>
        ) : (
          <button type="button" className={buttonCls}>{label}</button>
        )}
      </div>
    </section>
  );
}
