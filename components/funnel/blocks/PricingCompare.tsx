'use client';

import Link from 'next/link';
import { Copy } from '@/components/Copy';
import { Placeholder } from '@/components/Placeholder';
import { useFunnel } from '@/components/FunnelProvider';
import type { PricingCardData, PricingCompareBlock } from '@/lib/funnels/shared/blocks';

function PricingCard({ card }: { card: PricingCardData }) {
  const funnel = useFunnel();
  const ctaLabelText = card.ctaLabelSlot ? funnel.copy[card.ctaLabelSlot] : undefined;
  const highlight = card.highlight === true;
  return (
    <div className={`rounded-2xl border p-5 space-y-3 ${highlight ? 'border-amber-600 bg-amber-50/50' : 'border-ink/15 bg-white/40'}`}>
      {card.badgeSlot && (
        <div className="inline-block rounded-full bg-ink px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cream">
          <Copy slot={card.badgeSlot} description="Card badge label" />
        </div>
      )}
      {card.titleSlot && <Copy slot={card.titleSlot} description="Pricing card title" className="font-serif text-xl text-ink" />}
      <div className="flex items-baseline gap-3">
        {card.priceOriginalSlot && (
          <Copy slot={card.priceOriginalSlot} description="Original price" className="text-lg text-ink-700 line-through" />
        )}
        {card.priceCurrentSlot && (
          <Copy slot={card.priceCurrentSlot} description="Current price" className="font-serif text-3xl text-ink" />
        )}
      </div>
      {card.savingsSlot && <Copy slot={card.savingsSlot} description="Savings label" className="text-sm font-semibold text-amber-700" />}
      {card.bulletsSlot && (
        <Copy slot={card.bulletsSlot} description="Bullet list (multiline)" className="text-sm text-ink-700 whitespace-pre-wrap" as="div" />
      )}
      {card.termsSlot && <Copy slot={card.termsSlot} description="Terms / cancel anytime" className="text-xs text-ink-700" as="p" />}
      <div className="pt-2">
        {card.ctaLabelSlot ? (
          card.ctaHref ? (
            <Link href={card.ctaHref} className="inline-block w-full rounded-xl bg-ink px-6 py-3 text-center font-semibold text-cream">
              {ctaLabelText || <Placeholder name={card.ctaLabelSlot} description="CTA label" />}
            </Link>
          ) : (
            <button type="button" className="w-full rounded-xl bg-ink px-6 py-3 font-semibold text-cream">
              {ctaLabelText || <Placeholder name={card.ctaLabelSlot} description="CTA label" />}
            </button>
          )
        ) : null}
      </div>
    </div>
  );
}

export function PricingCompare({ block }: { block: PricingCompareBlock }) {
  return (
    <section className="my-8 space-y-4">
      {block.headingSlot && <Copy slot={block.headingSlot} description="Pricing compare heading" className="font-serif text-2xl text-ink" />}
      {block.introSlot && <Copy slot={block.introSlot} description="Pricing intro" className="text-ink-700" as="p" />}
      <div className={`grid grid-cols-1 gap-4 ${block.secondary ? 'md:grid-cols-2' : ''}`}>
        <PricingCard card={block.primary} />
        {block.secondary && <PricingCard card={block.secondary} />}
      </div>
    </section>
  );
}
