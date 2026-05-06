// Pure rule evaluator + action runner.
// State is read-only; actions describe outcomes that callers apply.

import type { Action, FunnelConfig, Op, Predicate, QuizState, Rule } from './types';

export function getFieldValue(state: QuizState, path: string): unknown {
  // dotted path: 'answers.q1', 'derived.bmi', 'eligibility.qualified'
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc == null) return undefined;
    return (acc as Record<string, unknown>)[key];
  }, state as unknown);
}

export function evalPredicate(state: QuizState, p: Predicate): boolean {
  if ('all' in p) return p.all.every((c) => evalPredicate(state, c));
  if ('any' in p) return p.any.some((c) => evalPredicate(state, c));
  if ('not' in p) return !evalPredicate(state, p.not);
  return applyOp(getFieldValue(state, p.field), p.operator, p.value);
}

function applyOp(left: unknown, op: Op, right: unknown): boolean {
  switch (op) {
    case 'eq': return left === right;
    case 'neq': return left !== right;
    case 'lt': return typeof left === 'number' && typeof right === 'number' && left < right;
    case 'lte': return typeof left === 'number' && typeof right === 'number' && left <= right;
    case 'gt': return typeof left === 'number' && typeof right === 'number' && left > right;
    case 'gte': return typeof left === 'number' && typeof right === 'number' && left >= right;
    case 'in': return Array.isArray(right) && right.includes(left as never);
    case 'nin': return Array.isArray(right) && !right.includes(left as never);
    case 'contains':
      if (Array.isArray(left)) return left.includes(right as never);
      if (typeof left === 'string') return left.includes(String(right));
      return false;
    case 'exists': return left !== undefined && left !== null;
  }
}

export type RuleMatch = { rule: Rule; action: Action };

/** Evaluate rules at a trigger, in declared order. Returns matched rules.
 *  Default haltOnMatch=true: stops at first match. */
export function evaluateRules(
  state: QuizState,
  funnel: FunnelConfig,
  trigger: 'on-answer' | 'pre-render' | 'post-calculate',
  cycleGuard: Set<string> = new Set()
): RuleMatch[] {
  const matches: RuleMatch[] = [];
  for (const rule of funnel.rules) {
    if ((rule.trigger ?? 'on-answer') !== trigger) continue;
    if (cycleGuard.has(rule.id)) {
      throw new Error(`Rules engine: cycle detected at rule ${rule.id}`);
    }
    if (evalPredicate(state, rule.when)) {
      cycleGuard.add(rule.id);
      matches.push({ rule, action: rule.action });
      if (rule.haltOnMatch !== false) break;
    }
  }
  return matches;
}
