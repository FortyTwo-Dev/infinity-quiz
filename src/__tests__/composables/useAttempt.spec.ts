import { describe, it, expect } from 'vitest'
import { getAttemptStatus } from '../../composables/useAttempt'
import type { QuizResult } from '../../types/quiz'

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
