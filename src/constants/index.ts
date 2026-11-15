/**
 * Single source of truth for score thresholds (percentages).
 * `perfect` and `excellent` drive feedback, `good` is also the pass threshold.
 */
export const SCORE_THRESHOLDS = {
  perfect: 100,
  excellent: 80,
  good: 60,
  average: 40,
  poor: 0,
} as const

/** A quiz is considered passed at or above `good` (60%). */
export const PASS_THRESHOLD = SCORE_THRESHOLDS.good

export const STORAGE_KEYS = {
  quizzes: 'infinity-quiz-quizzes',
  session: 'infinity-quiz-session',
  history: 'infinity-quiz-history',
  theme: 'infinity-quiz-theme',
  accessibility: 'infinity-quiz-accessibility',
} as const

/** Application version, injected at build time from package.json. */
export const APP_VERSION = __APP_VERSION__
