export interface Question {
  id: string
  text: string
  options: string[]
  correctAnswerIndex: number
  timeLimit?: number // Time limit in seconds for this specific question
  shuffleAnswers?: boolean // Whether to shuffle the order of answers for this question
  explanation?: string // Explanation shown when feedback is enabled (required if quiz.feedbackEnabled is true)
}

export interface Quiz {
  id: string
  title: string
  description: string
  questions: Question[]
  timeLimit?: number // Time limit in seconds for the entire quiz (applies to questions without individual timeLimit)
  shuffleQuestions?: boolean // Whether to shuffle the order of questions
  shuffleAnswers?: boolean // Whether to shuffle answers for all questions (can be overridden per question)
  maxSkips?: number // Maximum number of questions that can be skipped (undefined = unlimited)
  enableReviewMode?: boolean // Whether to enable review mode after quiz completion
  feedbackEnabled?: boolean // Whether to show immediate feedback after answer selection
  category?: string // Quiz category for organization
  tags?: string[] // Additional tags for filtering and search
}

export interface QuestionResult {
  question: Question
  userAnswer: number | null
  isCorrect: boolean
  isSkipped: boolean
}

export interface QuizState {
  currentQuizId: string | null
  currentQuestionIndex: number
  selectedAnswers: Record<string, number | null>
  score: number
  isCompleted: boolean
}

export type QuizAnswer = number | null
