import { NextResponse } from 'next/server';
import { getFunnel } from '@/lib/funnels/registry';
import { subscribeToKlaviyo } from '@/lib/funnels/shared/klaviyo';
import type { QuizState } from '@/lib/funnels/shared/types';

type Body = {
  clientSlug: string;
  funnelSlug: string;
  firstName: string;
  lastName: string;
  email: string;
  state: QuizState;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;
    const { clientSlug, funnelSlug, firstName, lastName, email, state } = body ?? ({} as Body);

    if (!email || !firstName) {
      return NextResponse.json({ ok: false, error: 'missing fields' }, { status: 400 });
    }
    const funnel = getFunnel(clientSlug, funnelSlug);
    if (!funnel) {
      return NextResponse.json({ ok: false, error: 'unknown funnel' }, { status: 400 });
    }

    const result = await subscribeToKlaviyo(funnel, {
      email,
      firstName,
      lastName: lastName ?? '',
      state
    });

    return NextResponse.json({ ok: true, klaviyo: result });
  } catch (e) {
    console.error('[api/submit] error', e);
    return NextResponse.json({ ok: false, error: 'internal' }, { status: 500 });
  }
}
