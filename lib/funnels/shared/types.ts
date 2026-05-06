// Canonical types for the multi-funnel engine.
// Funnel authors only need to import from here.

export type ClientSlug = string;
export type FunnelSlug = string;

// ---------------- Steps ----------------

export type StepType =
  | 'question'
  | 'interstitial'
  | 'calculate'
  | 'submit'
  | 'results'
  | 'not-qualified';

export type QuestionInputType =
  | 'single'
  | 'multi'
  | 'multi-limited'
  | 'dropdown'
  | 'dob'
  | 'weight'
  | 'height'
  | 'text'
  | 'email';

export type Question = {
  id: string;
  type: 'question';
  inputType: QuestionInputType;
  text: string;
  subhead?: string;
  options?: string[];
  optionLabels?: Record<string, string>; // optional separate labels for analytics
  maxSelections?: number;
  required?: boolean;          // default true
  autoAdvance?: boolean;       // single + dropdown only
  /** Visual layout for option buttons. 'list' = vertical full-width stack,
   *  'grid' = responsive 2-3 column grid. Default 'list'. */
  layout?: 'list' | 'grid';
  section?: string;
  sectionPosition?: string;
  /** Branching shorthand. Keys = answer values, '*' = wildcard. Values = step ref or path. */
  onAnswer?: Record<string, string>;
};

export type Interstitial = {
  id: string;
  type: 'interstitial';
  objective?: string;          // analytics label, e.g. 'social_proof', 'urgency'
  headline?: string;           // copy slot key OR inline
  body?: string;
  ctaLabel?: string;
  next?: string;               // override default next step
  tracking?: { metadata?: Record<string, unknown> };
};

export type CalculateStepDef = {
  id: string;
  type: 'calculate';
  /** Names of calculation functions to run, in order. */
  calculations: string[];
  next?: string;
};

export type SimpleStep = {
  id: string;
  type: 'submit' | 'not-qualified' | 'results';
  variant?: string;            // for 'results'
};

export type Step = Question | Interstitial | CalculateStepDef | SimpleStep;

export type StepRef = { type: StepType; id: string };

// ---------------- Rules engine ----------------

export type Op =
  | 'eq' | 'neq' | 'lt' | 'lte' | 'gt' | 'gte'
  | 'in' | 'nin' | 'contains' | 'exists';

export type Predicate =
  | { field: string; operator: Op; value?: unknown }
  | { all: Predicate[] }
  | { any: Predicate[] }
  | { not: Predicate };

export type Action =
  | { type: 'route'; to: string; reason?: string }
  | { type: 'skip'; target: 'next' | string } // step id
  | { type: 'show_interstitial'; id: string }
  | { type: 'set_derived_value'; field: string; value: unknown | { from: string } }
  | { type: 'mark_not_qualified'; reason: string }
  | { type: 'assign_result_variant'; variant: string };

export type Rule = {
  id: string;
  when: Predicate;
  action: Action;
  trigger?: 'on-answer' | 'pre-render' | 'post-calculate';
  haltOnMatch?: boolean;
};

// ---------------- Calculations ----------------

export type CalculationFn = (state: QuizState) => Record<string, unknown>;

// ---------------- State ----------------

export type Answer =
  | string
  | string[]
  | number
  | { day: string; month: string; year: string }
  | { value: number; unit: 'lb' | 'kg' };

export type SourceContext = {
  adId?: string;
  campaignId?: string;
  creativeId?: string;
  advertorialId?: string;
  landingPageId?: string;
  discoverRunId?: string;
  offerId?: string;
  utm?: Record<string, string>;
};

export type QuizState = {
  sessionId: string;
  funnelVersion: string;
  startedAt: string;
  updatedAt: string;
  answers: Record<string, Answer>;
  derived: Record<string, unknown>;
  eligibility: { qualified: boolean; reasons: string[] };
  resultVariant: string | null;
  history: string[];           // step ids visited
  sourceContext: SourceContext;
};

// ---------------- Klaviyo mapping ----------------

export type MappingExpression =
  | { from: 'answer'; questionId: string; useLabel?: boolean }
  | { from: 'derived'; key: string }
  | { from: 'eligibility'; field: 'qualified' | 'reasons' | 'resultVariant' }
  | { from: 'sourceContext'; key: keyof SourceContext | string }
  | { from: 'static'; value: unknown }
  | { from: 'concat'; parts: MappingExpression[]; sep?: string };

export type ConditionalTag = { tag: string; when: Predicate };

export type KlaviyoMapping = {
  listId?: string;
  defaultTags?: string[];
  conditionalTags?: ConditionalTag[];
  customProperties?: Record<string, MappingExpression>;
};

// ---------------- Tracking ----------------

export type TrackingOverrides = {
  pixels?: Partial<{ meta: string; ga4: string; tiktok: string; googleAds: string }>;
  endpoint?: string;           // override server-side track endpoint
};

// ---------------- Brand ----------------

export type BrandConfig = {
  wordmark?: string;
  logoSrc?: string;
  logoAlt?: string;
  title?: string;
  description?: string;
  images?: Record<string, string | string[]>;
  /** Footer rendered on every funnel page. Empty fields render as <Placeholder>. */
  footer?: {
    legalLinks?: string;     // e.g. "Terms · Privacy · Shipping · Pharmacy"
    disclaimer?: string;     // FDA / results-vary / medical disclaimer paragraph
    entity?: string;         // company name + address + entity info
  };
};

// ---------------- Copy ----------------

export type CopyMap = Record<string, string>;

// ---------------- The whole config ----------------

export type FunnelConfig = {
  clientSlug: ClientSlug;
  funnelSlug: FunnelSlug;
  displayName: string;
  version: string;

  questions: Question[];
  interstitials: Interstitial[];
  flow: StepRef[];
  rules: Rule[];
  calculations: Record<string, CalculationFn>;

  copy: CopyMap;
  brand: BrandConfig;

  /** Optional explicit ordering for `results.*` slots on the results page.
   *  When set, only listed slots render (in this order). When omitted,
   *  all `results.*` slots render in their declaration order from `copy`.
   *  Ignored when `resultsBlocks` is set. */
  resultsLayout?: string[];

  /** Typed structured persuasion blocks for the landing page.
   *  When set, LandingView renders these in order INSTEAD of the flat
   *  hero.* / below_fold.* slot iteration. */
  landingBlocks?: LandingBlock[];

  /** Typed structured persuasion blocks for the results page.
   *  When set, ResultsView renders these in order INSTEAD of the flat
   *  results.* slot iteration. */
  resultsBlocks?: ResultsBlock[];

  klaviyo: KlaviyoMapping;
  tracking?: TrackingOverrides;
};

// Re-export block types from blocks.ts for convenience
import type { LandingBlock, ResultsBlock } from './blocks';
export type { LandingBlock, ResultsBlock } from './blocks';

// ---------------- Helpers ----------------

export function getQuestion(funnel: FunnelConfig, id: string): Question | undefined {
  return funnel.questions.find((q) => q.id === id);
}

export function getInterstitial(funnel: FunnelConfig, id: string): Interstitial | undefined {
  return funnel.interstitials.find((i) => i.id === id);
}
