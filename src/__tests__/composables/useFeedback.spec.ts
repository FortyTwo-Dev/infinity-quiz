import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { useFeedback, getFeedbackLevel, getFeedback, FEEDBACK_MESSAGES } from '../../composables/useFeedback'

describe('useFeedback', () => {
  describe('getFeedbackLevel', () => {
    it('should return excellent for >= 80%', () => {
      expect(getFeedbackLevel(100)).toBe('excellent')
      expect(getFeedbackLevel(80)).toBe('excellent')
      expect(getFeedbackLevel(85)).toBe('excellent')
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

  describe('getFeedback', () => {
    it('should return excellent feedback for >= 80%', () => {
      const feedback = getFeedback(80)
      expect(feedback).toEqual(FEEDBACK_MESSAGES.excellent)
    })

    it('should return good feedback for >= 60% and < 80%', () => {
      const feedback = getFeedback(60)
      expect(feedback).toEqual(FEEDBACK_MESSAGES.good)
    })

    it('should return average feedback for >= 40% and < 60%', () => {
      const feedback = getFeedback(40)
      expect(feedback).toEqual(FEEDBACK_MESSAGES.average)
    })

    it('should return poor feedback for < 40%', () => {
      const feedback = getFeedback(0)
      expect(feedback).toEqual(FEEDBACK_MESSAGES.poor)
    })
  })

  describe('useFeedback with ref', () => {
    it('should return excellent feedback when percentage is 100', () => {
      const percentage = ref(100)
      const { feedback, level } = useFeedback(percentage)
      expect(level.value).toBe('excellent')
      expect(feedback.value).toEqual(FEEDBACK_MESSAGES.excellent)
    })

    it('should return good feedback when percentage is 70', () => {
      const percentage = ref(70)
      const { feedback, level } = useFeedback(percentage)
      expect(level.value).toBe('good')
      expect(feedback.value).toEqual(FEEDBACK_MESSAGES.good)
    })

    it('should be reactive to percentage changes', () => {
      const percentage = ref(40)
      const { level } = useFeedback(percentage)

      expect(level.value).toBe('average')
      percentage.value = 70
      expect(level.value).toBe('good')
    })

    it('isPositive should return true for excellent', () => {
      const percentage = ref(100)
      const { isPositive } = useFeedback(percentage)
      expect(isPositive.value).toBe(true)
    })

    it('isPositive should return true for good', () => {
      const percentage = ref(70)
      const { isPositive } = useFeedback(percentage)
      expect(isPositive.value).toBe(true)
    })

    it('isPositive should return false for average', () => {
      const percentage = ref(40)
      const { isPositive } = useFeedback(percentage)
      expect(isPositive.value).toBe(false)
    })

    it('isPositive should return false for poor', () => {
      const percentage = ref(20)
      const { isPositive } = useFeedback(percentage)
      expect(isPositive.value).toBe(false)
    })
  })
})
