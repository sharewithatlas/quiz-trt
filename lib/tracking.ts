// Client-side tracking pixel hooks. Each pixel auto-skips if its env var is unset.
// Drop in NEXT_PUBLIC_* IDs to enable.

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
    ttq?: { track: (event: string, params?: Record<string, unknown>) => void };
  }
}

export const PIXELS = {
  meta: process.env.NEXT_PUBLIC_META_PIXEL_ID,
  ga4: process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID,
  tiktok: process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID,
  googleAds: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID
};

export function trackEvent(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;
  try {
    window.fbq?.('trackCustom', event, params);
    window.gtag?.('event', event, params);
    window.ttq?.track(event, params);
  } catch (e) {
    console.warn('[tracking] event failed', event, e);
  }
}

export const events = {
  quizStart: () => trackEvent('QuizStart'),
  questionAnswered: (id: number) => trackEvent('QuestionAnswered', { question_id: id }),
  leadSubmitted: (email: string) => trackEvent('Lead', { email }),
  resultsViewed: () => trackEvent('ViewContent', { content_name: 'results' })
};
