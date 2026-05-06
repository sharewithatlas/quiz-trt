'use client';

import { createContext, useContext, useEffect, useRef } from 'react';
import type { FunnelConfig } from '@/lib/funnels/shared/types';
import { useQuizStore } from '@/lib/funnels/shared/quiz-store';
import { readSourceContextFromURL } from '@/lib/funnels/shared/source-context';
import { trackQuizEvent } from '@/lib/funnels/shared/tracking';

const Ctx = createContext<FunnelConfig | null>(null);

export function FunnelProvider({ funnel, children }: { funnel: FunnelConfig; children: React.ReactNode }) {
  const useStore = useQuizStore(funnel.clientSlug, funnel.funnelSlug, funnel.version);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const state = useStore.getState();
    if (!state.sessionId) {
      const sessionId = crypto.randomUUID();
      const startedAt = new Date().toISOString();
      useStore.setState({ sessionId, startedAt, updatedAt: startedAt });
      const ctx = readSourceContextFromURL();
      useStore.getState().setSourceContext(ctx);
      trackQuizEvent({
        clientSlug: funnel.clientSlug,
        funnelSlug: funnel.funnelSlug,
        funnelVersion: funnel.version,
        sessionId,
        timestamp: startedAt,
        event: 'quiz_started',
        sourceContext: ctx
      }, funnel.tracking);
    }
  }, [funnel, useStore]);

  return <Ctx.Provider value={funnel}>{children}</Ctx.Provider>;
}

export function useFunnel(): FunnelConfig {
  const f = useContext(Ctx);
  if (!f) throw new Error('useFunnel called outside FunnelProvider');
  return f;
}
