'use client';

import { useEffect, useState } from 'react';
import { Copy } from '@/components/Copy';
import type { CountdownBlock } from '@/lib/funnels/shared/blocks';

function formatRemaining(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = String(Math.floor(total / 3600)).padStart(2, '0');
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, '0');
  const s = String(total % 60).padStart(2, '0');
  return { h, m, s };
}

export function Countdown({ block }: { block: CountdownBlock }) {
  // Persist a deadline per (block) in sessionStorage so refresh doesn't reset it.
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const key = `countdown:${block.headlineSlot ?? 'default'}:${block.durationSeconds}`;
    let deadline = Number(typeof window !== 'undefined' ? sessionStorage.getItem(key) : 0);
    if (!deadline || isNaN(deadline)) {
      deadline = Date.now() + block.durationSeconds * 1000;
      if (typeof window !== 'undefined') sessionStorage.setItem(key, String(deadline));
    }
    const tick = () => setRemaining(deadline - Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [block.durationSeconds, block.headlineSlot]);

  const t = formatRemaining(remaining ?? block.durationSeconds * 1000);
  return (
    <section className="my-6 rounded-2xl bg-ink p-5 text-cream">
      {block.headlineSlot && (
        <Copy slot={block.headlineSlot} description="Countdown headline" className="font-serif text-xl text-cream mb-3" />
      )}
      <div className="flex items-baseline justify-center gap-2 font-serif text-3xl">
        <span>{t.h}<span className="text-sm font-sans align-super ml-1">Hours</span></span>
        <span>:</span>
        <span>{t.m}<span className="text-sm font-sans align-super ml-1">Minutes</span></span>
        <span>:</span>
        <span>{t.s}<span className="text-sm font-sans align-super ml-1">Seconds</span></span>
      </div>
      {block.expiresSlot && <Copy slot={block.expiresSlot} description="Absolute expiry copy" className="mt-2 text-center text-xs text-cream/80" />}
    </section>
  );
}
