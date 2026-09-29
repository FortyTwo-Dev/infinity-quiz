import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { QuizResult, QuizStats } from '../../types/quiz'
import { STORAGE_KEYS } from '../../constants'

/** Results for a single quiz ordered chronologically (oldest first). */
function sortByDateAsc(results: QuizResult[]): QuizResult[] {
  return [...results].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

export const useQuizHistoryStore = defineStore(
  'quizHistory',
  () => {
    // State
    const results = ref<QuizResult[]>([])

    // Getters
    const getLatestResultByQuizId = computed(() => (quizId: string) => {
      const quizResults = results.value
        .filter((r) => r.quizId === quizId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      return quizResults[0] ?? null
    })

    /** All results for a quiz, ordered oldest → newest. */
    const getResultsByQuizId = computed(() => (quizId: string) => {
      return sortByDateAsc(results.value.filter((r) => r.quizId === quizId))
    })

    /** Aggregated stats (attempts, best, average, pass rate) for a quiz. */
    const getStatsByQuizId = computed(() => (quizId: string): QuizStats | null => {
      const quizResults = results.value.filter((r) => r.quizId === quizId)
      if (quizResults.length === 0) return null

      const percentages = quizResults.map(
        (r) => (r.totalQuestions > 0 ? (r.score / r.totalQuestions) * 100 : 0),
      )
      const bestPercentage = Math.max(...percentages)
      const averagePercentage = percentages.reduce((sum, p) => sum + p, 0) / percentages.length
      const passRate =
        (quizResults.filter((r) => r.passed).length / quizResults.length) * 100

      return {
        attempts: quizResults.length,
        bestPercentage,
        averagePercentage,
        passRate,
      }
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
      getLatestResultByQuizId,
      getResultsByQuizId,
      getStatsByQuizId,

      // Actions
      addResult,
      clearResults,
      clearResultByQuizId,
    }
  },
  {
    persist: {
      key: STORAGE_KEYS.history,
      pick: ['results'],
    },
  },
)
