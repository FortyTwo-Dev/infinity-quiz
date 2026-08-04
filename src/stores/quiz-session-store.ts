import { defineStore } from 'pinia'
import { useQuizStore, useQuizHistoryStore } from './'

interface QuizSessionState {
  currentQuizId: string | null
  currentQuestionIndex: number
  selectedAnswers: Record<string, number | null>
  score: number
  isCompleted: boolean
}

export const useQuizSessionStore = defineStore(
  'quizSession',
  {
    state: (): QuizSessionState => ({
      currentQuizId: null,
      currentQuestionIndex: 0,
      selectedAnswers: {},
      score: 0,
      isCompleted: false,
    }),

    getters: {
    currentQuiz(state) {
      const quizStore = useQuizStore()
      if (!state.currentQuizId) return null
      return quizStore.getQuizById(state.currentQuizId) ?? null
    },

    currentQuestion(state) {
      const quizStore = useQuizStore()
      if (!state.currentQuizId) return null
      const quiz = quizStore.getQuizById(state.currentQuizId)
      if (!quiz || state.currentQuestionIndex >= quiz.questions.length) return null
      return quiz.questions[state.currentQuestionIndex]
    },

    totalQuestions(state) {
      const quizStore = useQuizStore()
      if (!state.currentQuizId) return 0
      const quiz = quizStore.getQuizById(state.currentQuizId)
      return quiz?.questions.length ?? 0
    },

    progress(state) {
      const quizStore = useQuizStore()
      if (!state.currentQuizId) return 0
      const quiz = quizStore.getQuizById(state.currentQuizId)
      if (!quiz) return 0
      const total = quiz.questions.length
      if (total === 0) return 0
      return (state.currentQuestionIndex / total) * 100
    },

    hasNextQuestion(state) {
      const quizStore = useQuizStore()
      if (!state.currentQuizId) return false
      const quiz = quizStore.getQuizById(state.currentQuizId)
      if (!quiz) return false
      return state.currentQuestionIndex < quiz.questions.length - 1
    },

    hasPreviousQuestion(state) {
      return state.currentQuestionIndex > 0
    },
  },

  actions: {
    selectQuiz(quizId: string) {
      const quizStore = useQuizStore()
      const quiz = quizStore.getQuizById(quizId)
      if (!quiz) return

      this.currentQuizId = quizId
      this.currentQuestionIndex = 0
      this.selectedAnswers = {}
      this.score = 0
      this.isCompleted = false
    },

    selectAnswer(answerIndex: number) {
      const question = this.currentQuestion
      if (!question) return
      this.selectedAnswers[question.id] = answerIndex
    },

    calculateScore() {
      if (!this.currentQuiz) return

      let newScore = 0
      for (const question of this.currentQuiz.questions) {
        const selectedIndex = this.selectedAnswers[question.id]
        if (selectedIndex !== undefined && selectedIndex !== null) {
          if (selectedIndex === question.correctAnswerIndex) {
            newScore += 1
          }
        }
      }
      this.score = newScore
    },

    nextQuestion() {
      if (!this.hasNextQuestion) return
      this.currentQuestionIndex += 1
    },

    previousQuestion() {
      if (!this.hasPreviousQuestion) return
      this.currentQuestionIndex -= 1
    },

    goToQuestion(index: number) {
      if (index < 0 || index >= this.totalQuestions) return
      this.currentQuestionIndex = index
    },

    completeQuiz() {
      this.calculateScore()
      this.isCompleted = true

      // Save result to history
      const historyStore = useQuizHistoryStore()
      const quiz = this.currentQuiz
      if (quiz) {
        const passed = this.score >= quiz.questions.length * 0.7 // 70% to pass
        historyStore.addResult(quiz.id, this.score, quiz.questions.length, passed)
      }
    },

    restartQuiz() {
      if (!this.currentQuizId) return

      this.currentQuestionIndex = 0
      this.selectedAnswers = {}
      this.score = 0
      this.isCompleted = false
    },

    backToQuizList() {
      this.currentQuizId = null
      this.currentQuestionIndex = 0
      this.selectedAnswers = {}
      this.score = 0
      this.isCompleted = false
    },

    getAnswerForCurrentQuestion(): number | null {
      const question = this.currentQuestion
      if (!question) return null
      return this.selectedAnswers[question.id] ?? null
    },

    getAnswerForQuestion(questionId: string): number | null {
      return this.selectedAnswers[questionId] ?? null
    },
  },

  persist: {
    key: 'quiz-session',
    pick: ['currentQuizId', 'currentQuestionIndex', 'selectedAnswers', 'score', 'isCompleted'],
  },
})
