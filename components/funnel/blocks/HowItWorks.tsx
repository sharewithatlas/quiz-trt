'use client';

import Image from 'next/image';
import { Copy } from '@/components/Copy';
import { useFunnel } from '@/components/FunnelProvider';
import type { HowItWorksBlock } from '@/lib/funnels/shared/blocks';

export function HowItWorks({ block }: { block: HowItWorksBlock }) {
  const funnel = useFunnel();
  return (
    <section className="py-8">
      {block.headingSlot && (
        <Copy slot={block.headingSlot} description="How it works heading" className="font-serif text-2xl text-ink mb-6" />
      )}
      <ol className="space-y-6">
        {block.steps.map((step, i) => {
          const num = step.numberLabel ?? String(i + 1);
          const img = step.imageKey ? (funnel.brand.images?.[step.imageKey] as string | undefined) : undefined;
          return (
            <li key={i} className="flex gap-4 items-start">
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-amber-400 font-serif text-lg text-ink">
                {num}
              </span>
              <div className="flex-1 space-y-2">
                {step.titleSlot && <Copy slot={step.titleSlot} description={`Step ${num} title`} className="font-semibold text-ink" />}
                {step.bodySlot && <Copy slot={step.bodySlot} description={`Step ${num} body`} className="text-sm text-ink-700" as="p" />}
                {img && (
                  <div className="relative mt-2 aspect-video w-full overflow-hidden rounded-lg">
                    <Image src={img} alt="" fill sizes="(max-width: 640px) 100vw, 480px" className="object-cover" />
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
