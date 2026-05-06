// Lifeforce Menopause — FunnelConfig.
// Carries forward the existing menopause quiz data + copy slots verbatim.

import type { FunnelConfig, StepRef } from '../shared/types';
import { LIFEFORCE_BRAND } from '@/content/lifeforce/brand';
import { MENOPAUSE_COPY } from '@/content/lifeforce/menopause/copy';

const flow: StepRef[] = [
  { type: 'question', id: '1' },
  { type: 'question', id: '2' },
  { type: 'question', id: '3' },
  { type: 'question', id: '4' },
  { type: 'question', id: '5' },
  { type: 'question', id: '6' },
  { type: 'question', id: '7' },
  { type: 'submit', id: 'submit' },
  { type: 'results', id: 'results' }
];

export const menopauseFunnel: FunnelConfig = {
  clientSlug: 'lifeforce',
  funnelSlug: 'menopause',
  displayName: 'Menopause Quiz',
  version: 'v1',

  questions: [
    {
      id: '1', type: 'question', inputType: 'single',
      section: 'INTRO', sectionPosition: '',
      text: 'Select your age range',
      options: ['<35', '35-39', '40-45', '45-49', '50-54', '55+']
    },
    {
      id: '2', type: 'question', inputType: 'single',
      section: 'PROGRESS', sectionPosition: '2 / 7',
      text: 'Do you know which menopause stage you might be currently in?',
      options: ["I'm not sure", 'Early perimenopause', 'Late perimenopause', 'Menopause', 'Early post-menopause', 'Late post-menopause']
    },
    {
      id: '3', type: 'question', inputType: 'single',
      section: 'PROGRESS', sectionPosition: '3 / 7',
      text: 'How are your periods?',
      options: ['7+ days off track', 'Periods occur every 60+ days', 'One year without a period', 'Over a year without a period', 'No longer occurring due to medical or surgical reasons', 'I have regular periods']
    },
    {
      id: '4', type: 'question', inputType: 'multi',
      section: 'PROGRESS', sectionPosition: '4 / 7',
      text: 'Do you have any of these symptoms? (Select all that apply)',
      options: ['Hot flashes/night sweats', 'Anxiety', 'Mood changes/irritability', 'Weight gain', 'Brain fog', 'Low libido', 'Hair and skin changes', 'Depression', 'Incontinence', 'Difficulty sleeping', 'Painful sex', 'None of the above']
    },
    {
      id: '5', type: 'question', inputType: 'multi',
      section: 'PROGRESS', sectionPosition: '5 / 7',
      text: 'Which supplement(s) are you currently taking to manage your menopause symptoms? (Select all that apply)',
      options: ['Magnesium', 'Vitamin B Complex', 'NAD', 'Vitamin B6', 'Ginseng', 'Vitamin D', 'Vitamin K', 'Omega-3 Fatty Acids', 'Probiotics', 'Coenzyme Q10 (CoQ10)', 'Vitamin C', 'None of these']
    },
    {
      id: '6', type: 'question', inputType: 'multi',
      section: 'PROGRESS', sectionPosition: '6 / 7',
      text: 'Which lifestyle changes are you currently implementing to manage your menopause symptoms?',
      options: ['Regular Exercise (3x a week)', 'Dietary Adjustments (more plants, less sugar)', 'Stress Reduction (meditation, breathing)', 'Improved Sleep Habits (regular schedule, cool room)', 'Staying Socially Active (friends, community events)', 'Mental Stimulation (puzzles, learning)', 'Daily Hydration (8+ glasses of water)', 'Moderate Alcohol (1 drink or less daily)']
    },
    {
      id: '7', type: 'question', inputType: 'multi-limited', maxSelections: 3,
      section: 'PROGRESS', sectionPosition: '7 / 7',
      text: 'Which of these symptoms do you find most disruptive to your daily life and would like to treat the most? (Select up to three)',
      options: ['Insomnia (Sleep better)', 'Brain fog (Improve mental clarity)', 'Irritability or sadness (Improve mood stability)', 'Reduced libido (Maintain sexual health)', 'Vaginal dryness (Improve sexual health)', 'Fatigue (Increase energy)', 'Osteoporosis risk (Strengthen bones)', 'Heart disease risk (Improve cardiovascular health)']
    }
  ],

  interstitials: [],
  flow,
  rules: [],
  calculations: {},
  copy: MENOPAUSE_COPY,
  brand: { ...LIFEFORCE_BRAND, title: 'Menopause Quiz', description: 'Get a free hormone optimization plan tailored to your phase.' },
  klaviyo: {
    defaultTags: ['quiz:menopause', 'funnel-version:v1'],
    customProperties: {
      quiz_age_range: { from: 'answer', questionId: '1' },
      quiz_menopause_stage: { from: 'answer', questionId: '2' },
      quiz_top_symptoms: { from: 'answer', questionId: '7' }
    }
  }
};
