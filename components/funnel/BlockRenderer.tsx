'use client';

import { Copy } from '@/components/Copy';
import { HowItWorks } from './blocks/HowItWorks';
import { TrustGrid } from './blocks/TrustGrid';
import { CardGrid } from './blocks/CardGrid';
import { FounderQuote } from './blocks/FounderQuote';
import { PricingCompare } from './blocks/PricingCompare';
import { Countdown } from './blocks/Countdown';
import { IncludedBreakdown } from './blocks/IncludedBreakdown';
import { TestimonialGrid } from './blocks/TestimonialGrid';
import { FeaturedIn } from './blocks/FeaturedIn';
import { CTASection } from './blocks/CTASection';
import { UrgencyBanner } from './blocks/UrgencyBanner';
import type { LandingBlock, ResultsBlock } from '@/lib/funnels/shared/blocks';

type AnyBlock = LandingBlock | ResultsBlock;

export function BlockRenderer({ block }: { block: AnyBlock }) {
  switch (block.type) {
    case 'copy':
      return <Copy slot={block.slot} description={block.description} className={block.className} height={block.height} as={block.as} />;
    case 'how-it-works': return <HowItWorks block={block} />;
    case 'trust-grid': return <TrustGrid block={block} />;
    case 'card-grid': return <CardGrid block={block} />;
    case 'founder-quote': return <FounderQuote block={block} />;
    case 'pricing-compare': return <PricingCompare block={block} />;
    case 'countdown': return <Countdown block={block} />;
    case 'included-breakdown': return <IncludedBreakdown block={block} />;
    case 'testimonial-grid': return <TestimonialGrid block={block} />;
    case 'featured-in': return <FeaturedIn block={block} />;
    case 'cta': return <CTASection block={block} />;
    case 'urgency-banner': return <UrgencyBanner block={block} />;
    case 'question-anchor': return null; // marker — LandingView renders Q1 here
  }
}
