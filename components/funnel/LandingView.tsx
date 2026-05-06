'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Copy } from '@/components/Copy';
import { OptionButton } from '@/components/OptionButton';
import { useFunnel } from '@/components/FunnelProvider';
import { useQuizStore } from '@/lib/funnels/shared/quiz-store';
import {
  trackQuizEvent,
  markStepEntered,
  durationSinceStepEntered
} from '@/lib/funnels/shared/tracking';
import { resolveNextHref, basePath } from '@/lib/funnels/shared/branching';
import type { Question } from '@/lib/funnels/shared/types';

// Renders a landing screen that combines:
//  - all `hero.*` copy slots (in the funnel's declared order)
//  - the first question if it is the first step in `flow`
//  - any `below_fold.*` copy slots underneath
export function LandingView() {
  const funnel = useFunnel();
  const useStore = useQuizStore(funnel.clientSlug, funnel.funnelSlug, funnel.version);
  const firstStep = funnel.flow[0];
  const isFirstQuestion = firstStep?.type === 'question';
  const q1: Question | undefined = isFirstQuestion
    ? funnel.questions.find((q) => q.id === firstStep.id)
    : undefined;

  const heroSlots = Object.keys(funnel.copy).filter((k) => k.startsWith('hero.'));
  const belowSlots = Object.keys(funnel.copy).filter((k) => k.startsWith('below_fold.'));

  const existing = useStore((s) => s.answers[q1?.id ?? '__none__']);
  const setAnswer = useStore((s) => s.setAnswer);
  const [draft, setDraft] = useState<string | undefined>(existing as string | undefined);
  const [stepStartIso, setStepStartIso] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    if (!q1) return;
    const iso = markStepEntered(q1.id);
    setStepStartIso(iso);
    trackQuizEvent({
      clientSlug: funnel.clientSlug,
      funnelSlug: funnel.funnelSlug,
      funnelVersion: funnel.version,
      sessionId: useStore.getState().sessionId,
      timestamp: iso,
      event: 'question_viewed',
      stepId: q1.id,
      stepType: 'question',
      questionId: q1.id,
      questionText: q1.text,
      stepViewStartedAt: iso
    }, funnel.tracking);
  }, [q1, funnel, useStore]);

  function handleNext() {
    if (!draft || !q1) return;
    setAnswer(q1.id, draft);
    const now = new Date().toISOString();
    trackQuizEvent({
      clientSlug: funnel.clientSlug,
      funnelSlug: funnel.funnelSlug,
      funnelVersion: funnel.version,
      sessionId: useStore.getState().sessionId,
      timestamp: now,
      event: 'answer_committed',
      stepId: q1.id,
      stepType: 'question',
      questionId: q1.id,
      questionText: q1.text,
      answer: { value: draft, label: draft },
      stepViewStartedAt: stepStartIso,
      stepViewDurationMs: durationSinceStepEntered(q1.id)
    }, funnel.tracking);
    const { href, ruleFiredId, ruleFiredAction } = resolveNextHref(
      useStore.getState(),
      funnel,
      { type: 'question', id: q1.id }
    );
    trackQuizEvent({
      clientSlug: funnel.clientSlug,
      funnelSlug: funnel.funnelSlug,
      funnelVersion: funnel.version,
      sessionId: useStore.getState().sessionId,
      timestamp: new Date().toISOString(),
      event: 'question_completed',
      stepId: q1.id,
      stepType: 'question',
      questionId: q1.id,
      ruleFiredId,
      ruleFiredAction,
      nextRoute: href
    }, funnel.tracking);
    router.push(href);
  }

  const skipHref = funnel.flow[1]
    ? `${basePath(funnel)}/${funnel.flow[1].type === 'question' ? `questions/${funnel.flow[1].id}` : funnel.flow[1].type}`
    : `${basePath(funnel)}/submit`;

  return (
    <div>
      <section className="container-prose pt-8 pb-12 md:pt-12">
        {heroSlots.map((slot) => (
          <Copy key={slot} slot={slot} />
        ))}

        {q1 && (
          <div className="mt-8">
            <h2 className="font-serif text-2xl font-semibold text-ink">{q1.text}</h2>
            <div className={`mt-6 ${q1.options && q1.options.length > 6 ? 'grid grid-cols-2 gap-3 sm:grid-cols-3' : 'space-y-3'}`}>
              {q1.options?.map((opt) => (
                <OptionButton key={opt} label={opt} selected={draft === opt} onClick={() => setDraft(opt)} />
              ))}
            </div>
            <div className="mt-8 flex justify-end">
              <button
                type="button"
                disabled={!draft}
                onClick={handleNext}
                className="rounded-xl bg-ink px-8 py-3 font-semibold text-cream transition disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>

      {belowSlots.length > 0 && (
        <section className="container-prose py-12 space-y-6">
          {belowSlots.map((slot) => (
            <Copy key={slot} slot={slot} />
          ))}
          <div className="text-center">
            <Link href={skipHref} className="text-sm text-ink-700 underline">
              Skip to quiz →
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
