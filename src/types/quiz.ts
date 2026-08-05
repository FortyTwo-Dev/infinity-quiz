export interface Question {
  id: string
  text: string
  options: string[]
  correctAnswerIndex: number
  timeLimit?: number // Time limit in seconds for this specific question
}

export interface Quiz {
  id: string
  title: string
  description: string
  questions: Question[]
  timeLimit?: number // Time limit in seconds for the entire quiz (applies to questions without individual timeLimit)
  shuffleQuestions?: boolean // Whether to shuffle the order of questions
}

export interface QuizState {
  currentQuizId: string | null
  currentQuestionIndex: number
  selectedAnswers: Record<string, number | null>
  score: number
  isCompleted: boolean
}

export type QuizAnswer = number | null
