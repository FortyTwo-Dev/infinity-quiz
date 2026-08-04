import { defineStore } from 'pinia'

interface QuizResult {
  quizId: string
  score: number
  totalQuestions: number
  date: string
  passed: boolean
}

interface QuizHistoryState {
  results: QuizResult[]
}

export const useQuizHistoryStore = defineStore('quizHistory', {
  state: (): QuizHistoryState => ({
    results: [],
  }),

  getters: {
    getResultByQuizId: (state) => (quizId: string) => {
      return state.results.find((r) => r.quizId === quizId) ?? null
    },

    getLatestResultByQuizId: (state) => (quizId: string) => {
      const quizResults = state.results
        .filter((r) => r.quizId === quizId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      return quizResults.length > 0 ? quizResults[0] : null
    },
  },

  actions: {
    addResult(quizId: string, score: number, totalQuestions: number, passed: boolean) {
      const result: QuizResult = {
        quizId,
        score,
        totalQuestions,
        date: new Date().toISOString(),
        passed,
      }
      this.results.push(result)
    },

    clearResults() {
      this.results = []
    },

    clearResultByQuizId(quizId: string) {
      this.results = this.results.filter((r) => r.quizId !== quizId)
    },
  },

  persist: {
    key: 'quiz-history',
    pick: ['results'],
  },
})
