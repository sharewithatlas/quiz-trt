'use client';

import { useEffect } from 'react';
import { Copy } from '@/components/Copy';
import { useFunnel } from '@/components/FunnelProvider';
import { useQuizStore } from '@/lib/funnels/shared/quiz-store';
import { trackQuizEvent, markStepEntered } from '@/lib/funnels/shared/tracking';

export default function NotQualifiedPage() {
  const funnel = useFunnel();
  const useStore = useQuizStore(funnel.clientSlug, funnel.funnelSlug, funnel.version);

  useEffect(() => {
    const iso = markStepEntered('not-qualified');
    const state = useStore.getState();
    trackQuizEvent({
      clientSlug: funnel.clientSlug,
      funnelSlug: funnel.funnelSlug,
      funnelVersion: funnel.version,
      sessionId: state.sessionId,
      timestamp: iso,
      event: 'not_qualified',
      stepId: 'not-qualified',
      stepType: 'not-qualified',
      eligibility: state.eligibility,
      stepViewStartedAt: iso
    }, funnel.tracking);
  }, [funnel, useStore]);

  return (
    <section className="container-prose py-12 space-y-6">
      <Copy slot="not_qualified.headline" description="Headline shown when user doesn't qualify" className="font-serif text-3xl text-ink" />
      <Copy slot="not_qualified.body" description="Explanation + alternate next-step suggestion" height="200px" as="p" />
    </section>
  );
}
