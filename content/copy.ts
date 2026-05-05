// Single source of truth for marketing copy across the funnel.
// Each slot is a key → string. Empty string renders a visible <Placeholder>
// in the UI. Drop in the captured prose from /reference/FUNNEL_SPEC.md.
//
// Keys are flat dotted paths so you can search-and-replace easily.

export type CopySlot = keyof typeof COPY;

export const COPY = {
  // --- Landing page ---
  'hero.eyebrow': '',
  'hero.headline': '',
  'hero.subhead': '',
  'hero.trust_strip': '',
  'below_fold.urgency_banner': '',
  'below_fold.how_it_works': '',
  'below_fold.cta_block_1': '',
  'below_fold.trust_grid': '',

  // --- Submit page ---
  'submit.headline': '',
  'submit.intro': '',

  // --- Results page ---
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

  // --- Question subheads (paired with quiz-data.ts) ---
  'q5.subhead': '',
  'q7.subhead': '',
  'q8.subhead': '',
  'q9.subhead': '',
  'q13.subhead': ''
} as const satisfies Record<string, string>;

export function getCopy(slot: CopySlot): string {
  return COPY[slot] ?? '';
}
