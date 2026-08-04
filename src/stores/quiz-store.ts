import { defineStore } from 'pinia'
import type { Quiz } from '../types/quiz'
import { SAMPLE_QUIZZES, hasInitializedQuizzes } from '../data/sample-quizzes'

interface QuizStoreState {
  quizzes: Quiz[]
}

export const useQuizStore = defineStore('quiz', {
  state: (): QuizStoreState => ({
    quizzes: [],
  }),

  getters: {
    getQuizById: (state) => (id: string) => {
      return state.quizzes.find((q) => q.id === id) ?? null
    },
  },

  actions: {
    initializeSampleQuizzes() {
      if (hasInitializedQuizzes(this.quizzes)) return
      this.quizzes = SAMPLE_QUIZZES
    },

    addQuiz(quiz: Quiz) {
      this.quizzes.push(quiz)
    },

    updateQuiz(id: string, updatedQuiz: Partial<Quiz>) {
      const index = this.quizzes.findIndex((q) => q.id === id)
      if (index !== -1) {
        this.quizzes[index] = { ...this.quizzes[index], ...updatedQuiz }
      }
    },

    deleteQuiz(id: string) {
      this.quizzes = this.quizzes.filter((q) => q.id !== id)
    },
  },

  persist: {
    pick: ['quizzes'],
  },
})
