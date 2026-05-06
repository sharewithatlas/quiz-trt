// Capture and persist sourceContext from URL params on first interaction.

import type { SourceContext } from './types';

const KNOWN = [
  'adId', 'campaignId', 'creativeId',
  'advertorialId', 'landingPageId', 'discoverRunId', 'offerId'
] as const;

export function readSourceContextFromURL(): SourceContext {
  if (typeof window === 'undefined') return {};
  const url = new URL(window.location.href);
  const ctx: SourceContext = {};

  // accept either camelCase or snake_case in URL params
  for (const key of KNOWN) {
    const v = url.searchParams.get(key) || url.searchParams.get(toSnake(key));
    if (v) (ctx as Record<string, unknown>)[key] = v;
  }

  // utm_* params
  const utm: Record<string, string> = {};
  url.searchParams.forEach((v, k) => {
    if (k.startsWith('utm_')) utm[k] = v;
  });
  if (Object.keys(utm).length) ctx.utm = utm;

  return ctx;
}

function toSnake(s: string): string {
  return s.replace(/[A-Z]/g, (m) => '_' + m.toLowerCase());
}
