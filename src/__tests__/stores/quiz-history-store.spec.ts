import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useQuizHistoryStore } from '../../stores/quiz/quiz-history-store'

describe('useQuizHistoryStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('state', () => {
    it('should initialize with empty results array', () => {
      const store = useQuizHistoryStore()
      expect(store.results).toEqual([])
    })
  })

  describe('getters', () => {
    describe('getResultByQuizId', () => {
      it('should return null when no result found', () => {
        const store = useQuizHistoryStore()
        expect(store.getResultByQuizId('non-existent')).toBeNull()
      })

      it('should return the result when found', () => {
        const store = useQuizHistoryStore()
        store.addResult('quiz-1', 5, 10, true)
        const result = store.getResultByQuizId('quiz-1')
        expect(result).not.toBeNull()
        expect(result?.quizId).toBe('quiz-1')
        expect(result?.score).toBe(5)
      })
    })

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
