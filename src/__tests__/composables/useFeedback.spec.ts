import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import {
  useFeedback,
  getFeedbackLevel,
  FEEDBACK_LABELS,
} from '../../composables/useFeedback'

describe('useFeedback', () => {
  describe('getFeedbackLevel', () => {
    it('should return perfect for 100%', () => {
      expect(getFeedbackLevel(100)).toBe('perfect')
    })

    it('should return excellent for >= 80% and < 100%', () => {
      expect(getFeedbackLevel(80)).toBe('excellent')
      expect(getFeedbackLevel(85)).toBe('excellent')
      expect(getFeedbackLevel(99)).toBe('excellent')
    })

    it('should return good for >= 60% and < 80%', () => {
      expect(getFeedbackLevel(79)).toBe('good')
      expect(getFeedbackLevel(60)).toBe('good')
      expect(getFeedbackLevel(70)).toBe('good')
    })

    it('should return average for >= 40% and < 60%', () => {
      expect(getFeedbackLevel(59)).toBe('average')
      expect(getFeedbackLevel(40)).toBe('average')
      expect(getFeedbackLevel(50)).toBe('average')
    })

    it('should return poor for < 40%', () => {
      expect(getFeedbackLevel(39)).toBe('poor')
      expect(getFeedbackLevel(0)).toBe('poor')
      expect(getFeedbackLevel(10)).toBe('poor')
    })
  })

  describe('useFeedback with ref', () => {
    it('should expose the perfect level and label for 100%', () => {
      const percentage = ref(100)
      const { level, label } = useFeedback(percentage)
      expect(level.value).toBe('perfect')
      expect(label.value).toBe(FEEDBACK_LABELS.perfect)
    })

    it('should expose the good level and label for 70%', () => {
      const percentage = ref(70)
      const { level, label } = useFeedback(percentage)
      expect(level.value).toBe('good')
      expect(label.value).toBe(FEEDBACK_LABELS.good)
    })

    it('should be reactive to percentage changes', () => {
      const percentage = ref(40)
      const { level, label } = useFeedback(percentage)

      expect(level.value).toBe('average')
      expect(label.value).toBe(FEEDBACK_LABELS.average)

      percentage.value = 70
      expect(level.value).toBe('good')
      expect(label.value).toBe(FEEDBACK_LABELS.good)
    })
  })
})
