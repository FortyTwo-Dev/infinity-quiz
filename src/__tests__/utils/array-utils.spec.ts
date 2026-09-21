import { describe, it, expect } from 'vitest'
import { shuffle } from '../../utils/array-utils'

describe('array-utils', () => {
  describe('shuffle', () => {
    it('should return a new array', () => {
      const original = [1, 2, 3]
      const shuffled = shuffle(original)
      expect(shuffled).not.toBe(original)
    })

    it('should not mutate the original array', () => {
      const original = [1, 2, 3]
      shuffle(original)
      expect(original).toEqual([1, 2, 3])
    })

    it('should contain all elements of the original array', () => {
      const original = [1, 2, 3, 4, 5]
      const shuffled = shuffle(original)
      expect(shuffled).toHaveLength(original.length)
      expect(shuffled.sort()).toEqual(original.sort())
    })

    it('should return empty array for empty input', () => {
      expect(shuffle([])).toEqual([])
    })

    it('should work with single element', () => {
      expect(shuffle([1])).toEqual([1])
    })

    it('should produce deterministic result with UUID seed', () => {
      const original = [1, 2, 3, 4, 5]
      const uuidSeed = 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa'
      const result1 = shuffle(original, uuidSeed)
      const result2 = shuffle(original, uuidSeed)
      expect(result1).toEqual(result2)
    })

    it('should produce different result with different UUID seed', () => {
      const original = [1, 2, 3, 4, 5]
      const result1 = shuffle(original, 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa')
      const result2 = shuffle(original, 'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb')
      expect(result1).not.toEqual(result2)
    })

    it('should preserve all elements when using UUID seed', () => {
      const original = [1, 2, 3, 4, 5]
      const result = shuffle(original, 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa')
      expect(result.sort()).toEqual(original.sort())
    })

    it('should not mutate original array when using UUID seed', () => {
      const original = [1, 2, 3]
      const originalCopy = [...original]
      shuffle(original, 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa')
      expect(original).toEqual(originalCopy)
    })

    it('should work with numeric seed', () => {
      const original = [1, 2, 3]
      const result1 = shuffle(original, 12345)
      const result2 = shuffle(original, 12345)
      expect(result1).toEqual(result2)
    })
  })
})
