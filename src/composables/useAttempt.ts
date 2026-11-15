import type { QuizResult } from '../types/quiz'

export type AttemptStatus = 'not-attempted' | 'failed' | 'partial' | 'passed'

export type AttemptColor = 'neutral' | 'error' | 'warning' | 'success'

/**
 * Display labels per attempt status. Single source of truth for attempt text;
 * swap this dictionary for an i18n lookup later without touching the logic.
 */
export const ATTEMPT_STATUS_LABELS: Record<AttemptStatus, string> = {
  'not-attempted': 'Not attempted',
  failed: 'Failed',
  partial: 'Partial',
  passed: 'Passed',
}

export const ATTEMPT_STATUS_COLORS: Record<AttemptStatus, AttemptColor> = {
  'not-attempted': 'neutral',
  failed: 'error',
  partial: 'warning',
  passed: 'success',
}

/**
 * Derive the status of the latest attempt for a quiz from its history result.
 */
export function getAttemptStatus(result: QuizResult | null): AttemptStatus {
  if (!result) return 'not-attempted'
  if (result.passed) return 'passed'
  if (result.score > 0) return 'partial'
  return 'failed'
}
