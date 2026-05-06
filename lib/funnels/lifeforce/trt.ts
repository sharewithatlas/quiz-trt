// Lifeforce TRT — FunnelConfig.
// Carries forward the existing TRT quiz data + copy slots verbatim.

import type { FunnelConfig, StepRef } from '../shared/types';
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

export const trtFunnel: FunnelConfig = {
  clientSlug: 'lifeforce',
  funnelSlug: 'trt',
  displayName: 'TRT Quiz',
  version: 'v1',

  questions: [
    {
      id: '1', type: 'question', inputType: 'single',
      section: 'INTRO', sectionPosition: '',
      text: 'Which of these results would you improve to make the BIGGEST difference in your life?',
      options: ['Focus and cognition', 'Muscle gain', 'Weight loss', 'Erectile function', 'Sex drive and libido', 'Energy levels', 'Mood and overall happiness']
    },
    {
      id: '2', type: 'question', inputType: 'single',
      section: 'SYMPTOMS', sectionPosition: '1 / 8',
      text: 'How difficult is it for you to build muscle?',
      options: ['Extremely difficult', 'Very difficult', 'Moderately difficult', "It's easy for me"]
    },
    {
      id: '3', type: 'question', inputType: 'single',
      section: 'SYMPTOMS', sectionPosition: '2 / 8',
      text: 'How often do you experience erectile dysfunction (ED)?',
      options: ['Almost every time', 'Very often', 'On occasion', 'Never']
    },
    {
      id: '4', type: 'question', inputType: 'single',
      section: 'SYMPTOMS', sectionPosition: '3 / 8',
      text: 'How would you rate your sex drive (libido)?',
      options: ['Dropped significantly', 'Somewhat declined', 'Feels OK', 'Is excellent']
    },
    {
      id: '5', type: 'question', inputType: 'single',
      section: 'SYMPTOMS', sectionPosition: '4 / 8',
      text: 'Is your sleep restful?',
      options: ['Pretty good', 'Restless', 'Difficult falling to asleep']
    },
    {
      id: '6', type: 'question', inputType: 'single',
      section: 'SYMPTOMS', sectionPosition: '5 / 8',
      text: 'How many times do you need to get up and urinate during the night?',
      options: ['0-2 times per night', '3 times per night or more']
    },
    {
      id: '7', type: 'question', inputType: 'single',
      section: 'SYMPTOMS', sectionPosition: '6 / 8',
      text: 'How would you rate your overall happiness?',
      options: ['Poor', 'Fair', 'Good', 'Excellent']
    },
    {
      id: '8', type: 'question', inputType: 'single',
      section: 'SYMPTOMS', sectionPosition: '7 / 8',
      text: 'Have you been experiencing low mood symptoms more often than you want to?',
      options: ['Yes', 'Never']
    },
    {
      id: '9', type: 'question', inputType: 'dob',
      section: 'SYMPTOMS', sectionPosition: '8 / 8',
      text: 'What is your date of birth?'
    },
    {
      id: '10', type: 'question', inputType: 'single',
      section: 'PREFERENCES', sectionPosition: '1 / 3',
      text: 'How quickly would you like to experience the benefits of optimal testosterone levels?',
      options: ['As fast as possible', 'Slow and steady wins the race', 'Something between the two']
    },
    {
      id: '11', type: 'question', inputType: 'dropdown',
      section: 'PREFERENCES', sectionPosition: '2 / 3',
      text: 'Which state do you live in?'
    },
    {
      id: '12', type: 'question', inputType: 'single',
      section: 'PREFERENCES', sectionPosition: '3 / 3',
      text: 'How many days a week do you typically do physical exercise?',
      options: ['0-2 times per week', '3 times per week or more']
    },
    {
      id: '13', type: 'question', inputType: 'single',
      section: 'REFERRAL', sectionPosition: '1 / 1',
      text: 'Did you hear about Lifeforce from a medical professional?',
      options: ['Yes', 'No']
    }
  ],

  interstitials: [],
  flow,
  rules: [],
  calculations: {},
  copy: TRT_COPY,
  brand: { ...LIFEFORCE_BRAND, title: 'TRT Quiz', description: 'Find out if testosterone replacement therapy is right for you.' },
  klaviyo: {
    // Wire when client provides Klaviyo list ID + key.
    // Example mapping (edit to match Klaviyo property names):
    // listId: process.env.KLAVIYO_LIST_ID_TRT,
    defaultTags: ['quiz:trt', 'funnel-version:v1'],
    customProperties: {
      quiz_top_priority: { from: 'answer', questionId: '1' },
      quiz_state: { from: 'answer', questionId: '11' },
      quiz_referred_by_doctor: { from: 'answer', questionId: '13' }
    }
  }
};
