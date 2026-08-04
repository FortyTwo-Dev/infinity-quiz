import { computed, type Ref, type ComputedRef, unref } from 'vue'
import { FEEDBACK_THRESHOLDS } from '../constants'

export type FeedbackLevel = keyof typeof FEEDBACK_THRESHOLDS

export const FEEDBACK_MESSAGES: Record<FeedbackLevel, { text: string; class: string }> = {
  excellent: { text: 'Parfait !', class: 'excellent' },
  good: { text: 'Bien joué !', class: 'good' },
  average: { text: 'Pas mal !', class: 'average' },
  poor: { text: 'Continuez à pratiquer !', class: 'poor' },
}

export function getFeedbackLevel(percentage: number): FeedbackLevel {
  if (percentage >= FEEDBACK_THRESHOLDS.excellent) return 'excellent'
  if (percentage >= FEEDBACK_THRESHOLDS.good) return 'good'
  if (percentage >= FEEDBACK_THRESHOLDS.average) return 'average'
  return 'poor'
}

export function getFeedback(percentage: number): { text: string; class: string } {
  const level = getFeedbackLevel(percentage)
  return FEEDBACK_MESSAGES[level]
}

export function useFeedback(percentage: Ref<number> | ComputedRef<number>) {
  const level = computed<FeedbackLevel>(() => {
    const p = unref(percentage)
    return getFeedbackLevel(p)
  })

  const feedback = computed(() => {
    return FEEDBACK_MESSAGES[level.value]
  })

  const isPositive = computed(() => {
    return level.value === 'excellent' || level.value === 'good'
  })

  return {
    level,
    feedback,
    isPositive,
  }
}
