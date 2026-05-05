# TRT Quiz Funnel — Captured Spec

Source: `quiz.mylifeforce.com/trt`. Captured for rebuild reference only.

## Flow

`/` (landing + Q1) → `/questions/2..9` (8 SYMPTOMS) → `/questions/10..12` (3 PREFERENCES) → `/questions/13` (REFERRAL) → `/submit` (lead capture) → `/results` (offer/upsell)

## Design system (from screenshot)

- Background: warm cream/beige
- Text: deep brown/charcoal
- Accent: amber/gold for selected state + urgency badges
- Hero font: classical serif (Caslon-ish)
- Body: clean sans
- Inputs: rounded rectangles, radio-style indicator on left, selected = amber fill
- "Back" link top-left, brand wordmark "LIFEFORCE" centered top
- Section label + progress (e.g. `SYMPTOMS  1 / 8`) above question

## Page-by-page

### Landing `/`
- Eyebrow: `EXCLUSIVE` + badge `75% OFF ENDING SOON`
- Hero: **"Small changes in testosterone change everything"** (with underline treatment on "everything")
- Sub: "Testosterone replacement therapy made easy, delivered to your door. Muscle mass, revitalized power and sharper mental focus are one step away"
- Trust strip: "HSA/FSA-eligible with [Learn More]"
- **Q1 — single-select:** "Which of these results would you improve to make the BIGGEST difference in your life?"
  - Focus and cognition / Muscle gain / Weight loss / Erectile function / Sex drive and libido / Energy levels / Mood and overall happiness
- CTA: `Next`
- Below-fold: "How it works" (4 steps), trust blocks (Privacy, Expert Advice, Success stories), more CTAs

### Q2 `/questions/2` — SYMPTOMS 1/8 — single-select
"How difficult is it for you to build muscle?"
Extremely difficult / Very difficult / Moderately difficult / It's easy for me

### Q3 `/questions/3` — SYMPTOMS 2/8 — single-select
"How often do you experience erectile dysfunction (ED)?"
Almost every time / Very often / On occasion / Never

### Q4 `/questions/4` — SYMPTOMS 3/8 — single-select
"How would you rate your sex drive (libido)?"
Dropped significantly / Somewhat declined / Feels OK / Is excellent

### Q5 `/questions/5` — SYMPTOMS 4/8 — single-select
"Is your sleep restful?"
Sub: "How you sleep at night tells us a lot about your efficiency levels."
- Pretty good — *I wake up feeling refreshed*
- Restless — *I usually wake up one or more times during the night regularly have trouble falling asleep or staying asleep*
- Difficult falling to asleep — *I toss and turn and/or can't shut my mind off*

### Q6 `/questions/6` — SYMPTOMS 5/8 — single-select
"How many times do you need to get up and urinate during the night?"
0-2 times per night / 3 times per night or more

### Q7 `/questions/7` — SYMPTOMS 6/8 — single-select
"How would you rate your overall happiness?"
Sub: "On average, men following a testosterone optimization plan with Lifeforce rate their overall happiness as good or excellent within just 2 months."
Poor / Fair / Good / Excellent

### Q8 `/questions/8` — SYMPTOMS 7/8 — single-select
"Sometimes low testosterone can make you feel sad, down or even depressed. Have you been experiencing these symptoms more often than you want to?"
Yes / Never

### Q9 `/questions/9` — SYMPTOMS 8/8 — date-of-birth
"What is your date of birth?"
Sub: "Your age plays a fundamental role in your testosterone levels and symptoms."
Three dropdowns: Day (1–31) / Month (Jan–Dec) / Year (1934–2003)

### Q10 `/questions/10` — PREFERENCES 1/3 — single-select
"How quickly would you like to experience the benefits of optimal testosterone levels?"
As fast as possible / Slow and steady wins the race / Something between the two

### Q11 `/questions/11` — PREFERENCES 2/3 — dropdown
"Which state do you live in?"
US states + territories (full list captured)

### Q12 `/questions/12` — PREFERENCES 3/3 — single-select
"How many days a week do you typically do physical exercise?"
0-2 times per week / 3 times per week or more

### Q13 `/questions/13` — REFERRAL 1/1 — single-select
"Did you hear about Lifeforce from a medical professional?"
Sub: "An increasing number of people joining Lifeforce are being referred to us by their doctors."
Yes / No

### `/submit` — lead capture form
Headline: **"YOU PRE-QUALIFY FOR TRT!"**
Body: "Your next step is to confirm your eligibility and optimization plan with a comprehensive blood draw and consultation with a Lifeforce clinician. Now enter your information and click the button to lock in your 75% discount and proceed to the next step"
Fields: First name / Last name / Email
CTA: `Save And Continue`
**→ This is where Klaviyo subscribe call fires (stub for now).**

### `/results` — offer page
Header: "Based on your responses, it is likely that you have **Sub-optimal Testosterone** — Your estimate"
Greeting: "You made it one step closer, [first_name]!"
Subhead: "You're among the few men who are willing to improve their health."

Sections:
1. **Trust narrative** — copy about most men not getting treatment, suffering consequences
2. **Tony Robbins quote** — "If your testosterone is around 250 you are within the normal range, but most men will feel tired and foggy unless they are on the upper part of that range, which is 700 and higher."
3. **Lifeforce value prop** — "address the root cause of low testosterone symptoms..."
4. **"Here's what's next"** — 4 steps (Take quiz, Measure baseline, Start transformation, Continuous Optimization)
5. **Countdown timer** (8-hour) — "Stop delaying. Fix your testosterone with Lifeforce today"
6. **Pricing comparison** — two cards:
   - **Best deal**: Lifeforce Testosterone Membership — `$599 → $149` ("Saving $450"), then `$149/mo`
   - **Full Price**: Lifeforce Diagnostic Only — `$549`
7. **What's included breakdown** (50+ Biomarkers, Phlebotomist visit, Telehealth consult, Clinical Recs, + Membership perks)
8. **Why Lifeforce?** — 4 cards (Extensive profiling, Board-Certified Doctors, Personalized, Dedicated Support)
9. **Featured In** — 2 quote cards (Pete Nastasi, Barret Wertz)
10. **CTA**: `GET STARTED NOW` (multiple placements)

## Notes / Open questions for rebuild

- **Branching:** captured flow is linear. No evidence of conditional skipping based on answers (would need to test all paths to confirm). Treating as fully linear in v1.
- **Scoring:** results page just says "Sub-optimal Testosterone" generically — doesn't appear to vary by answers. Treating as static for v1.
- **Q1 selection:** appears single-select on Lifeforce site (radios). Confirm with you.
- **Submit destination:** original POSTs to a backend that hands off to Lifeforce CRM. We'll stub a `POST /api/submit` that takes the lead + answers and (when wired) calls Klaviyo Subscribe API to add a profile to a list.
- **Tracking stack on source** (for reference; not copying): Meta Pixel `320687356593267`, GA4 `G-D2YMHBTZCR`, TikTok pixel, Snap pixel, Twitter pixel, Google Ads `AW-10805339368`, Edgetag server-side CAPI proxy, Adtracktiv, BlotoutTracking. Yours will be env-driven stubs.
