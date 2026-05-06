'use client';

import Image from 'next/image';
import { Copy } from '@/components/Copy';
import { useFunnel } from '@/components/FunnelProvider';
import type { FounderQuoteBlock } from '@/lib/funnels/shared/blocks';

export function FounderQuote({ block }: { block: FounderQuoteBlock }) {
  const funnel = useFunnel();
  const portrait = block.portraitImageKey ? (funnel.brand.images?.[block.portraitImageKey] as string | undefined) : undefined;
  return (
    <section className="my-8 rounded-2xl border-l-4 border-amber-600 bg-white/40 p-6 flex gap-5 items-start">
      {portrait && (
        <div className="flex-shrink-0 overflow-hidden rounded-xl">
          <Image src={portrait} alt="" width={120} height={120} className="h-24 w-24 object-cover" />
        </div>
      )}
      <div className="flex-1 space-y-2">
        <Copy slot={block.quoteSlot} description="Founder pull-quote" className="font-serif text-xl text-ink" as="div" />
        {block.attributionSlot && (
          <Copy slot={block.attributionSlot} description="Founder name + role" className="text-sm font-semibold uppercase tracking-wide text-ink-700" />
        )}
      </div>
    </section>
  );
}
