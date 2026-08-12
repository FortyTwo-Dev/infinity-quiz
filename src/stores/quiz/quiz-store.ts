import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Quiz } from '../../types/quiz'
import { SAMPLE_QUIZZES, hasInitializedQuizzes } from '../../data/sample-quizzes'

export const useQuizStore = defineStore(
  'quiz',
  () => {
    // State
    const quizzes = ref<Quiz[]>([])

    // Getters
    const getQuizById = computed(() => (id: string) => {
      return quizzes.value.find((q) => q.id === id) ?? null
    })

    // Actions
    const initializeSampleQuizzes = () => {
      if (hasInitializedQuizzes(quizzes.value)) return
      quizzes.value = SAMPLE_QUIZZES
    }

    const addQuiz = (quiz: Quiz) => {
      quizzes.value.push(quiz)
    }

    const updateQuiz = (id: string, updatedQuiz: Partial<Quiz>) => {
      const index = quizzes.value.findIndex((q) => q.id === id)
      if (index !== -1) {
        quizzes.value[index] = { ...quizzes.value[index], ...updatedQuiz } as Quiz
      }
    }

    const deleteQuiz = (id: string) => {
      quizzes.value = quizzes.value.filter((q) => q.id !== id)
    }

    return {
      // State
      quizzes,

      // Getters
      getQuizById,

      // Actions
      initializeSampleQuizzes,
      addQuiz,
      updateQuiz,
      deleteQuiz,
    }
  },
  {
    persist: {
      key: 'infinity-quiz-quizzes',
      pick: ['quizzes'],
    },
  },
)
