import { computed, type Ref, type ComputedRef, unref } from 'vue'
import { SCORE_THRESHOLDS } from '../constants'

export type FeedbackLevel = keyof typeof SCORE_THRESHOLDS

/**
 * Display labels per feedback level. Single source of truth for feedback text;
 * swap this dictionary for an i18n lookup later without touching the logic.
 */
export const FEEDBACK_LABELS: Record<FeedbackLevel, string> = {
  perfect: 'Sans faute !',
  excellent: 'Parfait !',
  good: 'Bien joué !',
  average: 'Pas mal !',
  poor: 'Continuez à pratiquer !',
}

export function getFeedbackLevel(percentage: number): FeedbackLevel {
  if (percentage >= SCORE_THRESHOLDS.perfect) return 'perfect'
  if (percentage >= SCORE_THRESHOLDS.excellent) return 'excellent'
  if (percentage >= SCORE_THRESHOLDS.good) return 'good'
  if (percentage >= SCORE_THRESHOLDS.average) return 'average'
  return 'poor'
}

export function useFeedback(percentage: Ref<number> | ComputedRef<number>) {
  const level = computed<FeedbackLevel>(() => {
    const p = unref(percentage)
    return getFeedbackLevel(p)
  })

  const label = computed(() => {
    return FEEDBACK_LABELS[level.value]
  })

  return {
    level,
    label,
  }
}
