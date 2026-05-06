'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFunnel } from '@/components/FunnelProvider';
import { useQuizStore } from '@/lib/funnels/shared/quiz-store';
import { runCalculations } from '@/lib/funnels/shared/calculations';
import { trackQuizEvent, markStepEntered } from '@/lib/funnels/shared/tracking';
import { defaultNextStep, refToHref } from '@/lib/funnels/shared/branching';

export default function CalculatePage() {
  const funnel = useFunnel();
  const useStore = useQuizStore(funnel.clientSlug, funnel.funnelSlug, funnel.version);
  const router = useRouter();

  useEffect(() => {
    const iso = markStepEntered('calculate');
    const calcStep = funnel.flow.find((s) => s.type === 'calculate');
    const names = (calcStep && (calcStep as { calculations?: string[] }).calculations) || [];
    if (names.length === 0) {
      // No calculations declared — just route forward
      const next = refToHref(funnel, defaultNextStep(funnel, { type: 'calculate', id: 'calculate' }));
      router.push(next);
      return;
    }
    const merged = runCalculations(useStore.getState(), funnel, names);
    for (const [k, v] of Object.entries(merged)) useStore.getState().setDerived(k, v);
    trackQuizEvent({
      clientSlug: funnel.clientSlug,
      funnelSlug: funnel.funnelSlug,
      funnelVersion: funnel.version,
      sessionId: useStore.getState().sessionId,
      timestamp: iso,
      event: 'calculate_completed',
      stepId: 'calculate',
      stepType: 'calculate',
      derived: merged
    }, funnel.tracking);
    const next = refToHref(funnel, defaultNextStep(funnel, { type: 'calculate', id: 'calculate' }));
    router.push(next);
  }, [funnel, useStore, router]);

  return (
    <section className="container-prose py-16 text-center">
      <p className="text-ink-700">Calculating…</p>
    </section>
  );
}
