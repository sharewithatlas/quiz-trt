'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Copy } from '@/components/Copy';
import { useFunnel } from '@/components/FunnelProvider';
import type { TrustGridBlock } from '@/lib/funnels/shared/blocks';

export function TrustGrid({ block }: { block: TrustGridBlock }) {
  const funnel = useFunnel();
  const cols = block.items.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-3';
  return (
    <section className="py-10">
      {block.headingSlot && (
        <Copy slot={block.headingSlot} description="Trust grid heading" className="font-serif text-2xl text-ink mb-6 text-center" />
      )}
      <div className={`grid grid-cols-1 ${cols} gap-6`}>
        {block.items.map((item, i) => {
          const img = item.imageKey ? (funnel.brand.images?.[item.imageKey] as string | undefined) : undefined;
          return (
            <div key={i} className="rounded-2xl border border-ink/10 bg-white/40 p-5 space-y-3">
              {img && (
                <div className="aspect-[4/3] overflow-hidden rounded-xl">
                  <Image src={img} alt="" width={600} height={450} className="w-full h-full object-cover" />
                </div>
              )}
              {item.titleSlot && <Copy slot={item.titleSlot} description="Trust card title" className="font-serif text-lg text-ink" />}
              {item.bodySlot && <Copy slot={item.bodySlot} description="Trust card body" className="text-sm text-ink-700" as="p" />}
              {item.ctaLabelSlot && (
                <div className="pt-2">
                  {item.ctaHref ? (
                    <Link href={item.ctaHref} className="inline-block rounded-xl bg-ink px-5 py-2 text-sm font-semibold text-cream">
                      <Copy slot={item.ctaLabelSlot} description="Trust card CTA label" />
                    </Link>
                  ) : (
                    <button type="button" className="inline-block rounded-xl bg-ink px-5 py-2 text-sm font-semibold text-cream">
                      <Copy slot={item.ctaLabelSlot} description="Trust card CTA label" />
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
