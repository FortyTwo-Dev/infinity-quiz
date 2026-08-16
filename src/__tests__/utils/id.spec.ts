import { describe, it, expect } from 'vitest'
import { generateId, generateSeed } from '../../utils/id'

describe('id utilities', () => {
  describe('generateId', () => {
    it('should generate a valid UUID v4 string', () => {
      const id = generateId()

      // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
      // where x is any hex digit and y is 8, 9, A, or B
      const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

      expect(id).toMatch(uuidV4Regex)
    })

    it('should generate unique IDs on each call', () => {
      const id1 = generateId()
      const id2 = generateId()

      expect(id1).not.toBe(id2)
    })

    it('should generate string of correct length', () => {
      const id = generateId()

      // UUID v4 is 36 characters (32 hex + 4 hyphens)
      expect(id).toHaveLength(36)
    })
  })

  describe('generateSeed', () => {
    it('should generate a UUID v4 string seed', () => {
      const seed = generateSeed()

      expect(typeof seed).toBe('string')
      expect(seed).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
    })

    it('should generate seeds of correct length', () => {
      for (let i = 0; i < 100; i++) {
        const seed = generateSeed()
        expect(seed).toHaveLength(36)
      }
    })
  })
})
