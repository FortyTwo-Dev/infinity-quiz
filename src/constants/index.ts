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

export const FEEDBACK_THRESHOLDS = {
  excellent: 80,
  good: 60,
  average: 40,
  poor: 0,
} as const

export const SCORE_GRADES = {
  A_plus: 90,
  A: 85,
  A_minus: 80,
  B_plus: 75,
  B: 70,
  B_minus: 65,
  C_plus: 60,
  C: 55,
  C_minus: 50,
  D_plus: 45,
  D: 40,
} as const

export const QUIZ_CONSTANTS = {
  defaultQuestionCount: 10,
  maxQuestionsPerQuiz: 100,
  minQuestionsPerQuiz: 1,
} as const

export const STORAGE_KEYS = {
  quizzes: 'infinity-quiz-quizzes',
  session: 'infinity-quiz-session',
} as const
