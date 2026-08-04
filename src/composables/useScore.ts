import { computed } from 'vue'
import { SCORE_GRADES } from '../constants'

export function useScore(total: number, current: number) {
  const percentage = computed(() => {
    if (total === 0) return 0
    return Math.round((current / total) * 100)
  })

  const formattedScore = computed(() => {
    return `${current} / ${total}`
  })

  const letterGrade = computed(() => {
    const percent = percentage.value
    if (percent >= SCORE_GRADES.A_plus) return 'A+'
    if (percent >= SCORE_GRADES.A) return 'A'
    if (percent >= SCORE_GRADES.A_minus) return 'A-'
    if (percent >= SCORE_GRADES.B_plus) return 'B+'
    if (percent >= SCORE_GRADES.B) return 'B'
    if (percent >= SCORE_GRADES.B_minus) return 'B-'
    if (percent >= SCORE_GRADES.C_plus) return 'C+'
    if (percent >= SCORE_GRADES.C) return 'C'
    if (percent >= SCORE_GRADES.C_minus) return 'C-'
    if (percent >= SCORE_GRADES.D_plus) return 'D+'
    if (percent >= SCORE_GRADES.D) return 'D'
    return 'F'
  })

  return {
    percentage,
    formattedScore,
    letterGrade,
  }
}
