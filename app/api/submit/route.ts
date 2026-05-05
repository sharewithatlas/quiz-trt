import { NextResponse } from 'next/server';
import { subscribeToKlaviyo } from '@/lib/klaviyo';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, answers } = body ?? {};
    if (!email || !firstName) {
      return NextResponse.json({ ok: false, error: 'missing fields' }, { status: 400 });
    }
    const result = await subscribeToKlaviyo({ firstName, lastName: lastName ?? '', email, answers: answers ?? {} });
    return NextResponse.json({ ok: true, klaviyo: result });
  } catch (e) {
    console.error('[api/submit] error', e);
    return NextResponse.json({ ok: false, error: 'internal' }, { status: 500 });
  }
}
