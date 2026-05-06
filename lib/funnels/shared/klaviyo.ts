// Server-side Klaviyo subscribe. Reads KlaviyoMapping from FunnelConfig and
// resolves answer/derived/sourceContext expressions into profile properties + tags.
// Stays a no-op stub when KLAVIYO_PRIVATE_API_KEY is unset.

import { evalPredicate } from './rules-engine';
import type { FunnelConfig, KlaviyoMapping, MappingExpression, QuizState } from './types';

export type SubmitPayload = {
  email: string;
  firstName: string;
  lastName: string;
  state: QuizState;
};

function resolveExpression(expr: MappingExpression, state: QuizState): unknown {
  switch (expr.from) {
    case 'static':
      return expr.value;
    case 'answer': {
      const v = state.answers[expr.questionId];
      return v;
    }
    case 'derived':
      return state.derived[expr.key];
    case 'eligibility':
      return state.eligibility[expr.field as 'qualified' | 'reasons'] ?? state.resultVariant;
    case 'sourceContext': {
      const k = expr.key as string;
      if (k.startsWith('utm_')) return state.sourceContext.utm?.[k];
      return (state.sourceContext as Record<string, unknown>)[k];
    }
    case 'concat': {
      const parts = expr.parts.map((p) => String(resolveExpression(p, state) ?? ''));
      return parts.join(expr.sep ?? '');
    }
  }
}

function buildProperties(mapping: KlaviyoMapping, state: QuizState): Record<string, unknown> {
  const props: Record<string, unknown> = {};
  if (!mapping.customProperties) return props;
  for (const [key, expr] of Object.entries(mapping.customProperties)) {
    const v = resolveExpression(expr, state);
    if (v !== undefined) props[key] = v;
  }
  return props;
}

function buildTags(mapping: KlaviyoMapping, state: QuizState): string[] {
  const tags = new Set<string>(mapping.defaultTags ?? []);
  for (const ct of mapping.conditionalTags ?? []) {
    if (evalPredicate(state, ct.when)) tags.add(ct.tag);
  }
  return Array.from(tags);
}

export async function subscribeToKlaviyo(funnel: FunnelConfig, payload: SubmitPayload) {
  const apiKey = process.env.KLAVIYO_PRIVATE_API_KEY;
  const listId = funnel.klaviyo.listId ?? process.env.KLAVIYO_LIST_ID;

  const properties = {
    ...buildProperties(funnel.klaviyo, payload.state),
    quiz_session_id: payload.state.sessionId,
    quiz_funnel_slug: funnel.funnelSlug,
    quiz_funnel_version: funnel.version,
    quiz_eligibility: payload.state.eligibility.qualified,
    quiz_eligibility_reasons: payload.state.eligibility.reasons
  };
  const tags = buildTags(funnel.klaviyo, payload.state);

  if (!apiKey || !listId) {
    console.log('[klaviyo:stub] would subscribe', payload.email, {
      listId: listId ?? '(unset)',
      properties,
      tags
    });
    return { ok: true, stubbed: true };
  }

  const res = await fetch('https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/', {
    method: 'POST',
    headers: {
      Authorization: `Klaviyo-API-Key ${apiKey}`,
      revision: '2024-10-15',
      accept: 'application/json',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      data: {
        type: 'profile-subscription-bulk-create-job',
        attributes: {
          profiles: {
            data: [
              {
                type: 'profile',
                attributes: {
                  email: payload.email,
                  first_name: payload.firstName,
                  last_name: payload.lastName,
                  properties,
                  subscriptions: { email: { marketing: { consent: 'SUBSCRIBED' } } }
                }
              }
            ]
          }
        },
        relationships: { list: { data: { type: 'list', id: listId } } }
      }
    })
  });

  return { ok: res.ok, status: res.status, stubbed: false, tags };
}
