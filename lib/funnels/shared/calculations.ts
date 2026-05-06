// Run named calculation functions registered in FunnelConfig.calculations.
// Each fn receives the current state and returns derived KV pairs to merge.

import type { CalculationFn, FunnelConfig, QuizState } from './types';

export function runCalculations(
  state: QuizState,
  funnel: FunnelConfig,
  names: string[]
): Record<string, unknown> {
  const merged: Record<string, unknown> = {};
  for (const name of names) {
    const fn: CalculationFn | undefined = funnel.calculations[name];
    if (!fn) {
      console.warn(`[calculations] unknown calculation: ${name}`);
      continue;
    }
    const out = fn(state);
    Object.assign(merged, out);
  }
  return merged;
}
