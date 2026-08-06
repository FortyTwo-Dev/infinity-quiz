import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface QuizResult {
  quizId: string
  score: number
  totalQuestions: number
  date: string
  passed: boolean
}

export const useQuizHistoryStore = defineStore(
  'quizHistory',
  () => {
    // State
    const results = ref<QuizResult[]>([])

    // Getters
    const getResultByQuizId = computed(() => (quizId: string) => {
      return results.value.find((r) => r.quizId === quizId) ?? null
    })

    const getLatestResultByQuizId = computed(() => (quizId: string) => {
      const quizResults = results.value
        .filter((r) => r.quizId === quizId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      return quizResults.length > 0 ? quizResults[0] : null
    })

    // Actions
    const addResult = (quizId: string, score: number, totalQuestions: number, passed: boolean) => {
      const result: QuizResult = {
        quizId,
        score,
        totalQuestions,
        date: new Date().toISOString(),
        passed,
      }
      results.value.push(result)
    }

    const clearResults = () => {
      results.value = []
    }

    const clearResultByQuizId = (quizId: string) => {
      results.value = results.value.filter((r) => r.quizId !== quizId)
    }

    return {
      // State
      results,

      // Getters
      getResultByQuizId,
      getLatestResultByQuizId,

      // Actions
      addResult,
      clearResults,
      clearResultByQuizId,
    }
  },
  {
    persist: {
      key: 'infinity-quiz-history',
      pick: ['results'],
    },
  }
)
