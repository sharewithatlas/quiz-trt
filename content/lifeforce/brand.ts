// Lifeforce — shared brand defaults. Funnels can override via FunnelConfig.brand.

import type { BrandConfig } from '@/lib/funnels/shared/types';

export const LIFEFORCE_BRAND: BrandConfig = {
  wordmark: 'LIFEFORCE',
  logoSrc: '',
  logoAlt: 'Lifeforce',
  // Footer content — paste client-approved copy. Empty fields render as <Placeholder>.
  footer: {
    legalLinks: '',
    disclaimer: '',
    entity: ''
  }
};
