'use client';

import { Copy } from '@/components/Copy';
import type { UrgencyBannerBlock } from '@/lib/funnels/shared/blocks';

export function UrgencyBanner({ block }: { block: UrgencyBannerBlock }) {
  return (
    <section className="my-6 rounded-xl bg-amber-400 px-5 py-4 text-center">
      <Copy slot={block.copySlot} description="Urgency banner copy" className="font-semibold text-ink" />
    </section>
  );
}
