'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useQuiz } from '@/lib/quiz-store';
import { events } from '@/lib/tracking';
import { Copy } from '@/components/Copy';

export default function SubmitPage() {
  const { answers } = useQuiz();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, answers })
      });
      if (!res.ok) throw new Error('submit failed');
      events.leadSubmitted(email);
      sessionStorage.setItem('trt:firstName', firstName);
      router.push('/trt/results');
    } catch (e) {
      setError('Something went wrong. Please try again.');
      setSubmitting(false);
    }
  }

  const inputCls = 'w-full rounded-xl border border-ink/20 bg-white/60 px-4 py-3 text-base focus:border-ink focus:outline-none';

  return (
    <section className="container-prose pt-8 pb-16">
      <Copy slot="submit.headline" description="Pre-qualify headline (H1)" height="60px" className="font-serif text-3xl md:text-4xl text-ink" as="div" />
      <Copy slot="submit.intro" description="Intro paragraph under headline" height="80px" className="mt-3 text-ink-700" as="p" />

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-semibold text-ink">First name</label>
          <input
            type="text"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-ink">Last name</label>
          <input
            type="text"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-ink">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputCls}
          />
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
