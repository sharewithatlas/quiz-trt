'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/lib/quiz-store';
import { events } from '@/lib/tracking';
import { getQuestion } from '@/lib/quiz-data';
import { OptionButton } from '@/components/OptionButton';
import { Copy } from '@/components/Copy';

export default function LandingPage() {
  const q1 = getQuestion(1)!;
  const { answers, setAnswer } = useQuiz();
  const [draft, setDraft] = useState<string | undefined>(answers[1] as string | undefined);
  const router = useRouter();

  useEffect(() => { events.quizStart(); }, []);

  function handleNext() {
    if (!draft) return;
    setAnswer(1, draft);
    events.questionAnswered(1);
    router.push('/trt/questions/2');
  }

  return (
    <div>
      <section className="container-prose pt-8 pb-12 md:pt-12">
        <Copy slot="hero.eyebrow" description="Eyebrow row: small label + amber promo badge" />
        <Copy slot="hero.headline" description="Serif H1 with stylized underline accent" height="100px" className="font-serif text-4xl md:text-5xl text-ink mt-4" />
        <Copy slot="hero.subhead" description="Body sub-copy under hero, 1–2 sentences" height="60px" className="text-ink-700 mt-4" />
        <Copy slot="hero.trust_strip" description="HSA/FSA-eligible badge + Learn More link" />

        <div className="mt-8">
          <h2 className="font-serif text-2xl font-semibold text-ink">{q1.text}</h2>
          <div className="mt-6 space-y-3">
            {q1.options?.map((opt) => (
              <OptionButton
                key={opt}
                label={opt}
                selected={draft === opt}
                onClick={() => setDraft(opt)}
              />
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
      </section>

      <section className="container-prose py-12 space-y-6">
        <Copy slot="below_fold.urgency_banner" description="Lock-in pricing banner with CTA" height="80px" />
        <Copy slot="below_fold.how_it_works" description="'How it works' — 4-step visual sequence" height="320px" />
        <Copy slot="below_fold.cta_block_1" description="Mid-page CTA (Take The Quiz Now)" height="80px" />
        <Copy slot="below_fold.trust_grid" description="3-up trust blocks (Privacy / Expert Advice / Success Stories)" height="400px" />
        <div className="text-center">
          <Link href="/trt/questions/2" className="text-sm text-ink-700 underline">
            Skip to quiz →
          </Link>
        </div>
      </section>
    </div>
  );
}
