// The single place that maps clientSlug/funnelSlug → FunnelConfig.
// Adding a new funnel = add one line here.
// At load time, we desugar each funnel's onAnswer shorthand into rules.

import type { FunnelConfig } from './shared/types';
import { desugarOnAnswer } from './shared/branching';

import { trtFunnel } from './lifeforce/trt';
import { menopauseFunnel } from './lifeforce/menopause';
import { weightLossFunnel } from './lifeforce/weight-loss';

const RAW: FunnelConfig[] = [trtFunnel, menopauseFunnel, weightLossFunnel];

// At module load: desugar onAnswer shorthand into rules.
const FUNNELS: FunnelConfig[] = RAW.map((f) => ({
  ...f,
  rules: [...desugarOnAnswer(f), ...f.rules]
}));

export function getFunnel(clientSlug: string, funnelSlug: string): FunnelConfig | undefined {
  return FUNNELS.find((f) => f.clientSlug === clientSlug && f.funnelSlug === funnelSlug);
}

export function listFunnels(): FunnelConfig[] {
  return FUNNELS;
}

export function listFunnelSlugs(): { clientSlug: string; funnelSlug: string }[] {
  return FUNNELS.map((f) => ({ clientSlug: f.clientSlug, funnelSlug: f.funnelSlug }));
}
