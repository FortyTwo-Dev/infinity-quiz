import { describe, it, expect } from 'vitest'
import { buildLearningCurve } from '../../composables/useStatistics'
import type { QuizResult } from '../../types/quiz'

function result(quizId: string, passed: boolean, date: string): QuizResult {
  return { quizId, score: passed ? 10 : 0, totalQuestions: 10, passed, date }
}

describe('buildLearningCurve', () => {
  it('should return an empty array for no results', () => {
    expect(buildLearningCurve([])).toEqual([])
  })

  it('should compute pass rate per attempt number across quizzes', () => {
    const results: QuizResult[] = [
      result('q1', true, '2026-01-01T00:00:00.000Z'),
      result('q1', true, '2026-01-02T00:00:00.000Z'),
      result('q2', false, '2026-01-03T00:00:00.000Z'),
      result('q2', true, '2026-01-04T00:00:00.000Z'),
    ]

    const curve = buildLearningCurve(results)

    // Attempt #1: q1 passed + q2 failed -> 50%
    // Attempt #2: q1 passed + q2 passed -> 100%
    expect(curve).toEqual([
      { attempt: 1, passRate: 50 },
      { attempt: 2, passRate: 100 },
    ])
  })

  it('should handle quizzes with different attempt counts', () => {
    const results: QuizResult[] = [
      result('q1', true, '2026-01-01T00:00:00.000Z'),
      result('q1', true, '2026-01-02T00:00:00.000Z'),
      result('q1', true, '2026-01-03T00:00:00.000Z'),
      result('q2', false, '2026-01-04T00:00:00.000Z'),
    ]

    const curve = buildLearningCurve(results)

    // Attempt #1: q1 passed + q2 failed -> 50%
    // Attempt #2: q1 passed (only) -> 100%
    // Attempt #3: q1 passed (only) -> 100%
    expect(curve).toEqual([
      { attempt: 1, passRate: 50 },
      { attempt: 2, passRate: 100 },
      { attempt: 3, passRate: 100 },
    ])
  })
})
