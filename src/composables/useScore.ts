import { computed, unref, type Ref, type ComputedRef } from 'vue'
import { PASS_THRESHOLD } from '../constants'

export type ScoreSource = number | Ref<number> | ComputedRef<number>

/**
 * Percentage of correct answers, rounded for display only.
 */
export function getPercentage(score: number, total: number): number {
  if (total === 0) return 0
  return Math.round((score / total) * 100)
}

/**
 * Whether the score reaches the pass threshold. Uses the exact ratio
 * (no rounding) so a rounded 60% below the threshold is never a false pass.
 */
export function isPassed(score: number, total: number): boolean {
  if (total === 0) return false
  return score / total >= PASS_THRESHOLD / 100
}

export function useScore(total: ScoreSource, current: ScoreSource) {
  const percentage = computed(() => getPercentage(unref(current), unref(total)))

  const passed = computed(() => isPassed(unref(current), unref(total)))

  const formattedScore = computed(() => {
    return `${unref(current)} / ${unref(total)}`
  })

  return {
    percentage,
    passed,
    formattedScore,
  }
}
