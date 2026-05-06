'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Copy } from '@/components/Copy';
import { useFunnel } from '@/components/FunnelProvider';
import { useQuizStore } from '@/lib/funnels/shared/quiz-store';
import { trackQuizEvent, markStepEntered, durationSinceStepEntered } from '@/lib/funnels/shared/tracking';
import { basePath } from '@/lib/funnels/shared/branching';

export default function SubmitPage() {
  const funnel = useFunnel();
  const useStore = useQuizStore(funnel.clientSlug, funnel.funnelSlug, funnel.version);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stepStartIso, setStepStartIso] = useState('');
  const router = useRouter();

  useEffect(() => {
    const iso = markStepEntered('submit');
    setStepStartIso(iso);
    trackQuizEvent({
      clientSlug: funnel.clientSlug,
      funnelSlug: funnel.funnelSlug,
      funnelVersion: funnel.version,
      sessionId: useStore.getState().sessionId,
      timestamp: iso,
      event: 'submit_started',
      stepId: 'submit',
      stepType: 'submit',
      stepViewStartedAt: iso
    }, funnel.tracking);
  }, [funnel, useStore]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const state = useStore.getState();
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          clientSlug: funnel.clientSlug,
          funnelSlug: funnel.funnelSlug,
          firstName,
          lastName,
          email,
          state
        })
      });
      if (!res.ok) throw new Error('submit failed');
      sessionStorage.setItem(`${funnel.clientSlug}:${funnel.funnelSlug}:firstName`, firstName);
      trackQuizEvent({
        clientSlug: funnel.clientSlug,
        funnelSlug: funnel.funnelSlug,
        funnelVersion: funnel.version,
        sessionId: state.sessionId,
        timestamp: new Date().toISOString(),
        event: 'lead_submitted',
        stepId: 'submit',
        stepType: 'submit',
        answer: { value: email, label: 'email' },
        eligibility: state.eligibility,
        derived: state.derived,
        stepViewStartedAt: stepStartIso,
        stepViewDurationMs: durationSinceStepEntered('submit')
      }, funnel.tracking);
      router.push(`${basePath(funnel)}/results`);
    } catch (e) {
      setError('Something went wrong. Please try again.');
      setSubmitting(false);
    }
  }

  const inputCls = 'w-full rounded-xl border border-ink/20 bg-white/60 px-4 py-3 text-base focus:border-ink focus:outline-none';

  return (
    <section className="container-prose pt-8 pb-16">
      <Copy slot="submit.headline" description="Pre-qualify headline (H1)" height="60px" className="font-serif text-3xl md:text-4xl text-ink" />
      <Copy slot="submit.intro" description="Intro paragraph under headline" height="80px" className="mt-3 text-ink-700" as="p" />

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-semibold text-ink">First name</label>
          <input type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-ink">Last name</label>
          <input type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-ink">Email</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
        </div>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="mt-2 w-full rounded-xl bg-ink py-3 font-semibold text-cream transition disabled:opacity-50"
        >
          {submitting ? 'Saving…' : 'Save And Continue'}
        </button>
      </form>
    </section>
  );
}
