'use client';

import Image from 'next/image';
import { Copy } from '@/components/Copy';
import { useFunnel } from '@/components/FunnelProvider';
import type { FeaturedInBlock } from '@/lib/funnels/shared/blocks';

export function FeaturedIn({ block }: { block: FeaturedInBlock }) {
  const funnel = useFunnel();
  return (
    <section className="my-10 space-y-4 text-center">
      {block.headingSlot && (
        <Copy slot={block.headingSlot} description="Featured-in heading" className="text-xs font-semibold uppercase tracking-widest text-ink-700" />
      )}
      {block.quoteSlot && (
        <Copy slot={block.quoteSlot} description="Featured-in pull quote" className="font-serif text-xl text-ink max-w-prose mx-auto" as="div" />
      )}
      {block.attributionSlot && (
        <Copy slot={block.attributionSlot} description="Featured-in attribution + outlet" className="text-sm text-ink-700" />
      )}
      {block.logoImageKeys && block.logoImageKeys.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
          {block.logoImageKeys.map((key) => {
            const src = funnel.brand.images?.[key];
            if (typeof src !== 'string') return null;
            return (
              <div key={key} className="opacity-70">
                <Image src={src} alt="" width={120} height={32} className="h-8 w-auto" />
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
