import { describe, it, expect, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { useAccessibilityStore } from '../../stores/accessibility-store'
import { setupTestPinia, installTestPinia, readStorage } from './setup'
import { STORAGE_KEYS } from '../../constants'

const FONT_ATTRIBUTE = 'data-font'
const DYSLEXIC = 'dyslexic'

function rootFontAttribute() {
  return document.documentElement.getAttribute(FONT_ATTRIBUTE)
}

function persistedPayload() {
  return JSON.parse(readStorage(STORAGE_KEYS.accessibility) ?? '{}')
}

/** Stored payloads that must not enable the font. */
const INVALID_PAYLOADS = [
  { label: 'a JSON string', raw: JSON.stringify('yes') },
  { label: 'a non-boolean flag', raw: JSON.stringify({ isDyslexicFontEnabled: 'yes' }) },
  { label: 'an empty object', raw: JSON.stringify({}) },
  { label: 'null', raw: JSON.stringify(null) },
]

describe('useAccessibilityStore', () => {
  beforeEach(() => {
    setupTestPinia()
    delete document.documentElement.dataset.font
  })

  it('starts with the reading font disabled', () => {
    const store = useAccessibilityStore()

    expect(store.isDyslexicFontEnabled).toBe(false)
    expect(rootFontAttribute()).toBeNull()
  })

  it('enables the font and persists the preference', async () => {
    const store = useAccessibilityStore()

    store.setDyslexicFontEnabled(true)

    expect(store.isDyslexicFontEnabled).toBe(true)
    expect(document.documentElement.dataset.font).toBe(DYSLEXIC)

    await nextTick()
    expect(persistedPayload()).toEqual({ isDyslexicFontEnabled: true })
  })

  it('disables the font and persists the preference', async () => {
    const store = useAccessibilityStore()
    store.setDyslexicFontEnabled(true)

    store.setDyslexicFontEnabled(false)

    expect(store.isDyslexicFontEnabled).toBe(false)
    expect(rootFontAttribute()).toBeNull()

    await nextTick()
    expect(persistedPayload()).toEqual({ isDyslexicFontEnabled: false })
  })

  describe('rehydrate', () => {
    it('applies a stored enabled preference', () => {
      localStorage.setItem(
        STORAGE_KEYS.accessibility,
        JSON.stringify({ isDyslexicFontEnabled: true }),
      )
      installTestPinia()

      const store = useAccessibilityStore()
      store.rehydrate()

      expect(store.isDyslexicFontEnabled).toBe(true)
      expect(document.documentElement.dataset.font).toBe(DYSLEXIC)
    })

    it.each(INVALID_PAYLOADS)('falls back to disabled on $label', ({ raw }) => {
      localStorage.setItem(STORAGE_KEYS.accessibility, raw)
      installTestPinia()

      const store = useAccessibilityStore()
      document.documentElement.dataset.font = DYSLEXIC
      store.rehydrate()

      expect(store.isDyslexicFontEnabled).toBe(false)
      expect(rootFontAttribute()).toBeNull()
    })

    it('falls back to disabled when nothing was stored', () => {
      const store = useAccessibilityStore()
      document.documentElement.dataset.font = DYSLEXIC

      store.rehydrate()

      expect(store.isDyslexicFontEnabled).toBe(false)
      expect(rootFontAttribute()).toBeNull()
    })
  })
})
