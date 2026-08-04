import { describe, it, expect } from 'vitest'
import { useScore } from '../../composables/useScore'

describe('useScore', () => {
  describe('percentage', () => {
    it('should return 0 when total is 0', () => {
      const { percentage } = useScore(0, 0)
      expect(percentage.value).toBe(0)
    })

    it('should return 0 when current is 0', () => {
      const { percentage } = useScore(10, 0)
      expect(percentage.value).toBe(0)
    })

    it('should return 50 when current is half of total', () => {
      const { percentage } = useScore(10, 5)
      expect(percentage.value).toBe(50)
    })

    it('should return 100 when current equals total', () => {
      const { percentage } = useScore(10, 10)
      expect(percentage.value).toBe(100)
    })

    it('should return rounded value', () => {
      const { percentage } = useScore(3, 1)
      expect(percentage.value).toBe(33)
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

  describe('letterGrade', () => {
    it('should return A+ for 90-100%', () => {
      const { letterGrade } = useScore(10, 10)
      expect(letterGrade.value).toBe('A+')
    })

    it('should return A for 85-89%', () => {
      const { letterGrade } = useScore(100, 85)
      expect(letterGrade.value).toBe('A')
    })

    it('should return A- for 80-84%', () => {
      const { letterGrade } = useScore(100, 80)
      expect(letterGrade.value).toBe('A-')
    })

    it('should return B+ for 75-79%', () => {
      const { letterGrade } = useScore(100, 75)
      expect(letterGrade.value).toBe('B+')
    })

    it('should return B for 70-74%', () => {
      const { letterGrade } = useScore(100, 70)
      expect(letterGrade.value).toBe('B')
    })

    it('should return B- for 65-69%', () => {
      const { letterGrade } = useScore(100, 65)
      expect(letterGrade.value).toBe('B-')
    })

    it('should return C+ for 60-64%', () => {
      const { letterGrade } = useScore(100, 60)
      expect(letterGrade.value).toBe('C+')
    })

    it('should return F for below 40%', () => {
      const { letterGrade } = useScore(100, 39)
      expect(letterGrade.value).toBe('F')
    })
  })
})
