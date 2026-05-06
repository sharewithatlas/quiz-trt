// Lifeforce TRT — copy slots. Empty strings render as <Placeholder> in dev.
// Drop in client-approved prose to populate.
//
// Pricing-related slots are NOT edited here directly — they read from
// TRT_PRICING in lib/funnels/lifeforce/trt-pricing.ts. Edit pricing there.

import type { CopyMap } from '@/lib/funnels/shared/types';
import { TRT_PRICING } from '@/lib/funnels/lifeforce/trt-pricing';

export const TRT_COPY: CopyMap = {
  'hero.eyebrow': '',
  'hero.headline': '',
  'hero.subhead': '',
  'hero.trust_strip': '',
  'below_fold.urgency_banner': '',
  'below_fold.how_it_works': '',
  'below_fold.cta_block_1': '',
  'below_fold.trust_grid': '',

  'submit.headline': '',
  'submit.intro': '',

  'results.estimate_card': '',
  'results.intro_subhead': '',
  'results.narrative_block': '',
  'results.founder_quote': '',
  'results.founder_attribution': '',
  'results.value_prop_paragraph': '',
  'results.next_steps': '',
  'results.countdown_banner_1': '',
  'results.pricing_compare': '',
  'results.why_lifeforce': '',
  'results.pricing_compare_2': '',
  'results.featured_in': '',
  'results.final_cta': '',

  'q5.subhead': '',
  'q7.subhead': '',
  'q8.subhead': '',
  'q9.subhead': '',
  'q13.subhead': '',

  // ---- Pricing Compare (centralized; edit TRT_PRICING) ----
  'results.pricing_1.primary.badge': TRT_PRICING.membership.badge,
  'results.pricing_1.primary.title': TRT_PRICING.membership.title,
  'results.pricing_1.primary.price_original': TRT_PRICING.membership.priceOriginal,
  'results.pricing_1.primary.price_current': TRT_PRICING.membership.priceCurrent,
  'results.pricing_1.primary.savings': TRT_PRICING.membership.savings,
  'results.pricing_1.primary.bullets': TRT_PRICING.membership.bullets,
  'results.pricing_1.primary.terms': TRT_PRICING.membership.terms,
  'results.pricing_1.primary.cta_label': TRT_PRICING.membership.ctaLabel,
  'results.pricing_1.secondary.badge': TRT_PRICING.diagnosticOnly.badge,
  'results.pricing_1.secondary.title': TRT_PRICING.diagnosticOnly.title,
  'results.pricing_1.secondary.price_current': TRT_PRICING.diagnosticOnly.priceCurrent,
  'results.pricing_1.secondary.bullets': TRT_PRICING.diagnosticOnly.bullets,
  'results.pricing_1.secondary.cta_label': TRT_PRICING.diagnosticOnly.ctaLabel,

  // ---- Included Breakdown (centralized; edit TRT_PRICING.included) ----
  'results.included.heading': TRT_PRICING.included.heading,
  'results.included.item_1.title': TRT_PRICING.included.item_1.title,
  'results.included.item_1.body': TRT_PRICING.included.item_1.body,
  'results.included.item_1.value': TRT_PRICING.included.item_1.value,
  'results.included.item_2.title': TRT_PRICING.included.item_2.title,
  'results.included.item_2.body': TRT_PRICING.included.item_2.body,
  'results.included.item_2.value': TRT_PRICING.included.item_2.value,
  'results.included.item_3.title': TRT_PRICING.included.item_3.title,
  'results.included.item_3.body': TRT_PRICING.included.item_3.body,
  'results.included.item_3.value': TRT_PRICING.included.item_3.value,
  'results.included.item_4.title': TRT_PRICING.included.item_4.title,
  'results.included.item_4.body': TRT_PRICING.included.item_4.body,
  'results.included.item_4.value': TRT_PRICING.included.item_4.value,
  'results.included.total': TRT_PRICING.included.total
};
