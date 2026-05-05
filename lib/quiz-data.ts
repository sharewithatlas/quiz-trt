export type QuestionType = 'single' | 'dob' | 'dropdown';

export type Question = {
  id: number;
  section: 'SYMPTOMS' | 'PREFERENCES' | 'REFERRAL' | 'INTRO';
  sectionPosition: string;
  type: QuestionType;
  text: string;
  subhead?: string;
  options?: string[];
};

export const QUESTIONS: Question[] = [
  {
    id: 1,
    section: 'INTRO',
    sectionPosition: '',
    type: 'single',
    text: 'Which of these results would you improve to make the BIGGEST difference in your life?',
    options: [
      'Focus and cognition',
      'Muscle gain',
      'Weight loss',
      'Erectile function',
      'Sex drive and libido',
      'Energy levels',
      'Mood and overall happiness'
    ]
  },
  {
    id: 2,
    section: 'SYMPTOMS',
    sectionPosition: '1 / 8',
    type: 'single',
    text: 'How difficult is it for you to build muscle?',
    options: ['Extremely difficult', 'Very difficult', 'Moderately difficult', "It's easy for me"]
  },
  {
    id: 3,
    section: 'SYMPTOMS',
    sectionPosition: '2 / 8',
    type: 'single',
    text: 'How often do you experience erectile dysfunction (ED)?',
    options: ['Almost every time', 'Very often', 'On occasion', 'Never']
  },
  {
    id: 4,
    section: 'SYMPTOMS',
    sectionPosition: '3 / 8',
    type: 'single',
    text: 'How would you rate your sex drive (libido)?',
    options: ['Dropped significantly', 'Somewhat declined', 'Feels OK', 'Is excellent']
  },
  {
    id: 5,
    section: 'SYMPTOMS',
    sectionPosition: '4 / 8',
    type: 'single',
    text: 'Is your sleep restful?',
    subhead: '', // TODO: paste client-approved subhead about sleep + efficiency
    options: ['Pretty good', 'Restless', 'Difficult falling to asleep']
  },
  {
    id: 6,
    section: 'SYMPTOMS',
    sectionPosition: '5 / 8',
    type: 'single',
    text: 'How many times do you need to get up and urinate during the night?',
    options: ['0-2 times per night', '3 times per night or more']
  },
  {
    id: 7,
    section: 'SYMPTOMS',
    sectionPosition: '6 / 8',
    type: 'single',
    text: 'How would you rate your overall happiness?',
    subhead: '', // TODO: paste client-approved subhead
    options: ['Poor', 'Fair', 'Good', 'Excellent']
  },
  {
    id: 8,
    section: 'SYMPTOMS',
    sectionPosition: '7 / 8',
    type: 'single',
    text: 'Have you been experiencing low mood symptoms more often than you want to?',
    subhead: '', // TODO: paste client-approved subhead
    options: ['Yes', 'Never']
  },
  {
    id: 9,
    section: 'SYMPTOMS',
    sectionPosition: '8 / 8',
    type: 'dob',
    text: 'What is your date of birth?',
    subhead: '' // TODO: paste client-approved subhead about age + testosterone
  },
  {
    id: 10,
    section: 'PREFERENCES',
    sectionPosition: '1 / 3',
    type: 'single',
    text: 'How quickly would you like to experience the benefits of optimal testosterone levels?',
    options: [
      'As fast as possible',
      'Slow and steady wins the race',
      'Something between the two'
    ]
  },
  {
    id: 11,
    section: 'PREFERENCES',
    sectionPosition: '2 / 3',
    type: 'dropdown',
    text: 'Which state do you live in?'
  },
  {
    id: 12,
    section: 'PREFERENCES',
    sectionPosition: '3 / 3',
    type: 'single',
    text: 'How many days a week do you typically do physical exercise?',
    options: ['0-2 times per week', '3 times per week or more']
  },
  {
    id: 13,
    section: 'REFERRAL',
    sectionPosition: '1 / 1',
    type: 'single',
    text: 'Did you hear about Lifeforce from a medical professional?',
    subhead: '', // TODO: paste client-approved subhead about doctor referrals
    options: ['Yes', 'No']
  }
];

export const US_STATES = [
  'Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'District Of Columbia', 'Federated States Of Micronesia',
  'Florida', 'Georgia', 'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas',
  'Kentucky', 'Louisiana', 'Maine', 'Marshall Islands', 'Maryland', 'Massachusetts',
  'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
  'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
  'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania',
  'Puerto Rico', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas',
  'Utah', 'Vermont', 'Virgin Islands', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming'
];

export function getQuestion(id: number): Question | undefined {
  return QUESTIONS.find(q => q.id === id);
}
