'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Answer = string | { day: string; month: string; year: string };

type QuizState = {
  answers: Record<number, Answer>;
  setAnswer: (id: number, value: Answer) => void;
  reset: () => void;
};

export const useQuiz = create<QuizState>()(
  persist(
    (set) => ({
      answers: {},
      setAnswer: (id, value) =>
        set((s) => ({ answers: { ...s.answers, [id]: value } })),
      reset: () => set({ answers: {} })
    }),
    { name: 'trt-quiz' }
  )
);
