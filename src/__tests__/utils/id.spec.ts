import { describe, it, expect } from 'vitest'
import { generateSeed } from '../../utils/id'

describe('id utilities', () => {
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
