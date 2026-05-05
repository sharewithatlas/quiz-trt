'use client';

import { useEffect, useState } from 'react';
import { events } from '@/lib/tracking';
import { Copy } from '@/components/Copy';

export default function ResultsPage() {
  const [firstName, setFirstName] = useState<string>('');

  useEffect(() => {
    events.resultsViewed();
    if (typeof window !== 'undefined') {
      setFirstName(sessionStorage.getItem('trt:firstName') ?? '');
    }
  }, []);

  return (
    <div className="container-prose py-10 space-y-8">
      <Copy slot="results.estimate_card" description="'Based on your responses…' estimate card" height="160px" />

      <div>
        <h1 className="font-serif text-3xl text-ink">
          {firstName ? `You made it one step closer, ${firstName}!` : 'You made it one step closer!'}
        </h1>
        <Copy slot="results.intro_subhead" description="One-line subhead under greeting" />
      </div>

      <Copy slot="results.narrative_block" description="Multi-paragraph narrative — 'most men don't seek treatment'" height="200px" as="div" />

      <div>
        <Copy slot="results.founder_quote" description="Founder pull-quote" height="160px" as="div" className="font-serif text-xl text-ink" />
        <Copy slot="results.founder_attribution" description="Founder name + role attribution" />
      </div>

      <Copy slot="results.value_prop_paragraph" description="Brand value prop / 'address root cause'" height="120px" as="p" />

      <Copy slot="results.next_steps" description="'Here's what's next' — 4-step sequence with imagery" height="320px" />

      <Copy slot="results.countdown_banner_1" description="Countdown timer + 'Stop delaying…' headline" height="120px" />

      <Copy slot="results.pricing_compare" description="Pricing comparison cards (Membership vs Diagnostic)" height="500px" />

      <Copy slot="results.why_lifeforce" description="'Why [Brand]?' — 4 cards" height="400px" />

      <Copy slot="results.pricing_compare_2" description="Second pricing block + 'What's included' breakdown" height="500px" />

      <Copy slot="results.featured_in" description="'Featured In' — testimonials + press logos" height="280px" />

      <Copy slot="results.final_cta" description="Final CTA + offer expiry" height="120px" />
    </div>
  );
}
