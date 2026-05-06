# Deploy + Verification Guide

Quick path: connect Vercel → add env vars → verify TRT click-through → flip live keys.

---

## 1. Vercel project setup

1. Vercel dashboard → **Add New Project** → import `sharewithatlas/quiz-trt`.
2. Vercel auto-detects Next.js. Leave **Framework Preset**, **Build Command**, **Output Directory**, **Install Command** at defaults.
3. **Skip env vars on first deploy** — the app builds and runs in stub mode without them. First deploy verifies the build pipeline.
4. After first successful deploy, add env vars (next section) and redeploy.

**Custom domain:**
- Vercel → Project → **Settings → Domains** → add the domain you want.
- Root `/` redirects to `/lifeforce/trt`. So `quiz.example.com` lands users on TRT.
- For traffic on the legacy `/trt/...` path: 301 redirects in `next.config.js` already forward to `/lifeforce/trt/...`.

---

## 2. Environment variables

All optional — the app no-ops gracefully when any are unset.

### Klaviyo (server-side, leads)
| Var | Used by | Notes |
|---|---|---|
| `KLAVIYO_PRIVATE_API_KEY` | `/api/submit` | Required for real subscribe; without it the API logs the would-be payload and returns ok |
| `KLAVIYO_LIST_ID_TRT` | TRT funnel only | Per-funnel list IDs. Used if `FunnelConfig.klaviyo.listId` is set to `process.env.KLAVIYO_LIST_ID_TRT` |
| `KLAVIYO_LIST_ID` | Fallback | Used if no per-funnel list ID is set |

### AdTracktiv (server-side, events)
| Var | Used by | Notes |
|---|---|---|
| `ADTRACKTIV_ENDPOINT` | `/api/track` | URL events POST to. If unset, the route logs in dev and no-ops in prod |
| `ADTRACKTIV_TOKEN` | `/api/track` | Sent as `Authorization: Bearer <token>` if both endpoint and token are set |

### Tracking pixels (client-side)
| Var | Notes |
|---|---|
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Pixel + CAPI events |
| `NEXT_PUBLIC_GA4_MEASUREMENT_ID` | GA4 |
| `NEXT_PUBLIC_TIKTOK_PIXEL_ID` | TikTok Pixel |
| `NEXT_PUBLIC_GOOGLE_ADS_ID` | Google Ads |
| `NEXT_PUBLIC_DEBUG_TRACKING` | Set to `1` in staging to log every quiz event to the browser console |

Per-funnel pixel overrides can be set on `FunnelConfig.tracking.pixels` if a funnel needs its own IDs.

---

## 3. Verification — TRT first

### A. Build + click-through (visual)
1. Open the production URL → should land on `/lifeforce/trt` and show the TRT landing.
2. `<Placeholder>` boxes will render anywhere `content/lifeforce/trt/copy.ts` slot is empty — that's expected before client copy lands.
3. Click through Q1 → Q13 → submit → results. Answers should persist if you refresh mid-funnel.
4. Confirm `/trt` (legacy) 301-redirects to `/lifeforce/trt` (Network tab → status 308 in dev, 301 in prod).

### B. Klaviyo payload verification (stub mode)
Before flipping `KLAVIYO_PRIVATE_API_KEY` on, verify the payload:
1. Set `NEXT_PUBLIC_DEBUG_TRACKING=1` in Vercel env vars; redeploy.
2. Submit a fake lead end-to-end with a unique email like `verify-001@yourdomain.com`.
3. Vercel → Project → **Logs** (Functions) → look for the `[klaviyo:stub]` line. It contains:
   - `email`
   - `listId` (or `(unset)`)
   - `properties` — the resolved `customProperties` (quiz_top_priority, quiz_state, etc.)
   - `tags` — defaultTags + any conditionalTags that matched
4. Confirm property keys match Klaviyo profile property names you want.
5. When verified: add `KLAVIYO_PRIVATE_API_KEY` + list ID, redeploy. The stub flips to real subscribe.

**Local curl test:**
```bash
curl -X POST https://<your-domain>/api/submit \
  -H 'content-type: application/json' \
  -d '{
    "clientSlug": "lifeforce",
    "funnelSlug": "trt",
    "firstName": "Verify",
    "lastName": "Test",
    "email": "verify-001@example.com",
    "state": {
      "sessionId": "verify-001",
      "funnelVersion": "v1",
      "startedAt": "2026-01-01T00:00:00Z",
      "updatedAt": "2026-01-01T00:00:00Z",
      "answers": { "1": "Energy levels", "11": "California", "13": "No" },
      "derived": {},
      "eligibility": { "qualified": true, "reasons": [] },
      "resultVariant": null,
      "history": [],
      "sourceContext": { "utm": { "utm_source": "test" } }
    }
  }'
```

### C. Tracking verification
1. With `NEXT_PUBLIC_DEBUG_TRACKING=1` set, open browser DevTools → Console.
2. Click through the quiz. Each step fires `[track] <event_name> { ...payload }` lines.
3. Required events to see in order on a happy path:
   - `quiz_started` (with `sourceContext`)
   - `question_viewed` (each question)
   - `answer_changed` (each interaction with the radio/checkbox)
   - `answer_committed` (when Next is clicked or autoAdvance fires)
   - `question_completed` (with `nextRoute`, optional `ruleFiredId`)
   - `submit_started`, `lead_submitted`
   - `results_viewed`
4. Each payload must contain: `clientSlug`, `funnelSlug`, `funnelVersion`, `sessionId`, `timestamp`. Question events also have `stepViewStartedAt` + `stepViewDurationMs`.
5. Network tab → filter `track` → confirm POSTs to `/api/track` succeed (200) — these are server-side fan-out for AdTracktiv.

### D. Answer + drop-off analytics validation
The events are designed for funnel/drop-off analysis. Sanity check the shape:
- **Step-level drop-off**: count `question_viewed` per `stepId`, divided by `quiz_started`. Where the funnel hemorrhages.
- **Answer distribution**: filter `answer_committed` events, group by `(stepId, answer.value)`. Where users go.
- **Time-on-step**: `stepViewDurationMs` on `question_completed`. Where users hesitate.
- **Conversion attribution**: join `quiz_started.sourceContext.adId` → `lead_submitted` to attribute leads to ad sets.
- **Branching effectiveness**: `rule_fired` events tell you which rules trigger — useful when you add eligibility rules.

If you stream `/api/track` events into a warehouse (BigQuery / Snowflake / Redshift via AdTracktiv or a webhook), the canonical payload shape gives you all of the above with no client-side enrichment needed.

---

## 4. TRT launch checklist

Pre-launch (do these once):
- [ ] Vercel project connected to `sharewithatlas/quiz-trt` `main`
- [ ] Custom domain attached + DNS verified
- [ ] `content/lifeforce/trt/copy.ts` populated with client-approved prose for each of the 22 slots
- [ ] `BRAND.logoSrc` in `content/lifeforce/brand.ts` (or per-funnel) set to the Lifeforce logo asset
- [ ] All 13 TRT routes click through cleanly in Vercel preview deploy
- [ ] Klaviyo payload verified in stub mode (Vercel logs)
- [ ] Tracking events visible in browser console with `NEXT_PUBLIC_DEBUG_TRACKING=1`

Flip-to-live:
- [ ] Add `KLAVIYO_PRIVATE_API_KEY` + `KLAVIYO_LIST_ID_TRT` to Vercel env, redeploy
- [ ] Add pixel IDs (`NEXT_PUBLIC_META_PIXEL_ID`, etc.) to Vercel env, redeploy
- [ ] (When ready) Add `ADTRACKTIV_ENDPOINT` + `ADTRACKTIV_TOKEN`, redeploy
- [ ] Remove `NEXT_PUBLIC_DEBUG_TRACKING` (or leave at `0`) for prod
- [ ] Real-lead smoke test: submit your own email, verify it lands in the Klaviyo list with all expected properties + tags
- [ ] Pixel smoke test: confirm Meta Events Manager / GA4 Realtime / TikTok Events Manager show events flowing
- [ ] (Once live) Archive `sharewithatlas/quiz-menopause` — menopause now lives at `/lifeforce/menopause` in this repo

---

## 5. Debug helpers built in

- **Empty content slots** render as visible `<Placeholder>` boxes labeled with the slot name. Helpful in staging.
- **Empty `flow`** (e.g. weight-loss) renders a minimal "Coming soon" page rather than 404.
- **`NEXT_PUBLIC_DEBUG_TRACKING=1`** logs every `trackQuizEvent` payload to console + `[track:server-stub]` for `/api/track`.
- **Klaviyo stub mode** (no `KLAVIYO_PRIVATE_API_KEY`) logs the full would-be payload server-side without sending.
- **Version guard:** bumping `FunnelConfig.version` (e.g. `v1` → `v2`) automatically clears users' in-progress `localStorage` state for that funnel on next load.
