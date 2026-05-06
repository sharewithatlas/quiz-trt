// Centralized pricing config for the TRT funnel.
// Edit values HERE and they propagate to every pricing slot via copy.ts.
// Confirm current offer values with client before populating.
//
// Slot fan-out (from content/lifeforce/trt/copy.ts):
//
//   membership          -> results.pricing_1.primary.*
//   diagnosticOnly      -> results.pricing_1.secondary.*
//   included.item_1..4  -> results.included.item_1..4.*
//   included.total      -> results.included.total
//   included.heading    -> results.included.heading
//
// `ctaHref` fields are read directly by lib/funnels/lifeforce/trt.ts
// and rendered as the pricing card button URL.

export const TRT_PRICING = {
  // Best-deal Membership card
  membership: {
    badge: '',           // e.g. 'Best deal'
    title: '',           // e.g. 'Lifeforce Testosterone Membership'
    priceOriginal: '',   // strikethrough retail (e.g. '$599')
    priceCurrent: '',    // current price (e.g. '$149/month')
    savings: '',         // savings line (e.g. 'Saving $450')
    bullets: '',         // multiline feature list
    terms: '',           // terms line (e.g. 'Then only $149/month. Cancel anytime')
    ctaLabel: '',        // button label
    ctaHref: ''          // checkout URL
  },

  // Full-price Diagnostic-Only card
  diagnosticOnly: {
    badge: '',
    title: '',
    priceCurrent: '',
    bullets: '',
    ctaLabel: '',
    ctaHref: ''
  },

  // "What's included" breakdown — 4 line items + heading + total
  included: {
    heading: '',
    item_1: { title: '', body: '', value: '' },
    item_2: { title: '', body: '', value: '' },
    item_3: { title: '', body: '', value: '' },
    item_4: { title: '', body: '', value: '' },
    total: ''
  }
};
