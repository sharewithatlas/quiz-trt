// Branching layer. Resolves the next step based on:
//  1. Per-question `onAnswer` shorthand (desugared to rules at config-load time)
//  2. Rule engine matches with action 'route' / 'skip' / 'show_interstitial'
//  3. Default: next item in `flow`

import type { FunnelConfig, Question, QuizState, Rule, StepRef } from './types';
import { evaluateRules } from './rules-engine';

/** Convert `onAnswer: { 'Yes': '/not-qualified', '*': 'next' }` to Rule[]. */
export function desugarOnAnswer(funnel: FunnelConfig): Rule[] {
  const out: Rule[] = [];
  for (const q of funnel.questions) {
    if (!q.onAnswer) continue;
    for (const [answerValue, target] of Object.entries(q.onAnswer)) {
      if (answerValue === '*') continue; // wildcard handled as fallback in resolveNext
      out.push({
        id: `__onAnswer_${q.id}_${answerValue}`,
        when: { field: `answers.${q.id}`, operator: 'eq', value: answerValue },
        action: target.startsWith('/')
          ? { type: 'route', to: target }
          : { type: 'skip', target },
        trigger: 'on-answer',
        haltOnMatch: true
      });
    }
  }
  return out;
}

/** Default-flow lookup: given current step ref, return next ref or undefined. */
export function defaultNextStep(funnel: FunnelConfig, currentRef: StepRef): StepRef | undefined {
  const idx = funnel.flow.findIndex((s) => s.type === currentRef.type && s.id === currentRef.id);
  if (idx < 0 || idx >= funnel.flow.length - 1) return undefined;
  return funnel.flow[idx + 1];
}

export function refToHref(funnel: FunnelConfig, ref: StepRef | undefined): string {
  if (!ref) return basePath(funnel) + '/submit';
  switch (ref.type) {
    case 'question': return `${basePath(funnel)}/questions/${ref.id}`;
    case 'interstitial': return `${basePath(funnel)}/interstitial/${ref.id}`;
    case 'calculate': return `${basePath(funnel)}/calculate`;
    case 'submit': return `${basePath(funnel)}/submit`;
    case 'results': return `${basePath(funnel)}/results`;
    case 'not-qualified': return `${basePath(funnel)}/not-qualified`;
  }
}

export function basePath(funnel: FunnelConfig): string {
  return `/${funnel.clientSlug}/${funnel.funnelSlug}`;
}

/** Run on-answer rules + per-question `onAnswer` wildcard fallback + default flow. */
export function resolveNextHref(
  state: QuizState,
  funnel: FunnelConfig,
  currentRef: StepRef
): { href: string; ruleFiredId?: string; ruleFiredAction?: string } {
  // 1. evaluate on-answer rules (rules array already includes desugared shorthands at registry-load time)
  const matches = evaluateRules(state, funnel, 'on-answer');
  for (const m of matches) {
    if (m.action.type === 'route') {
      return { href: m.action.to.startsWith('/') ? m.action.to : refToHref(funnel, { type: 'question', id: m.action.to }),
               ruleFiredId: m.rule.id, ruleFiredAction: 'route' };
    }
    if (m.action.type === 'skip') {
      const target = m.action.target === 'next'
        ? defaultNextStep(funnel, currentRef)
        : ({ type: 'question', id: m.action.target } as StepRef);
      return { href: refToHref(funnel, target), ruleFiredId: m.rule.id, ruleFiredAction: 'skip' };
    }
    if (m.action.type === 'show_interstitial') {
      return { href: refToHref(funnel, { type: 'interstitial', id: m.action.id }),
               ruleFiredId: m.rule.id, ruleFiredAction: 'show_interstitial' };
    }
    // mark_not_qualified / set_derived_value / assign_result_variant don't change next href on their own
  }

  // 2. wildcard from question.onAnswer['*'] (handled as last resort)
  if (currentRef.type === 'question') {
    const q: Question | undefined = funnel.questions.find((x) => x.id === currentRef.id);
    const wild = q?.onAnswer?.['*'];
    if (wild && wild !== 'next') {
      return { href: wild.startsWith('/') ? wild : refToHref(funnel, { type: 'question', id: wild }) };
    }
  }

  // 3. default flow
  return { href: refToHref(funnel, defaultNextStep(funnel, currentRef)) };
}
