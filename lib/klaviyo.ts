// Server-side Klaviyo subscribe stub.
// Drop in real KLAVIYO_PRIVATE_API_KEY + KLAVIYO_LIST_ID via env to enable.
// Docs: https://developers.klaviyo.com/en/reference/subscribe_profiles

export type SubmitPayload = {
  email: string;
  firstName: string;
  lastName: string;
  answers: Record<number, unknown>;
};

export async function subscribeToKlaviyo(payload: SubmitPayload) {
  const apiKey = process.env.KLAVIYO_PRIVATE_API_KEY;
  const listId = process.env.KLAVIYO_LIST_ID;

  if (!apiKey || !listId) {
    console.log('[klaviyo:stub] would subscribe', payload.email, 'to list', listId ?? '(unset)');
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
                  properties: { quiz_answers: payload.answers, source: 'trt-funnel' },
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

  return { ok: res.ok, status: res.status, stubbed: false };
}
