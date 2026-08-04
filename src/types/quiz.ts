export interface Question {
  id: string
  text: string
  options: string[]
  correctAnswerIndex: number
}

export interface Quiz {
  id: string
  title: string
  description: string
  questions: Question[]
}

export interface QuizState {
  currentQuizId: string | null
  currentQuestionIndex: number
  selectedAnswers: Record<string, number | null>
  score: number
  isCompleted: boolean
}

export type QuizAnswer = number | null
