// Typed persuasion-component blocks. Funnels declare structured arrays
// (landingBlocks / resultsBlocks). The page renderer dispatches by `type`.
//
// Adding a block type:
//   1. Add a variant to LandingBlock or ResultsBlock
//   2. Add a case in components/funnel/BlockRenderer
//   3. Implement the component in components/funnel/blocks/

export type CopyBlock = {
  type: 'copy';
  slot: string;
  description?: string;
  className?: string;
  height?: string;
  as?: 'div' | 'p' | 'section';
};

export type HowItWorksStep = {
  numberLabel?: string;       // override the displayed step number; defaults to position+1
  titleSlot?: string;
  bodySlot?: string;
  imageKey?: string;          // path lookup in brand.images
};

export type HowItWorksBlock = {
  type: 'how-it-works';
  headingSlot?: string;
  steps: HowItWorksStep[];
};

export type TrustGridItem = {
  imageKey?: string;          // path lookup in brand.images
  titleSlot?: string;
  bodySlot?: string;
  ctaLabelSlot?: string;
  ctaHref?: string;
};

export type TrustGridBlock = {
  type: 'trust-grid';
  headingSlot?: string;
  items: TrustGridItem[];     // 2-4 typically
};

export type CardGridItem = {
  imageKey?: string;
  titleSlot?: string;
  bodySlot?: string;
};

export type CardGridBlock = {
  type: 'card-grid';
  headingSlot?: string;
  introSlot?: string;
  columns?: 2 | 3 | 4;
  items: CardGridItem[];
};

export type FounderQuoteBlock = {
  type: 'founder-quote';
  portraitImageKey?: string;
  quoteSlot: string;
  attributionSlot?: string;
};

export type PricingCardData = {
  badgeSlot?: string;         // e.g. "Best deal" / "Full Price"
  titleSlot?: string;
  priceOriginalSlot?: string; // e.g. "$549"
  priceCurrentSlot?: string;  // e.g. "$149"
  savingsSlot?: string;       // e.g. "Saving $450"
  termsSlot?: string;         // e.g. "Then only $149/month. Cancel anytime"
  ctaLabelSlot?: string;
  ctaHref?: string;
  bulletsSlot?: string;       // multiline bullets pasted into one slot
  highlight?: boolean;        // true for primary card visual emphasis
};

export type PricingCompareBlock = {
  type: 'pricing-compare';
  headingSlot?: string;
  introSlot?: string;
  primary: PricingCardData;
  secondary?: PricingCardData;
};

export type CountdownBlock = {
  type: 'countdown';
  durationSeconds: number;     // ticking duration; resets each session
  headlineSlot?: string;
  expiresSlot?: string;        // absolute date copy if you want to render alongside
};

export type IncludedBreakdownItem = {
  titleSlot?: string;
  bodySlot?: string;
  valueSlot?: string;
};

export type IncludedBreakdownBlock = {
  type: 'included-breakdown';
  headingSlot?: string;
  items: IncludedBreakdownItem[];
  totalSlot?: string;
};

export type TestimonialItem = {
  imageKey?: string;
  quoteSlot?: string;
  attributionSlot?: string;
};

export type TestimonialGridBlock = {
  type: 'testimonial-grid';
  headingSlot?: string;
  columns?: 1 | 2 | 3;
  items: TestimonialItem[];
};

export type FeaturedInBlock = {
  type: 'featured-in';
  headingSlot?: string;
  quoteSlot?: string;
  attributionSlot?: string;
  logoImageKeys?: string[];
};

export type CTASectionBlock = {
  type: 'cta';
  headlineSlot?: string;
  subheadSlot?: string;
  ctaLabelSlot?: string;
  ctaLabelStatic?: string;     // use this if you don't want a slot for the label
  ctaHref?: string;
  variant?: 'primary' | 'secondary';
};

export type UrgencyBannerBlock = {
  type: 'urgency-banner';
  copySlot: string;
};

/** Marker block: LandingView renders Q1 at this point in the sequence. */
export type QuestionAnchorBlock = {
  type: 'question-anchor';
};

export type LandingBlock =
  | CopyBlock
  | HowItWorksBlock
  | TrustGridBlock
  | CardGridBlock
  | CTASectionBlock
  | UrgencyBannerBlock
  | QuestionAnchorBlock;

export type ResultsBlock =
  | CopyBlock
  | HowItWorksBlock
  | CardGridBlock
  | FounderQuoteBlock
  | PricingCompareBlock
  | CountdownBlock
  | IncludedBreakdownBlock
  | TestimonialGridBlock
  | FeaturedInBlock
  | CTASectionBlock;
