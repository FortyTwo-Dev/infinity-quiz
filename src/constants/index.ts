export const COLORS = {
  primary: '#007bff',
  primaryDark: '#0056b3',
  secondary: '#6c757d',
  success: '#28a745',
  warning: '#ffc107',
  danger: '#dc3545',
  light: '#f8f9fa',
  dark: '#343a40',
  white: '#ffffff',
  black: '#000000',
  gray: '#6c757d',
  lightGray: '#f8f9fa',
  border: '#ddd',
  background: '#fafafa',
} as const

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

export const QUIZ_CONSTANTS = {
  defaultQuestionCount: 10,
  maxQuestionsPerQuiz: 100,
  minQuestionsPerQuiz: 1,
} as const

export const STORAGE_KEYS = {
  quizzes: 'infinity-quiz-quizzes',
  session: 'infinity-quiz-session',
  history: 'infinity-quiz-history',
} as const
