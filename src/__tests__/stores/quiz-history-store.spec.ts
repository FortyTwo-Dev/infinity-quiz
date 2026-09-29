import { describe, it, expect, beforeEach } from 'vitest'
import { useQuizHistoryStore } from '../../stores/quiz/quiz-history-store'
import { setupTestPinia } from './setup'

describe('useQuizHistoryStore', () => {
  beforeEach(() => {
    setupTestPinia()
  })


  describe('state', () => {
    it('should initialize with empty results array', () => {
      const store = useQuizHistoryStore()
      expect(store.results).toEqual([])
    })
  })

  describe('getters', () => {
    describe('getLatestResultByQuizId', () => {
      it('should return null when no result found', () => {
        const store = useQuizHistoryStore()
        expect(store.getLatestResultByQuizId('non-existent')).toBeNull()
      })

      it('should return the only result for a quiz', () => {
        const store = useQuizHistoryStore()
        store.addResult('quiz-1', 5, 10, true)
        const result = store.getLatestResultByQuizId('quiz-1')
        expect(result).not.toBeNull()
        expect(result?.score).toBe(5)
      })

      it('should return the most recent result when dates are different', () => {
        const store = useQuizHistoryStore()
        const olderDate = new Date(Date.now() - 2000).toISOString()

        store.$patch({
          results: [
            { quizId: 'quiz-1', score: 5, totalQuestions: 10, passed: true, date: olderDate },
          ],
        })

        store.addResult('quiz-1', 8, 10, true)

        const result = store.getLatestResultByQuizId('quiz-1')
        expect(result?.score).toBe(8)
      })
    })

    describe('getResultsByQuizId', () => {
      it('should return an empty array when no result found', () => {
        const store = useQuizHistoryStore()
        expect(store.getResultsByQuizId('non-existent')).toEqual([])
      })

      it('should return results ordered oldest first', () => {
        const store = useQuizHistoryStore()
        const olderDate = new Date(Date.now() - 4000).toISOString()
        const newerDate = new Date(Date.now() - 2000).toISOString()

        store.$patch({
          results: [
            { quizId: 'quiz-1', score: 8, totalQuestions: 10, passed: true, date: newerDate },
            { quizId: 'quiz-1', score: 5, totalQuestions: 10, passed: false, date: olderDate },
          ],
        })

        const results = store.getResultsByQuizId('quiz-1')
        expect(results.map((r) => r.score)).toEqual([5, 8])
      })

      it('should only return results for the given quiz', () => {
        const store = useQuizHistoryStore()
        store.addResult('quiz-1', 5, 10, true)
        store.addResult('quiz-2', 8, 10, true)

        const results = store.getResultsByQuizId('quiz-1')
        expect(results).toHaveLength(1)
        expect(results[0]?.quizId).toBe('quiz-1')
      })
    })

    describe('getStatsByQuizId', () => {
      it('should return null when no result found', () => {
        const store = useQuizHistoryStore()
        expect(store.getStatsByQuizId('non-existent')).toBeNull()
      })

      it('should aggregate attempts, best, average and pass rate', () => {
        const store = useQuizHistoryStore()
        store.addResult('quiz-1', 8, 10, true)
        store.addResult('quiz-1', 5, 10, false)
        store.addResult('quiz-1', 9, 10, true)

        const stats = store.getStatsByQuizId('quiz-1')
        expect(stats).toEqual({
          attempts: 3,
          bestPercentage: 90,
          averagePercentage: (80 + 50 + 90) / 3,
          passRate: (2 / 3) * 100,
        })
      })

      it('should handle a zero-question result gracefully', () => {
        const store = useQuizHistoryStore()
        store.$patch({
          results: [{ quizId: 'quiz-1', score: 0, totalQuestions: 0, passed: false, date: new Date().toISOString() }],
        })

        const stats = store.getStatsByQuizId('quiz-1')
        expect(stats?.bestPercentage).toBe(0)
        expect(stats?.averagePercentage).toBe(0)
      })
    })

    describe('getGlobalStats', () => {
      it('should return null when there are no results', () => {
        const store = useQuizHistoryStore()
        expect(store.getGlobalStats).toBeNull()
      })

      it('should aggregate across every quiz', () => {
        const store = useQuizHistoryStore()
        store.addResult('quiz-1', 8, 10, true)
        store.addResult('quiz-2', 5, 10, false)
        store.addResult('quiz-2', 9, 10, true)

        expect(store.getGlobalStats).toEqual({
          attempts: 3,
          averagePercentage: (80 + 50 + 90) / 3,
          passRate: (2 / 3) * 100,
        })
      })
    })

    describe('getCumulativeAverages', () => {
      it('should return an empty array when there are no results', () => {
        const store = useQuizHistoryStore()
        expect(store.getCumulativeAverages).toEqual([])
      })

      it('should compute a running average ordered oldest first', () => {
        const store = useQuizHistoryStore()
        const olderDate = new Date(Date.now() - 4000).toISOString()
        const middleDate = new Date(Date.now() - 2000).toISOString()
        const newerDate = new Date().toISOString()

        store.$patch({
          results: [
            { quizId: 'q1', score: 9, totalQuestions: 10, passed: true, date: newerDate },
            { quizId: 'q1', score: 5, totalQuestions: 10, passed: false, date: olderDate },
            { quizId: 'q2', score: 7, totalQuestions: 10, passed: true, date: middleDate },
          ],
        })

        const points = store.getCumulativeAverages
        expect(points.map((p) => p.average)).toEqual([50, 60, 70])
      })
    })

    describe('getPassFailTotals', () => {
      it('should return zero counts when there are no results', () => {
        const store = useQuizHistoryStore()
        expect(store.getPassFailTotals).toEqual({ passed: 0, failed: 0 })
      })

      it('should count passed and failed attempts', () => {
        const store = useQuizHistoryStore()
        store.addResult('quiz-1', 8, 10, true)
        store.addResult('quiz-2', 5, 10, false)
        store.addResult('quiz-2', 9, 10, true)

        expect(store.getPassFailTotals).toEqual({ passed: 2, failed: 1 })
      })
    })

    describe('getScoreDistribution', () => {
      it('should distribute attempts into 20-point bins', () => {
        const store = useQuizHistoryStore()
        store.addResult('q1', 1, 10, false) // 10%
        store.addResult('q2', 5, 10, false) // 50%
        store.addResult('q3', 10, 10, true) // 100%

        const bins = store.getScoreDistribution
        expect(bins.find((b) => b.label === '0-20%')?.count).toBe(1)
        expect(bins.find((b) => b.label === '41-60%')?.count).toBe(1)
        expect(bins.find((b) => b.label === '81-100%')?.count).toBe(1)
        expect(bins.reduce((sum, b) => sum + b.count, 0)).toBe(3)
      })
    })

    describe('getAverageByQuiz', () => {
      it('should return an empty array when there are no results', () => {
        const store = useQuizHistoryStore()
        expect(store.getAverageByQuiz).toEqual([])
      })

      it('should compute averages sorted from highest to lowest', () => {
        const store = useQuizHistoryStore()
        store.addResult('q1', 9, 10, true) // 90%
        store.addResult('q2', 5, 10, false) // 50%
        store.addResult('q1', 7, 10, true) // 70%

        const averages = store.getAverageByQuiz
        expect(averages).toEqual([
          { quizId: 'q1', average: 80 },
          { quizId: 'q2', average: 50 },
        ])
      })
    })
  })

  describe('actions', () => {
    describe('addResult', () => {
      it('should add a new result', () => {
        const store = useQuizHistoryStore()
        expect(store.results).toHaveLength(0)
        store.addResult('quiz-1', 5, 10, true)
        expect(store.results).toHaveLength(1)
        expect(store.results[0].quizId).toBe('quiz-1')
        expect(store.results[0].score).toBe(5)
        expect(store.results[0].totalQuestions).toBe(10)
        expect(store.results[0].passed).toBe(true)
        expect(store.results[0].date).toBeDefined()
      })

      it('should add multiple results', () => {
        const store = useQuizHistoryStore()
        store.addResult('quiz-1', 5, 10, true)
        store.addResult('quiz-2', 8, 10, true)
        expect(store.results).toHaveLength(2)
      })

      it('should store date as ISO string', () => {
        const store = useQuizHistoryStore()
        store.addResult('quiz-1', 5, 10, true)
        const date = new Date(store.results[0].date)
        expect(date.toISOString()).toBe(store.results[0].date)
      })

      it('should handle passed=false', () => {
        const store = useQuizHistoryStore()
        store.addResult('quiz-1', 2, 10, false)
        expect(store.results[0].passed).toBe(false)
        expect(store.results[0].score).toBe(2)
      })
    })

    describe('clearResults', () => {
      it('should clear all results', () => {
        const store = useQuizHistoryStore()
        store.addResult('quiz-1', 5, 10, true)
        store.addResult('quiz-2', 8, 10, true)
        expect(store.results).toHaveLength(2)
        store.clearResults()
        expect(store.results).toHaveLength(0)
      })
    })

    describe('clearResultByQuizId', () => {
      it('should remove results for specific quiz', () => {
        const store = useQuizHistoryStore()
        store.addResult('quiz-1', 5, 10, true)
        store.addResult('quiz-2', 8, 10, true)
        store.addResult('quiz-1', 6, 10, true)
        expect(store.results).toHaveLength(3)
        store.clearResultByQuizId('quiz-1')
        expect(store.results).toHaveLength(1)
        expect(store.results[0].quizId).toBe('quiz-2')
      })

      it('should do nothing when quiz not found', () => {
        const store = useQuizHistoryStore()
        store.addResult('quiz-1', 5, 10, true)
        store.clearResultByQuizId('non-existent')
        expect(store.results).toHaveLength(1)
      })
    })
  })
})
