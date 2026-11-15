import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { useScore, getPercentage, isPassed } from '../../composables/useScore'

describe('getPercentage', () => {
  it('should return 0 when total is 0', () => {
    expect(getPercentage(0, 0)).toBe(0)
  })

  it('should return 0 when score is 0', () => {
    expect(getPercentage(0, 10)).toBe(0)
  })

  it('should return 50 when score is half of total', () => {
    expect(getPercentage(5, 10)).toBe(50)
  })

  it('should return 100 when score equals total', () => {
    expect(getPercentage(10, 10)).toBe(100)
  })

  it('should round the result', () => {
    expect(getPercentage(1, 3)).toBe(33)
    expect(getPercentage(2, 3)).toBe(67)
  })
})

describe('isPassed', () => {
  it('should return false when total is 0', () => {
    expect(isPassed(0, 0)).toBe(false)
  })

  it('should return true at exactly the pass threshold', () => {
    expect(isPassed(6, 10)).toBe(true)
  })

  it('should return false just below the pass threshold', () => {
    expect(isPassed(5, 10)).toBe(false)
  })

  it('should use the exact ratio, not the rounded percentage', () => {
    // 59.6% rounds to 60 but must not pass
    expect(getPercentage(56, 94)).toBe(60)
    expect(isPassed(56, 94)).toBe(false)
  })

  it('should return true when all answers are correct', () => {
    expect(isPassed(10, 10)).toBe(true)
  })
})

describe('useScore', () => {
  describe('percentage', () => {
    it('should return 0 when total is 0', () => {
      const { percentage } = useScore(0, 0)
      expect(percentage.value).toBe(0)
    })

    it('should return rounded value', () => {
      const { percentage } = useScore(3, 1)
      expect(percentage.value).toBe(33)
    })

    it('should be reactive to refs', () => {
      const { percentage } = useScore(ref(10), ref(5))
      expect(percentage.value).toBe(50)
    })
  })

  describe('passed', () => {
    it('should reflect the pass threshold', () => {
      const { passed } = useScore(10, 6)
      expect(passed.value).toBe(true)
    })

    it('should be false below the threshold', () => {
      const { passed } = useScore(10, 5)
      expect(passed.value).toBe(false)
    })
  })

  describe('formattedScore', () => {
    it('should return formatted string', () => {
      const { formattedScore } = useScore(10, 5)
      expect(formattedScore.value).toBe('5 / 10')
    })

    it('should handle 0 total', () => {
      const { formattedScore } = useScore(0, 0)
      expect(formattedScore.value).toBe('0 / 0')
    })
  })
})
