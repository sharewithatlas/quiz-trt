'use client';

import Image from 'next/image';
import { Copy } from '@/components/Copy';
import { useFunnel } from '@/components/FunnelProvider';
import type { CardGridBlock } from '@/lib/funnels/shared/blocks';

export function CardGrid({ block }: { block: CardGridBlock }) {
  const funnel = useFunnel();
  const cols = block.columns === 2 ? 'md:grid-cols-2' : block.columns === 4 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-3';
  return (
    <section className="py-8 space-y-4">
      {block.headingSlot && <Copy slot={block.headingSlot} description="Card grid heading" className="font-serif text-2xl text-ink" />}
      {block.introSlot && <Copy slot={block.introSlot} description="Card grid intro" className="text-ink-700" as="p" />}
      <div className={`grid grid-cols-1 ${cols} gap-4`}>
        {block.items.map((item, i) => {
          const img = item.imageKey ? (funnel.brand.images?.[item.imageKey] as string | undefined) : undefined;
          return (
            <div key={i} className="rounded-2xl border border-ink/10 bg-white/40 p-5 space-y-2">
              {img && (
                <div className="aspect-square overflow-hidden rounded-xl">
                  <Image src={img} alt="" width={400} height={400} className="w-full h-full object-cover" />
                </div>
              )}
              {item.titleSlot && <Copy slot={item.titleSlot} description="Card title" className="font-semibold text-ink" />}
              {item.bodySlot && <Copy slot={item.bodySlot} description="Card body" className="text-sm text-ink-700" as="p" />}
            </div>
          );
        })}
      </div>
    </section>
  );
}
