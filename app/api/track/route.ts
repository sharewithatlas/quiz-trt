// Server-side tracking sink. Forwards events to ADTRACKTIV_ENDPOINT if set,
// otherwise no-ops (logs in dev). The browser client fires fire-and-forget POSTs
// here; downstream connectors are added when credentials are provided.

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const endpoint = process.env.ADTRACKTIV_ENDPOINT;
    const token = process.env.ADTRACKTIV_TOKEN;

    if (!endpoint) {
      if (process.env.NEXT_PUBLIC_DEBUG_TRACKING === '1') {
        console.log('[track:server-stub]', payload?.event, payload);
      }
      return NextResponse.json({ ok: true, stubbed: true });
    }

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(token ? { authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(payload)
    });
    return NextResponse.json({ ok: res.ok, status: res.status, stubbed: false });
  } catch (e) {
    console.error('[api/track] error', e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
