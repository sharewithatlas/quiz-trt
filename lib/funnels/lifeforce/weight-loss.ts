// Lifeforce Weight Loss — EMPTY SHELL.
//
// This funnel is intentionally not authored. Populate the fields below
// when client-approved questions/copy/branching are ready. See:
//   - lib/funnels/shared/types.ts for available shapes
//   - lib/funnels/lifeforce/menopause.ts and trt.ts for working examples
//
// While this is empty, the route /lifeforce/weight-loss renders a
// 'Coming soon' state via the dynamic [clientSlug]/[funnelSlug] handler.

import type { FunnelConfig } from '../shared/types';
import { LIFEFORCE_BRAND } from '@/content/lifeforce/brand';
import { WEIGHT_LOSS_COPY } from '@/content/lifeforce/weight-loss/copy';

export const weightLossFunnel: FunnelConfig = {
  clientSlug: 'lifeforce',
  funnelSlug: 'weight-loss',
  displayName: 'Weight Loss Quiz',
  version: 'v1',

  questions: [],          // TODO
  interstitials: [],      // TODO — interstitials are first-class steps; populate as needed
  flow: [],               // TODO — ordered StepRef[] defining default flow
  rules: [],              // TODO — branching/eligibility/derived rules
  calculations: {},       // TODO — register named calculation fns (e.g. bmi)

  copy: WEIGHT_LOSS_COPY,
  brand: { ...LIFEFORCE_BRAND, title: 'Weight Loss Quiz' },
  klaviyo: {
    defaultTags: ['quiz:weight-loss', 'funnel-version:v1']
    // TODO: customProperties + listId once Klaviyo list is set up
  }
};
