// Lifeforce TRT — FunnelConfig.
// Carries forward the existing TRT quiz data + copy slots verbatim, plus
// structured persuasion blocks (landingBlocks / resultsBlocks) for the
// landing and results pages.

import type { FunnelConfig, LandingBlock, ResultsBlock, StepRef } from '../shared/types';
import { LIFEFORCE_BRAND } from '@/content/lifeforce/brand';
import { TRT_COPY } from '@/content/lifeforce/trt/copy';

const flow: StepRef[] = [
  { type: 'question', id: '1' },
  { type: 'question', id: '2' },
  { type: 'question', id: '3' },
  { type: 'question', id: '4' },
  { type: 'question', id: '5' },
  { type: 'question', id: '6' },
  { type: 'question', id: '7' },
  { type: 'question', id: '8' },
  { type: 'question', id: '9' },
  { type: 'question', id: '10' },
  { type: 'question', id: '11' },
  { type: 'question', id: '12' },
  { type: 'question', id: '13' },
  { type: 'submit', id: 'submit' },
  { type: 'results', id: 'results' }
];

const landingBlocks: LandingBlock[] = [
  { type: 'copy', slot: 'hero.eyebrow', description: 'Eyebrow row + amber promo badge' },
  { type: 'copy', slot: 'hero.headline', description: 'Serif H1 hero headline', className: 'font-serif text-4xl md:text-5xl text-ink mt-2' },
  { type: 'copy', slot: 'hero.subhead', description: 'Hero subhead (1-2 sentences)', className: 'text-ink-700 mt-3', as: 'p' },
  { type: 'copy', slot: 'hero.trust_strip', description: 'HSA/FSA-eligible badge + Learn More' },
  { type: 'question-anchor' },
  { type: 'urgency-banner', copySlot: 'below_fold.urgency_banner' },
  {
    type: 'how-it-works',
    headingSlot: 'landing.how_it_works.heading',
    steps: [
      { titleSlot: 'landing.how_it_works.step_1.title', bodySlot: 'landing.how_it_works.step_1.body', imageKey: 'quizStep1' },
      { titleSlot: 'landing.how_it_works.step_2.title', bodySlot: 'landing.how_it_works.step_2.body', imageKey: 'measureBaseline' },
      { titleSlot: 'landing.how_it_works.step_3.title', bodySlot: 'landing.how_it_works.step_3.body' },
      { titleSlot: 'landing.how_it_works.step_4.title', bodySlot: 'landing.how_it_works.step_4.body' }
    ]
  },
  {
    type: 'cta',
    headlineSlot: 'landing.cta.headline',
    subheadSlot: 'landing.cta.subhead',
    ctaLabelSlot: 'landing.cta.cta_label',
    ctaHref: '/lifeforce/trt/questions/2'
  },
  {
    type: 'trust-grid',
    headingSlot: 'landing.trust_grid.heading',
    items: [
      { titleSlot: 'landing.trust_grid.card_1.title', bodySlot: 'landing.trust_grid.card_1.body', ctaLabelSlot: 'landing.trust_grid.card_1.cta_label', ctaHref: '/lifeforce/trt/questions/2' },
      { titleSlot: 'landing.trust_grid.card_2.title', bodySlot: 'landing.trust_grid.card_2.body', ctaLabelSlot: 'landing.trust_grid.card_2.cta_label', ctaHref: '/lifeforce/trt/questions/2' },
      { titleSlot: 'landing.trust_grid.card_3.title', bodySlot: 'landing.trust_grid.card_3.body', ctaLabelSlot: 'landing.trust_grid.card_3.cta_label', ctaHref: '/lifeforce/trt/questions/2' }
    ]
  }
];

const resultsBlocks: ResultsBlock[] = [
  { type: 'copy', slot: 'results.estimate_card', description: '"Based on your responses…" estimate card', height: '160px' },
  { type: 'copy', slot: 'results.intro_subhead', description: 'Subhead under greeting' },
  { type: 'copy', slot: 'results.narrative_block', description: 'Multi-paragraph narrative', as: 'p' },
  {
    type: 'founder-quote',
    portraitImageKey: 'founderPortrait',
    quoteSlot: 'results.founder_quote',
    attributionSlot: 'results.founder_attribution'
  },
  { type: 'copy', slot: 'results.value_prop_paragraph', description: 'Brand value prop / "address root cause"', as: 'p' },
  {
    type: 'how-it-works',
    headingSlot: 'results.next_steps.heading',
    steps: [
      { titleSlot: 'results.next_steps.step_1.title', bodySlot: 'results.next_steps.step_1.body' },
      { titleSlot: 'results.next_steps.step_2.title', bodySlot: 'results.next_steps.step_2.body' },
      { titleSlot: 'results.next_steps.step_3.title', bodySlot: 'results.next_steps.step_3.body' },
      { titleSlot: 'results.next_steps.step_4.title', bodySlot: 'results.next_steps.step_4.body' }
    ]
  },
  { type: 'countdown', durationSeconds: 28800, headlineSlot: 'results.countdown_1.headline' },
  {
    type: 'pricing-compare',
    headingSlot: 'results.pricing_1.heading',
    primary: {
      highlight: true,
      badgeSlot: 'results.pricing_1.primary.badge',
      titleSlot: 'results.pricing_1.primary.title',
      priceOriginalSlot: 'results.pricing_1.primary.price_original',
      priceCurrentSlot: 'results.pricing_1.primary.price_current',
      savingsSlot: 'results.pricing_1.primary.savings',
      bulletsSlot: 'results.pricing_1.primary.bullets',
      termsSlot: 'results.pricing_1.primary.terms',
      ctaLabelSlot: 'results.pricing_1.primary.cta_label'
    },
    secondary: {
      badgeSlot: 'results.pricing_1.secondary.badge',
      titleSlot: 'results.pricing_1.secondary.title',
      priceCurrentSlot: 'results.pricing_1.secondary.price_current',
      bulletsSlot: 'results.pricing_1.secondary.bullets',
      ctaLabelSlot: 'results.pricing_1.secondary.cta_label'
    }
  },
  {
    type: 'card-grid',
    headingSlot: 'results.why.heading',
    columns: 4,
    items: [
      { titleSlot: 'results.why.card_1.title', bodySlot: 'results.why.card_1.body' },
      { titleSlot: 'results.why.card_2.title', bodySlot: 'results.why.card_2.body' },
      { titleSlot: 'results.why.card_3.title', bodySlot: 'results.why.card_3.body' },
      { titleSlot: 'results.why.card_4.title', bodySlot: 'results.why.card_4.body' }
    ]
  },
  {
    type: 'included-breakdown',
    headingSlot: 'results.included.heading',
    items: [
      { titleSlot: 'results.included.item_1.title', bodySlot: 'results.included.item_1.body', valueSlot: 'results.included.item_1.value' },
      { titleSlot: 'results.included.item_2.title', bodySlot: 'results.included.item_2.body', valueSlot: 'results.included.item_2.value' },
      { titleSlot: 'results.included.item_3.title', bodySlot: 'results.included.item_3.body', valueSlot: 'results.included.item_3.value' },
      { titleSlot: 'results.included.item_4.title', bodySlot: 'results.included.item_4.body', valueSlot: 'results.included.item_4.value' }
    ],
    totalSlot: 'results.included.total'
  },
  { type: 'countdown', durationSeconds: 28800, headlineSlot: 'results.countdown_2.headline' },
  {
    type: 'featured-in',
    headingSlot: 'results.featured_in.heading',
    quoteSlot: 'results.featured_in.quote',
    attributionSlot: 'results.featured_in.attribution',
    logoImageKeys: ['pressLogoForbes', 'pressLogoNewsweek', 'pressLogoSI', 'pressLogoNYP', 'pressLogoFitt']
  },
  {
    type: 'cta',
    headlineSlot: 'results.final_cta.headline',
    ctaLabelSlot: 'results.final_cta.cta_label'
  }
];

export const trtFunnel: FunnelConfig = {
  clientSlug: 'lifeforce',
  funnelSlug: 'trt',
  displayName: 'TRT Quiz',
  version: 'v1',

  questions: [
    { id: '1', type: 'question', inputType: 'single', section: 'INTRO', sectionPosition: '',
      text: 'Which of these results would you improve to make the BIGGEST difference in your life?',
      options: ['Focus and cognition', 'Muscle gain', 'Weight loss', 'Erectile function', 'Sex drive and libido', 'Energy levels', 'Mood and overall happiness'] },
    { id: '2', type: 'question', inputType: 'single', section: 'SYMPTOMS', sectionPosition: '1 / 8',
      text: 'How difficult is it for you to build muscle?',
      options: ['Extremely difficult', 'Very difficult', 'Moderately difficult', "It's easy for me"] },
    { id: '3', type: 'question', inputType: 'single', section: 'SYMPTOMS', sectionPosition: '2 / 8',
      text: 'How often do you experience erectile dysfunction (ED)?',
      options: ['Almost every time', 'Very often', 'On occasion', 'Never'] },
    { id: '4', type: 'question', inputType: 'single', section: 'SYMPTOMS', sectionPosition: '3 / 8',
      text: 'How would you rate your sex drive (libido)?',
      options: ['Dropped significantly', 'Somewhat declined', 'Feels OK', 'Is excellent'] },
    { id: '5', type: 'question', inputType: 'single', section: 'SYMPTOMS', sectionPosition: '4 / 8',
      text: 'Is your sleep restful?',
      options: ['Pretty good', 'Restless', 'Difficult falling to asleep'] },
    { id: '6', type: 'question', inputType: 'single', section: 'SYMPTOMS', sectionPosition: '5 / 8',
      text: 'How many times do you need to get up and urinate during the night?',
      options: ['0-2 times per night', '3 times per night or more'] },
    { id: '7', type: 'question', inputType: 'single', section: 'SYMPTOMS', sectionPosition: '6 / 8',
      text: 'How would you rate your overall happiness?',
      options: ['Poor', 'Fair', 'Good', 'Excellent'] },
    { id: '8', type: 'question', inputType: 'single', section: 'SYMPTOMS', sectionPosition: '7 / 8',
      text: 'Have you been experiencing low mood symptoms more often than you want to?',
      options: ['Yes', 'Never'] },
    { id: '9', type: 'question', inputType: 'dob', section: 'SYMPTOMS', sectionPosition: '8 / 8',
      text: 'What is your date of birth?' },
    { id: '10', type: 'question', inputType: 'single', section: 'PREFERENCES', sectionPosition: '1 / 3',
      text: 'How quickly would you like to experience the benefits of optimal testosterone levels?',
      options: ['As fast as possible', 'Slow and steady wins the race', 'Something between the two'] },
    { id: '11', type: 'question', inputType: 'dropdown', section: 'PREFERENCES', sectionPosition: '2 / 3',
      text: 'Which state do you live in?' },
    { id: '12', type: 'question', inputType: 'single', section: 'PREFERENCES', sectionPosition: '3 / 3',
      text: 'How many days a week do you typically do physical exercise?',
      options: ['0-2 times per week', '3 times per week or more'] },
    { id: '13', type: 'question', inputType: 'single', section: 'REFERRAL', sectionPosition: '1 / 1',
      text: 'Did you hear about Lifeforce from a medical professional?',
      options: ['Yes', 'No'] }
  ],

  interstitials: [],
  flow,
  rules: [],
  calculations: {},
  copy: TRT_COPY,
  brand: {
    ...LIFEFORCE_BRAND,
    title: 'TRT Quiz',
    description: 'Find out if testosterone replacement therapy is right for you.',
    images: {
      hero: '/assets/lifeforce/trt/FoundersPlatformsHero-new.5d73646c.webp',
      founderPortrait: '/assets/lifeforce/trt/tony.ddf348d0.webp',
      quizStep1: '/assets/lifeforce/trt/quiz-step-1-new.d723b0d2.webp',
      measureBaseline: '/assets/lifeforce/trt/measure-baseline-male.7f7822c3.webp',
      pressLogoForbes: '/assets/lifeforce/trt/forbes-logo-black.377ed6fc.webp',
      pressLogoNewsweek: '/assets/lifeforce/trt/newsweek-logo-black.6a1f0e13.webp',
      pressLogoSI: '/assets/lifeforce/trt/sports-illustrated-logo-black.96eda4e5.webp',
      pressLogoNYP: '/assets/lifeforce/trt/new-york-post.e27fa783.webp',
      pressLogoFitt: '/assets/lifeforce/trt/fitt-insider-logo-black.0a555756.webp'
    }
  },
  resultsLayout: [
    'results.estimate_card',
    'results.intro_subhead',
    'results.narrative_block',
    'results.founder_quote',
    'results.founder_attribution',
    'results.value_prop_paragraph',
    'results.next_steps',
    'results.countdown_banner_1',
    'results.pricing_compare',
    'results.why_lifeforce',
    'results.pricing_compare_2',
    'results.featured_in',
    'results.final_cta'
  ],
  landingBlocks,
  resultsBlocks,
  klaviyo: {
    defaultTags: ['quiz:trt', 'funnel-version:v1'],
    customProperties: {
      quiz_top_priority: { from: 'answer', questionId: '1' },
      quiz_state: { from: 'answer', questionId: '11' },
      quiz_referred_by_doctor: { from: 'answer', questionId: '13' }
    }
  }
};
