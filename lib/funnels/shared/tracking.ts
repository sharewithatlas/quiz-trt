// Single tracking entry point. Fans out to pixels + server endpoint.
// All events share one canonical payload shape for downstream analytics.

import type { SourceContext, StepType, TrackingOverrides } from './types';

export type EventName =
  | 'quiz_started'
  | 'question_viewed'
  | 'answer_selected'
  | 'answer_changed'
  | 'answer_committed'
  | 'question_completed'
  | 'interstitial_viewed'
  | 'calculate_completed'
  | 'rule_fired'
  | 'not_qualified'
  | 'submit_started'
  | 'lead_submitted'
  | 'results_viewed';

export type QuizEvent = {
  clientSlug: string;
  funnelSlug: string;
  funnelVersion: string;
  sessionId: string;
  timestamp: string;
  event: EventName;

  stepId?: string;
  stepType?: StepType;
  stepViewStartedAt?: string;
  stepViewDurationMs?: number;

  questionId?: string;
  questionText?: string;
  answer?: { value: unknown; label?: string };

  derived?: Record<string, unknown>;
  eligibility?: { qualified: boolean; reasons?: string[] };

  ruleFiredId?: string;
  ruleFiredAction?: string;
  nextRoute?: string;

  sourceContext?: SourceContext;
  metadata?: Record<string, unknown>;
};

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
    ttq?: { track: (event: string, params?: Record<string, unknown>) => void };
  }
}

const debugOn = typeof process !== 'undefined' && process.env.NEXT_PUBLIC_DEBUG_TRACKING === '1';

export function trackQuizEvent(payload: QuizEvent, overrides?: TrackingOverrides) {
  if (typeof window === 'undefined') return;
  if (debugOn) console.debug('[track]', payload.event, payload);

  const pixels = {
    meta: overrides?.pixels?.meta ?? process.env.NEXT_PUBLIC_META_PIXEL_ID,
    ga4: overrides?.pixels?.ga4 ?? process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID,
    tiktok: overrides?.pixels?.tiktok ?? process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID
  };

  try {
    if (pixels.meta) window.fbq?.('trackCustom', payload.event, payload as unknown as Record<string, unknown>);
    if (pixels.ga4) window.gtag?.('event', payload.event, payload as unknown as Record<string, unknown>);
    if (pixels.tiktok) window.ttq?.track(payload.event, payload as unknown as Record<string, unknown>);
  } catch (e) {
    if (debugOn) console.warn('[track] pixel dispatch failed', e);
  }

  // Server-side fan-out (AdTracktiv-ready stub). Endpoint configurable.
  const endpoint = overrides?.endpoint ?? '/api/track';
  // fire-and-forget; we don't await
  void fetch(endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true
  }).catch(() => { /* swallow */ });
}

// ---- step-view timer helpers ----
const stepStartTimes = new Map<string, number>();

export function markStepEntered(stepId: string): string {
  const now = new Date().toISOString();
  stepStartTimes.set(stepId, Date.now());
  return now;
}

export function durationSinceStepEntered(stepId: string): number | undefined {
  const start = stepStartTimes.get(stepId);
  if (start == null) return undefined;
  return Date.now() - start;
}
