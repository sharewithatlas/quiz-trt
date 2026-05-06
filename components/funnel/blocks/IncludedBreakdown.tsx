'use client';

import { Copy } from '@/components/Copy';
import type { IncludedBreakdownBlock } from '@/lib/funnels/shared/blocks';

export function IncludedBreakdown({ block }: { block: IncludedBreakdownBlock }) {
  return (
    <section className="my-8 rounded-2xl border border-ink/10 bg-white/40 p-5 space-y-4">
      {block.headingSlot && <Copy slot={block.headingSlot} description="Included breakdown heading" className="font-serif text-2xl text-ink" />}
      <ul className="divide-y divide-ink/10">
        {block.items.map((item, i) => (
          <li key={i} className="py-3 flex justify-between items-start gap-4">
            <div className="flex-1 space-y-1">
              {item.titleSlot && <Copy slot={item.titleSlot} description={`Item ${i + 1} title`} className="font-semibold text-ink" />}
              {item.bodySlot && <Copy slot={item.bodySlot} description={`Item ${i + 1} body`} className="text-sm text-ink-700" as="p" />}
            </div>
            {item.valueSlot && (
              <Copy slot={item.valueSlot} description={`Item ${i + 1} value`} className="font-semibold text-ink whitespace-nowrap" />
            )}
          </li>
        ))}
      </ul>
      {block.totalSlot && (
        <div className="pt-2 border-t border-ink/10 flex justify-between font-serif text-lg text-ink">
          <span>Total</span>
          <Copy slot={block.totalSlot} description="Total value" />
        </div>
      )}
    </section>
  );
}
