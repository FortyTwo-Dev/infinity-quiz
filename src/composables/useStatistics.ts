import { computed, ref } from 'vue'
import { useQuizStore, useQuizHistoryStore } from '@/stores'
import type { QuizResult } from '@/types'

export interface LearningCurvePoint {
  attempt: number
  passRate: number
}

/**
 * Build a learning curve from a flat list of results. Results are grouped by
 * quiz and sorted chronologically, so the first attempt of every quiz lands on
 * attempt #1, the second on #2, etc. Each point is the average pass rate
 * across all quizzes at that attempt number.
 */
export function buildLearningCurve(results: QuizResult[]): LearningCurvePoint[] {
  const byQuiz = new Map<string, QuizResult[]>()
  for (const result of results) {
    const list = byQuiz.get(result.quizId) ?? []
    list.push(result)
    byQuiz.set(result.quizId, list)
  }

  let maxAttempts = 0
  const series = new Map<number, { passed: number; total: number }>()
  for (const list of byQuiz.values()) {
    list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    list.forEach((result, index) => {
      const entry = series.get(index) ?? { passed: 0, total: 0 }
      entry.passed += result.passed ? 1 : 0
      entry.total += 1
      series.set(index, entry)
      maxAttempts = Math.max(maxAttempts, index + 1)
    })
  }

  const points: LearningCurvePoint[] = []
  for (let i = 0; i < maxAttempts; i++) {
    const entry = series.get(i)
    if (!entry || entry.total === 0) continue
    points.push({ attempt: i + 1, passRate: (entry.passed / entry.total) * 100 })
  }
  return points
}

export function useStatistics() {
  const quizStore = useQuizStore()
  const historyStore = useQuizHistoryStore()

  const selectedCategory = ref<string | null>(null)

  /** Categories that have at least one recorded attempt. */
  const categories = computed(() => {
    const attemptedIds = new Set(historyStore.results.map((r) => r.quizId))
    const found = new Set<string>()
    for (const quiz of quizStore.quizzes) {
      if (attemptedIds.has(quiz.id) && quiz.category) found.add(quiz.category)
    }
    return Array.from(found).sort((a, b) => a.localeCompare(b))
  })

  /** Learning curve, optionally filtered by category. */
  const learningCurve = computed(() => {
    if (!selectedCategory.value) {
      return buildLearningCurve(historyStore.results)
    }

    const quizIds = new Set(
      quizStore.quizzes
        .filter((q) => q.category === selectedCategory.value)
        .map((q) => q.id),
    )
    return buildLearningCurve(historyStore.results.filter((r) => quizIds.has(r.quizId)))
  })

  return {
    categories,
    selectedCategory,
    learningCurve,
  }
}
