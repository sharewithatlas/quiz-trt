'use client';

import Image from 'next/image';
import { Copy } from '@/components/Copy';
import { useFunnel } from '@/components/FunnelProvider';
import type { TestimonialGridBlock } from '@/lib/funnels/shared/blocks';

export function TestimonialGrid({ block }: { block: TestimonialGridBlock }) {
  const funnel = useFunnel();
  const cols = block.columns === 1 ? '' : block.columns === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2';
  return (
    <section className="my-10 space-y-4">
      {block.headingSlot && (
        <Copy slot={block.headingSlot} description="Testimonial section heading" className="font-serif text-2xl text-ink text-center" />
      )}
      <div className={`grid grid-cols-1 ${cols} gap-4`}>
        {block.items.map((item, i) => {
          const img = item.imageKey ? (funnel.brand.images?.[item.imageKey] as string | undefined) : undefined;
          return (
            <div key={i} className="rounded-2xl border border-ink/10 bg-white/40 p-5 space-y-3">
              {img && (
                <div className="overflow-hidden rounded-full w-14 h-14">
                  <Image src={img} alt="" width={120} height={120} className="w-full h-full object-cover" />
                </div>
              )}
              {item.quoteSlot && <Copy slot={item.quoteSlot} description={`Testimonial ${i + 1} quote`} className="text-sm text-ink-700" as="p" />}
              {item.attributionSlot && (
                <Copy slot={item.attributionSlot} description={`Testimonial ${i + 1} attribution`} className="text-xs font-semibold uppercase tracking-wide text-ink-700" />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
