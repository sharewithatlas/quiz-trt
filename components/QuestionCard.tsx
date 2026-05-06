'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { OptionButton } from './OptionButton';
import { SectionTag } from './SectionTag';
import { Copy } from './Copy';
import { useFunnel } from './FunnelProvider';
import { useQuizStore } from '@/lib/funnels/shared/quiz-store';
import { US_STATES } from '@/lib/funnels/shared/options';
import { resolveNextHref } from '@/lib/funnels/shared/branching';
import {
  trackQuizEvent,
  markStepEntered,
  durationSinceStepEntered
} from '@/lib/funnels/shared/tracking';
import type { Answer, Question, StepRef } from '@/lib/funnels/shared/types';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1));
const YEARS = Array.from({ length: 2003 - 1934 + 1 }, (_, i) => String(2003 - i));

type Props = { question: Question; backHref?: string };

export function QuestionCard({ question, backHref }: Props) {
  const funnel = useFunnel();
  const useStore = useQuizStore(funnel.clientSlug, funnel.funnelSlug, funnel.version);
  const existing = useStore((s) => s.answers[question.id]);
  const setAnswer = useStore((s) => s.setAnswer);
  const pushHistory = useStore((s) => s.pushHistory);
  const [draft, setDraft] = useState<Answer | undefined>(existing);
  const [stepStartIso, setStepStartIso] = useState<string>('');
  const router = useRouter();
  const fired = useRef(false);

  // step entered: question_viewed
  useEffect(() => {
    const iso = markStepEntered(question.id);
    setStepStartIso(iso);
    trackQuizEvent({
      clientSlug: funnel.clientSlug,
      funnelSlug: funnel.funnelSlug,
      funnelVersion: funnel.version,
      sessionId: useStore.getState().sessionId,
      timestamp: iso,
      event: 'question_viewed',
      stepId: question.id,
      stepType: 'question',
      questionId: question.id,
      questionText: question.text,
      stepViewStartedAt: iso
    }, funnel.tracking);
  }, [question.id, funnel, useStore]);

  const isMulti = question.inputType === 'multi' || question.inputType === 'multi-limited';
  const selected: string[] = isMulti
    ? (Array.isArray(draft) ? draft : [])
    : draft ? [draft as string] : [];
  const max = question.maxSelections ?? Infinity;
  const atMax = isMulti && selected.length >= max;

  const dropdownOptions = question.options ?? (question.inputType === 'dropdown' ? US_STATES : []);

  const canProceed = (() => {
    if (question.required === false) return true;
    if (!draft) return false;
    if (question.inputType === 'dob') {
      const d = draft as { day: string; month: string; year: string };
      return Boolean(d?.day && d?.month && d?.year);
    }
    if (isMulti) return Array.isArray(draft) && draft.length > 0;
    return Boolean(draft);
  })();

  function fireAnswerChanged(value: Answer, label?: string) {
    trackQuizEvent({
      clientSlug: funnel.clientSlug,
      funnelSlug: funnel.funnelSlug,
      funnelVersion: funnel.version,
      sessionId: useStore.getState().sessionId,
      timestamp: new Date().toISOString(),
      event: 'answer_changed',
      stepId: question.id,
      stepType: 'question',
      questionId: question.id,
      questionText: question.text,
      answer: { value, label }
    }, funnel.tracking);
  }

  function fireAndAdvance(value: Answer, label?: string) {
    if (fired.current) return;
    fired.current = true;
    setAnswer(question.id, value);
    pushHistory(question.id);
    const now = new Date().toISOString();
    const dur = durationSinceStepEntered(question.id);
    trackQuizEvent({
      clientSlug: funnel.clientSlug,
      funnelSlug: funnel.funnelSlug,
      funnelVersion: funnel.version,
      sessionId: useStore.getState().sessionId,
      timestamp: now,
      event: 'answer_committed',
      stepId: question.id,
      stepType: 'question',
      questionId: question.id,
      questionText: question.text,
      answer: { value, label },
      stepViewStartedAt: stepStartIso,
      stepViewDurationMs: dur
    }, funnel.tracking);
    const ref: StepRef = { type: 'question', id: question.id };
    const { href, ruleFiredId, ruleFiredAction } = resolveNextHref(useStore.getState(), funnel, ref);
    trackQuizEvent({
      clientSlug: funnel.clientSlug,
      funnelSlug: funnel.funnelSlug,
      funnelVersion: funnel.version,
      sessionId: useStore.getState().sessionId,
      timestamp: new Date().toISOString(),
      event: 'question_completed',
      stepId: question.id,
      stepType: 'question',
      questionId: question.id,
      questionText: question.text,
      answer: { value, label },
      ruleFiredId,
      ruleFiredAction,
      nextRoute: href,
      stepViewStartedAt: stepStartIso,
      stepViewDurationMs: durationSinceStepEntered(question.id)
    }, funnel.tracking);
    router.push(href);
  }

  function pickSingle(opt: string) {
    setDraft(opt);
    fireAnswerChanged(opt, opt);
    if (question.autoAdvance && (question.inputType === 'single' || question.inputType === 'dropdown')) {
      setTimeout(() => fireAndAdvance(opt, opt), 200);
    }
  }

  function toggleMulti(opt: string) {
    const next = selected.includes(opt) ? selected.filter((s) => s !== opt) : (selected.length < max ? [...selected, opt] : selected);
    setDraft(next);
    fireAnswerChanged(next);
  }

  function setDob(v: { day: string; month: string; year: string }) {
    setDraft(v);
    fireAnswerChanged(v);
  }

  function handleNextClick() {
    if (!canProceed || draft === undefined) return;
    fireAndAdvance(draft);
  }

  // Subhead from copy registry: prefer slot `q{id}.subhead`, fall back to inline subhead.
  const subhead = funnel.copy[`q${question.id}.subhead`] || question.subhead;

  return (
    <section className="container-prose pt-6 pb-12">
      {backHref && (
        <Link href={backHref} className="mb-4 inline-flex items-center text-sm text-ink-700 hover:text-ink">
          ← Back
        </Link>
      )}

      <div className="my-4">
        <SectionTag section={question.section ?? ''} position={question.sectionPosition} />
      </div>

      <h1 className="font-serif text-3xl leading-tight text-ink md:text-4xl">{question.text}</h1>
      {subhead && <p className="mt-3 text-ink-700">{subhead}</p>}
      {question.inputType === 'multi-limited' && (
        <div className="mt-2 text-xs text-ink-700">{selected.length} / {max} selected</div>
      )}

      <div className="mt-8 space-y-3">
        {question.inputType === 'single' && question.options?.map((opt) => (
          <OptionButton key={opt} label={opt} selected={draft === opt} onClick={() => pickSingle(opt)} />
        ))}

        {isMulti && question.options?.map((opt) => {
          const isSelected = selected.includes(opt);
          return (
            <OptionButton key={opt} label={opt} selected={isSelected} variant="checkbox"
              disabled={!isSelected && atMax} onClick={() => toggleMulti(opt)} />
          );
        })}

        {question.inputType === 'dropdown' && (
          <select
            value={(draft as string) ?? ''}
            onChange={(e) => pickSingle(e.target.value)}
            className="w-full rounded-xl border border-ink/20 bg-white/60 px-4 py-3 text-base"
          >
            <option value="">Select</option>
            {dropdownOptions.map((s) => <option key={s}>{s}</option>)}
          </select>
        )}

        {question.inputType === 'dob' && (
          <DOBSelect value={draft as { day: string; month: string; year: string } | undefined} onChange={setDob} />
        )}
      </div>

      <div className="mt-10 flex justify-end">
        <button
          type="button"
          disabled={!canProceed}
          onClick={handleNextClick}
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
  onChange: (v: { day: string; month: string; year: string }) => void;
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
