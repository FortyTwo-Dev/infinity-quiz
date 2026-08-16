import { describe, it, expect } from 'vitest'
import {
  shuffle,
  randomElement,
  randomElements,
  arraysEqual,
  unique,
  flatten,
  groupBy,
  partition,
} from '../../utils/array-utils'

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

  describe('randomElement', () => {
    it('should return undefined for empty array', () => {
      expect(randomElement([])).toBeUndefined()
    })

    it('should return the only element for single element array', () => {
      expect(randomElement([42])).toBe(42)
    })

    it('should return an element from the array', () => {
      const arr = [1, 2, 3, 4, 5]
      const element = randomElement(arr)
      expect(arr).toContain(element)
    })

    it('should return same element with same UUID seed', () => {
      const arr = [1, 2, 3, 4, 5]
      const uuidSeed = 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa'
      const element1 = randomElement(arr, uuidSeed)
      const element2 = randomElement(arr, uuidSeed)
      expect(element1).toBe(element2)
    })

    it('should return element from array when using UUID seed', () => {
      const arr = [1, 2, 3, 4, 5]
      const element = randomElement(arr, 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa')
      expect(arr).toContain(element)
    })
  })

  describe('randomElements', () => {
    it('should return empty array when count is 0', () => {
      expect(randomElements([1, 2, 3], 0)).toEqual([])
    })

    it('should return all elements when count >= array length', () => {
      const arr = [1, 2, 3]
      const result = randomElements(arr, 10)
      expect(result).toHaveLength(3)
      expect(result.sort()).toEqual(arr.sort())
    })

    it('should return specified number of elements', () => {
      const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      const result = randomElements(arr, 3)
      expect(result).toHaveLength(3)
      result.forEach((el) => expect(arr).toContain(el))
    })

    it('should return unique elements', () => {
      const arr = [1, 2, 3, 4, 5]
      const result = randomElements(arr, 3)
      const uniqueResult = unique(result)
      expect(uniqueResult).toHaveLength(result.length)
    })

    it('should return empty array for empty input', () => {
      expect(randomElements([], 5)).toEqual([])
    })

    it('should return empty array for negative count', () => {
      expect(randomElements([1, 2, 3], -1)).toEqual([])
    })

    it('should produce deterministic result with UUID seed', () => {
      const arr = [1, 2, 3, 4, 5]
      const uuidSeed = 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa'
      const result1 = randomElements(arr, 3, uuidSeed)
      const result2 = randomElements(arr, 3, uuidSeed)
      expect(result1).toEqual(result2)
    })

    it('should return correct number of elements with UUID seed', () => {
      const arr = [1, 2, 3, 4, 5]
      const result = randomElements(arr, 3, 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa')
      expect(result).toHaveLength(3)
      result.forEach((el) => expect(arr).toContain(el))
    })
  })

  describe('arraysEqual', () => {
    it('should return true for equal arrays', () => {
      expect(arraysEqual([1, 2, 3], [1, 2, 3])).toBe(true)
    })

    it('should return false for arrays with different lengths', () => {
      expect(arraysEqual([1, 2, 3], [1, 2])).toBe(false)
    })

    it('should return false for arrays with same length but different elements', () => {
      expect(arraysEqual([1, 2, 3], [1, 2, 4])).toBe(false)
    })

    it('should return true for empty arrays', () => {
      expect(arraysEqual([], [])).toBe(true)
    })

    it('should work with reference types', () => {
      const obj1 = { a: 1 }
      const obj2 = { a: 1 }
      expect(arraysEqual([obj1], [obj1])).toBe(true)
      expect(arraysEqual([obj1], [obj2])).toBe(false) // shallow comparison
    })
  })

  describe('unique', () => {
    it('should remove duplicates', () => {
      expect(unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3])
    })

    it('should return empty array for empty input', () => {
      expect(unique([])).toEqual([])
    })

    it('should return same array when no duplicates', () => {
      expect(unique([1, 2, 3])).toEqual([1, 2, 3])
    })

    it('should preserve order', () => {
      expect(unique([3, 2, 2, 1, 3])).toEqual([3, 2, 1])
    })
  })

  describe('flatten', () => {
    it('should flatten nested arrays', () => {
      expect(
        flatten([
          [1, 2],
          [3, 4],
        ]),
      ).toEqual([1, 2, 3, 4])
    })

    it('should handle empty arrays', () => {
      expect(flatten([])).toEqual([])
      expect(flatten([[], []])).toEqual([])
    })

    it('should handle mixed nested and flat', () => {
      expect(flatten([1, [2, 3], 4])).toEqual([1, 2, 3, 4])
    })

    it('should handle deep nesting (only one level)', () => {
      // Note: flatten uses .flat() which only flattens one level
      expect(flatten([[1, [2, [3]]]])).toEqual([1, [2, [3]]])
    })
  })

  describe('groupBy', () => {
    it('should group elements by key', () => {
      const arr = [
        { category: 'A', value: 1 },
        { category: 'B', value: 2 },
        { category: 'A', value: 3 },
      ]
      const result = groupBy(arr, (item) => item.category)
      expect(result.A).toHaveLength(2)
      expect(result.B).toHaveLength(1)
      expect(result.A).toContainEqual({ category: 'A', value: 1 })
      expect(result.A).toContainEqual({ category: 'A', value: 3 })
    })

    it('should return empty object for empty array', () => {
      expect(groupBy([], (item) => item.id)).toEqual({})
    })

    it('should work with number keys', () => {
      const arr = [
        { group: 1, value: 'a' },
        { group: 2, value: 'b' },
        { group: 1, value: 'c' },
      ]
      const result = groupBy(arr, (item) => item.group)
      expect(result[1]).toHaveLength(2)
      expect(result[2]).toHaveLength(1)
    })
  })

  describe('partition', () => {
    it('should partition elements based on predicate', () => {
      const arr = [1, 2, 3, 4, 5, 6]
      const [evens, odds] = partition(arr, (n) => n % 2 === 0)
      expect(evens).toEqual([2, 4, 6])
      expect(odds).toEqual([1, 3, 5])
    })

    it('should return empty arrays when all match', () => {
      const arr = [2, 4, 6]
      const [evens, odds] = partition(arr, (n) => n % 2 === 0)
      expect(evens).toEqual([2, 4, 6])
      expect(odds).toEqual([])
    })

    it('should return empty arrays when none match', () => {
      const arr = [1, 3, 5]
      const [evens, odds] = partition(arr, (n) => n % 2 === 0)
      expect(evens).toEqual([])
      expect(odds).toEqual([1, 3, 5])
    })

    it('should return empty arrays for empty input', () => {
      const [truthy, falsy] = partition([], (n) => n > 0)
      expect(truthy).toEqual([])
      expect(falsy).toEqual([])
    })
  })
})
