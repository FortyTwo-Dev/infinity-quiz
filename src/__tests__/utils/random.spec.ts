import { describe, it, expect } from 'vitest'
import {
  createRandom,
  seededShuffle,
  indexedSeededShuffle,
} from '../../utils/random'

describe('random utilities', () => {
  describe('createRandom', () => {
    it('should produce same sequence with same UUID seed', () => {
      const uuidSeed = 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa'
      const random1 = createRandom(uuidSeed)
      const random2 = createRandom(uuidSeed)

      expect(random1()).toBe(random2())
      expect(random1()).toBe(random2())
      expect(random1()).toBe(random2())
    })

    it('should produce same sequence with same numeric seed', () => {
      const random1 = createRandom(12345)
      const random2 = createRandom(12345)

      expect(random1()).toBe(random2())
      expect(random1()).toBe(random2())
    })

    it('should produce different sequences with different UUID seeds', () => {
      const uuidSeed1 = 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa'
      const uuidSeed2 = 'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb'
      const random1 = createRandom(uuidSeed1)
      const random2 = createRandom(uuidSeed2)

      expect(random1()).not.toBe(random2())
    })

    it('should return numbers between 0 and 1', () => {
      const random = createRandom('aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa')

      for (let i = 0; i < 100; i++) {
        const value = random()
        expect(value).toBeGreaterThanOrEqual(0)
        expect(value).toBeLessThan(1)
      }
    })
  })

  describe('seededShuffle', () => {
    it('should produce same result with same UUID seed', () => {
      const arr = [1, 2, 3, 4, 5]
      const uuidSeed = 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa'
      const result1 = seededShuffle(arr, uuidSeed)
      const result2 = seededShuffle(arr, uuidSeed)

      expect(result1).toEqual(result2)
    })

    it('should produce different result with different UUID seed', () => {
      const arr = [1, 2, 3, 4, 5]
      const result1 = seededShuffle(arr, 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa')
      const result2 = seededShuffle(arr, 'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb')

      expect(result1).not.toEqual(result2)
    })

    it('should preserve all elements', () => {
      const arr = [1, 2, 3, 4, 5]
      const result = seededShuffle(arr, 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa')

      expect(result.sort()).toEqual(arr.sort())
    })

    it('should not mutate original array', () => {
      const arr = [1, 2, 3, 4, 5]
      const original = [...arr]

      seededShuffle(arr, 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa')

      expect(arr).toEqual(original)
    })

    it('should handle empty array', () => {
      const result = seededShuffle([], 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa')

      expect(result).toEqual([])
    })

    it('should handle single element array', () => {
      const result = seededShuffle([42], 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa')

      expect(result).toEqual([42])
    })

    it('should work with numeric seed', () => {
      const arr = [1, 2, 3]
      const result1 = seededShuffle(arr, 12345)
      const result2 = seededShuffle(arr, 12345)

      expect(result1).toEqual(result2)
    })
  })

  describe('indexedSeededShuffle', () => {
    it('should produce different shuffles for different indices with same base UUID seed', () => {
      const arr = [1, 2, 3, 4, 5]
      const baseSeed = 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa'
      const result1 = indexedSeededShuffle(arr, baseSeed, 0)
      const result2 = indexedSeededShuffle(arr, baseSeed, 1)

      expect(result1).not.toEqual(result2)
    })

    it('should produce same shuffle for same base UUID seed and index', () => {
      const arr = [1, 2, 3, 4, 5]
      const baseSeed = 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa'
      const result1 = indexedSeededShuffle(arr, baseSeed, 0)
      const result2 = indexedSeededShuffle(arr, baseSeed, 0)

      expect(result1).toEqual(result2)
    })

    it('should preserve all elements', () => {
      const arr = [1, 2, 3, 4, 5]
      const result = indexedSeededShuffle(arr, 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa', 0)

      expect(result.sort()).toEqual(arr.sort())
    })

    it('should not mutate original array', () => {
      const arr = [1, 2, 3, 4, 5]
      const original = [...arr]

      indexedSeededShuffle(arr, 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa', 0)

      expect(arr).toEqual(original)
    })
  })
})
