import { describe, it, expect, beforeEach } from 'vitest'
import { computed } from 'vue'
import {
  useAttempt,
  getAttemptStatus,
  ATTEMPT_STATUS_LABELS,
  ATTEMPT_STATUS_COLORS,
} from '../../composables/useAttempt'
import { useQuizHistoryStore } from '../../stores'
import type { QuizResult } from '../../types/quiz'
import { setupTestPinia } from '../stores/setup'

function createResult(overrides: Partial<QuizResult> = {}): QuizResult {
  return {
    quizId: 'quiz-1',
    score: 5,
    totalQuestions: 10,
    date: new Date().toISOString(),
    passed: true,
    ...overrides,
  }
}

describe('getAttemptStatus', () => {
  it('should return not-attempted when there is no result', () => {
    expect(getAttemptStatus(null)).toBe('not-attempted')
  })

  it('should return passed when the result passed', () => {
    expect(getAttemptStatus(createResult({ passed: true }))).toBe('passed')
  })

  it('should return partial when score is positive but not passed', () => {
    expect(getAttemptStatus(createResult({ passed: false, score: 3 }))).toBe('partial')
  })

  it('should return failed when score is 0 and not passed', () => {
    expect(getAttemptStatus(createResult({ passed: false, score: 0 }))).toBe('failed')
  })
})

describe('useAttempt', () => {
  beforeEach(() => {
    setupTestPinia()
  })

  it('should expose not-attempted when no history exists', () => {
    const { status, label, color, latestResult } = useAttempt(computed(() => 'quiz-1'))
    expect(latestResult.value).toBeNull()
    expect(status.value).toBe('not-attempted')
    expect(label.value).toBe(ATTEMPT_STATUS_LABELS['not-attempted'])
    expect(color.value).toBe('neutral')
  })

  it('should expose passed with its label and color', () => {
    const historyStore = useQuizHistoryStore()
    historyStore.addResult('quiz-1', 8, 10, true)

    const { status, label, color } = useAttempt(computed(() => 'quiz-1'))
    expect(status.value).toBe('passed')
    expect(label.value).toBe(ATTEMPT_STATUS_LABELS.passed)
    expect(color.value).toBe(ATTEMPT_STATUS_COLORS.passed)
  })

  it('should be not-attempted when quizId is null', () => {
    const historyStore = useQuizHistoryStore()
    historyStore.addResult('quiz-1', 8, 10, true)

    const { status } = useAttempt(computed(() => null))
    expect(status.value).toBe('not-attempted')
  })

  it('should use the latest result', () => {
    const historyStore = useQuizHistoryStore()
    const olderDate = new Date(Date.now() - 2000).toISOString()
    historyStore.$patch({
      results: [{ ...createResult({ score: 0, passed: false }), date: olderDate }],
    })
    historyStore.addResult('quiz-1', 10, 10, true)

    const { status } = useAttempt(computed(() => 'quiz-1'))
    expect(status.value).toBe('passed')
  })
})
