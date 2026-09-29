import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { QuizResult, QuizStats, GlobalStats } from '../../types/quiz'
import { STORAGE_KEYS } from '../../constants'

/** Results for a single quiz ordered chronologically (oldest first). */
function sortByDateAsc(results: QuizResult[]): QuizResult[] {
  return [...results].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

function toPercentage(result: QuizResult): number {
  return result.totalQuestions > 0 ? (result.score / result.totalQuestions) * 100 : 0
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

      const percentages = quizResults.map(toPercentage)
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

    /** Global stats across every recorded attempt. */
    const getGlobalStats = computed((): GlobalStats | null => {
      if (results.value.length === 0) return null

      const percentages = results.value.map(toPercentage)
      const averagePercentage = percentages.reduce((sum, p) => sum + p, 0) / percentages.length
      const passRate = (results.value.filter((r) => r.passed).length / results.value.length) * 100

      return {
        attempts: results.value.length,
        averagePercentage,
        passRate,
      }
    })

    /**
     * Cumulative average percentage over time (oldest → newest). Each point is
     * the running mean of all attempts up to that date, producing a smooth
     * progression curve.
     */
    const getCumulativeAverages = computed(() => {
      const ordered = sortByDateAsc(results.value)
      let sum = 0
      return ordered.map((result, index) => {
        sum += toPercentage(result)
        return {
          date: result.date,
          average: sum / (index + 1),
        }
      })
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
      getGlobalStats,
      getCumulativeAverages,

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
