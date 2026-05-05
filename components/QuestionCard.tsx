'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { useQuiz, type Answer } from '@/lib/quiz-store';
import { events } from '@/lib/tracking';
import { type Question, US_STATES } from '@/lib/quiz-data';
import { OptionButton } from './OptionButton';
import { SectionTag } from './SectionTag';
import { COPY, type CopySlot } from '@/content/copy';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1));
const YEARS = Array.from({ length: 2003 - 1934 + 1 }, (_, i) => String(2003 - i));

type Props = {
  question: Question;
  nextHref: string;
  backHref?: string;
};

export function QuestionCard({ question, nextHref, backHref }: Props) {
  const { answers, setAnswer } = useQuiz();
  const existing = answers[question.id];
  const [draft, setDraft] = useState<Answer | undefined>(existing);
  const router = useRouter();

  const canProceed = (() => {
    if (!draft) return false;
    if (question.type === 'dob') {
      const d = draft as { day: string; month: string; year: string };
      return Boolean(d?.day && d?.month && d?.year);
    }
    return Boolean(draft);
  })();

  function handleNext() {
    if (!canProceed || !draft) return;
    setAnswer(question.id, draft);
    events.questionAnswered(question.id);
    router.push(nextHref);
  }

  return (
    <section className="container-prose pt-6 pb-12">
      {backHref && (
        <Link href={backHref} className="mb-4 inline-flex items-center text-sm text-ink-700 hover:text-ink">
          ← Back
        </Link>
      )}

      <div className="my-4">
        <SectionTag section={question.section} position={question.sectionPosition} />
      </div>

      <h1 className="font-serif text-3xl leading-tight text-ink md:text-4xl">
        {question.text}
      </h1>

      {(() => {
        const slot = `q${question.id}.subhead` as CopySlot;
        const fromRegistry = (slot in COPY) ? COPY[slot] : '';
        const subhead = fromRegistry || question.subhead;
        return subhead ? <p className="mt-3 text-ink-700">{subhead}</p> : null;
      })()}

      <div className="mt-8 space-y-3">
        {question.type === 'single' && question.options?.map((opt) => (
          <OptionButton
            key={opt}
            label={opt}
            selected={draft === opt}
            onClick={() => setDraft(opt)}
          />
        ))}

        {question.type === 'dropdown' && (
          <select
            value={(draft as string) ?? ''}
            onChange={(e) => setDraft(e.target.value)}
            className="w-full rounded-xl border border-ink/20 bg-white/60 px-4 py-3 text-base"
          >
            <option value="">Select</option>
            {US_STATES.map((s) => <option key={s}>{s}</option>)}
          </select>
        )}

        {question.type === 'dob' && (
          <DOBSelect
            value={draft as { day: string; month: string; year: string } | undefined}
            onChange={setDraft}
          />
        )}
      </div>

      <div className="mt-10 flex justify-end">
        <button
          type="button"
          disabled={!canProceed}
          onClick={handleNext}
          className="rounded-xl bg-ink px-8 py-3 font-semibold text-cream transition disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </section>
  );
}

function DOBSelect({
  value,
  onChange
}: {
  value: { day: string; month: string; year: string } | undefined;
  onChange: (v: Answer) => void;
}) {
  const v = value ?? { day: '', month: '', year: '' };
  const update = (key: 'day' | 'month' | 'year') => (e: React.ChangeEvent<HTMLSelectElement>) =>
    onChange({ ...v, [key]: e.target.value });

  const cls = 'w-full rounded-xl border border-ink/20 bg-white/60 px-4 py-3 text-base';
  return (
    <div className="grid grid-cols-3 gap-3">
      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-700">Day</label>
        <select value={v.day} onChange={update('day')} className={cls}>
          <option value="">Day</option>
          {DAYS.map((d) => <option key={d}>{d}</option>)}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-700">Month</label>
        <select value={v.month} onChange={update('month')} className={cls}>
          <option value="">Month</option>
          {MONTHS.map((m) => <option key={m}>{m}</option>)}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-700">Year</label>
        <select value={v.year} onChange={update('year')} className={cls}>
          <option value="">Year</option>
          {YEARS.map((y) => <option key={y}>{y}</option>)}
        </select>
      </div>
    </div>
  );
}
