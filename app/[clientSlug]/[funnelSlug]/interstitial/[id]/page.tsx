'use client';

import { useEffect } from 'react';
import { useRouter, useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { Copy } from '@/components/Copy';
import { Placeholder } from '@/components/Placeholder';
import { useFunnel } from '@/components/FunnelProvider';
import { useQuizStore } from '@/lib/funnels/shared/quiz-store';
import {
  trackQuizEvent,
  markStepEntered,
  durationSinceStepEntered
} from '@/lib/funnels/shared/tracking';
import { defaultNextStep, refToHref, basePath } from '@/lib/funnels/shared/branching';
import type { Interstitial } from '@/lib/funnels/shared/types';

export default function InterstitialPage() {
  const funnel = useFunnel();
  const useStore = useQuizStore(funnel.clientSlug, funnel.funnelSlug, funnel.version);
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const interstitial: Interstitial | undefined = funnel.interstitials.find((i) => i.id === id);

  useEffect(() => {
    if (!interstitial) return;
    const iso = markStepEntered(id);
    trackQuizEvent({
      clientSlug: funnel.clientSlug,
      funnelSlug: funnel.funnelSlug,
      funnelVersion: funnel.version,
      sessionId: useStore.getState().sessionId,
      timestamp: iso,
      event: 'interstitial_viewed',
      stepId: id,
      stepType: 'interstitial',
      stepViewStartedAt: iso,
      metadata: { objective: interstitial.objective, ...interstitial.tracking?.metadata }
    }, funnel.tracking);
  }, [id, interstitial, funnel, useStore]);

  if (!interstitial) {
    return notFound();
  }

  const headlineSlot = interstitial.headline && funnel.copy[interstitial.headline] !== undefined ? interstitial.headline : null;
  const bodySlot = interstitial.body && funnel.copy[interstitial.body] !== undefined ? interstitial.body : null;

  function onContinue() {
    const next = interstitial!.next
      ? interstitial!.next
      : refToHref(funnel, defaultNextStep(funnel, { type: 'interstitial', id }));
    const stepDuration = durationSinceStepEntered(id);
    trackQuizEvent({
      clientSlug: funnel.clientSlug,
      funnelSlug: funnel.funnelSlug,
      funnelVersion: funnel.version,
      sessionId: useStore.getState().sessionId,
      timestamp: new Date().toISOString(),
      event: 'question_completed',
      stepId: id,
      stepType: 'interstitial',
      nextRoute: next,
      stepViewDurationMs: stepDuration
    }, funnel.tracking);
    router.push(next);
  }

  return (
    <section className="container-prose pt-8 pb-16">
      {headlineSlot ? (
        <Copy slot={headlineSlot} className="font-serif text-3xl md:text-4xl text-ink" />
      ) : interstitial.headline ? (
        <h1 className="font-serif text-3xl md:text-4xl text-ink">{interstitial.headline}</h1>
      ) : (
        <Placeholder name={`interstitial.${id}.headline`} description="Interstitial headline" height="60px" />
      )}

      {bodySlot ? (
        <Copy slot={bodySlot} className="mt-4 text-ink-700" as="p" />
      ) : interstitial.body ? (
        <p className="mt-4 text-ink-700 whitespace-pre-wrap">{interstitial.body}</p>
      ) : (
        <Placeholder name={`interstitial.${id}.body`} description="Interstitial body copy" height="120px" />
      )}

      <div className="mt-8">
        <button
          type="button"
          onClick={onContinue}
          className="rounded-xl bg-ink px-8 py-3 font-semibold text-cream"
        >
          {interstitial.ctaLabel || 'Continue'}
        </button>
      </div>

      <div className="mt-6 text-center">
        <Link href={basePath(funnel)} className="text-xs text-ink-700 underline">Back to start</Link>
      </div>
    </section>
  );
}
