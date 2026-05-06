'use client';

import { useEffect, useState } from 'react';
import { Copy } from '@/components/Copy';
import { Placeholder } from '@/components/Placeholder';
import { useFunnel } from '@/components/FunnelProvider';
import { BlockRenderer } from '@/components/funnel/BlockRenderer';
import { useQuizStore } from '@/lib/funnels/shared/quiz-store';
import { trackQuizEvent, markStepEntered } from '@/lib/funnels/shared/tracking';

export default function ResultsPage() {
  const funnel = useFunnel();
  const useStore = useQuizStore(funnel.clientSlug, funnel.funnelSlug, funnel.version);
  const [firstName, setFirstName] = useState('');

  useEffect(() => {
    const iso = markStepEntered('results');
    if (typeof window !== 'undefined') {
      setFirstName(sessionStorage.getItem(`${funnel.clientSlug}:${funnel.funnelSlug}:firstName`) ?? '');
    }
    trackQuizEvent({
      clientSlug: funnel.clientSlug,
      funnelSlug: funnel.funnelSlug,
      funnelVersion: funnel.version,
      sessionId: useStore.getState().sessionId,
      timestamp: iso,
      event: 'results_viewed',
      stepId: 'results',
      stepType: 'results',
      stepViewStartedAt: iso
    }, funnel.tracking);
  }, [funnel, useStore]);

  // Order: explicit funnel.resultsLayout if set, otherwise declaration order
  // from the copy map (filtered to results.*).
  const useBlocks = funnel.resultsBlocks && funnel.resultsBlocks.length > 0;
  const resultSlots = funnel.resultsLayout && funnel.resultsLayout.length > 0
    ? funnel.resultsLayout
    : Object.keys(funnel.copy).filter((k) => k.startsWith('results.'));

  return (
    <div className="container-prose py-10 space-y-8">
      <h1 className="font-serif text-3xl text-ink">
        {firstName ? `Hi ${firstName}!` : 'Your results'}
      </h1>

      {useBlocks ? (
        funnel.resultsBlocks!.map((b, i) => <BlockRenderer key={i} block={b} />)
      ) : resultSlots.length === 0 ? (
        <Placeholder name="results.*" description="Add slots to the funnel's copy registry." height="200px" />
      ) : (
        resultSlots.map((slot) => <Copy key={slot} slot={slot} />)
      )}
    </div>
  );
}
