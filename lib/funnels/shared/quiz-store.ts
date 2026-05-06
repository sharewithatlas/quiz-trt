'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Answer, QuizState, SourceContext } from './types';

type Store = QuizState & {
  setAnswer: (id: string, value: Answer) => void;
  setDerived: (key: string, value: unknown) => void;
  setEligibility: (qualified: boolean, reason?: string) => void;
  setResultVariant: (variant: string) => void;
  pushHistory: (stepId: string) => void;
  setSourceContext: (ctx: SourceContext) => void;
  reset: () => void;
};

const stores = new Map<string, ReturnType<typeof makeStore>>();

function emptyState(funnelVersion: string): QuizState {
  return {
    sessionId: '',
    funnelVersion,
    startedAt: '',
    updatedAt: '',
    answers: {},
    derived: {},
    eligibility: { qualified: true, reasons: [] },
    resultVariant: null,
    history: [],
    sourceContext: {}
  };
}

function makeStore(clientSlug: string, funnelSlug: string, funnelVersion: string) {
  const key = `quiz:${clientSlug}:${funnelSlug}`;

  return create<Store>()(
    persist(
      (set) => ({
        ...emptyState(funnelVersion),
        setAnswer: (id, value) =>
          set((s) => ({
            ...s,
            answers: { ...s.answers, [id]: value },
            updatedAt: new Date().toISOString()
          })),
        setDerived: (k, v) =>
          set((s) => ({ ...s, derived: { ...s.derived, [k]: v }, updatedAt: new Date().toISOString() })),
        setEligibility: (qualified, reason) =>
          set((s) => ({
            ...s,
            eligibility: {
              qualified,
              reasons: reason ? [...s.eligibility.reasons, reason] : s.eligibility.reasons
            },
            updatedAt: new Date().toISOString()
          })),
        setResultVariant: (variant) =>
          set((s) => ({ ...s, resultVariant: variant, updatedAt: new Date().toISOString() })),
        pushHistory: (stepId) =>
          set((s) => ({ ...s, history: [...s.history, stepId], updatedAt: new Date().toISOString() })),
        setSourceContext: (ctx) =>
          set((s) => ({ ...s, sourceContext: { ...s.sourceContext, ...ctx } })),
        reset: () => set(() => emptyState(funnelVersion))
      }),
      {
        name: key,
        storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : undefined as unknown as Storage)),
        version: 1,
        // version-guard: invalidate persisted state if funnelVersion changes
        migrate: (persisted: any) => {
          if (!persisted || persisted.funnelVersion !== funnelVersion) return emptyState(funnelVersion);
          return persisted;
        }
      }
    )
  );
}

/** Get (or create) a Zustand store hook scoped to clientSlug/funnelSlug. */
export function useQuizStore(clientSlug: string, funnelSlug: string, funnelVersion: string) {
  const key = `${clientSlug}:${funnelSlug}`;
  if (!stores.has(key)) stores.set(key, makeStore(clientSlug, funnelSlug, funnelVersion));
  return stores.get(key)!;
}
