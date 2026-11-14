import { describe, it, expect, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { useThemeStore } from '../../stores/theme-store'
import { setupTestPinia, installTestPinia, readStorage } from './setup'
import { STORAGE_KEYS } from '../../constants'

function rootTheme() {
  return {
    mode: document.documentElement.dataset.theme,
    accent: document.documentElement.dataset.accent,
  }
}

describe('useThemeStore', () => {
  beforeEach(() => {
    setupTestPinia()
    delete document.documentElement.dataset.theme
    delete document.documentElement.dataset.accent
  })

  describe('applyTheme', () => {
    it('writes both attributes on the document element', () => {
      const store = useThemeStore()
      store.applyTheme({ mode: 'dark', accent: 'fresh' })

      expect(store.globalTheme).toEqual({ mode: 'dark', accent: 'fresh' })
      expect(rootTheme()).toEqual({ mode: 'dark', accent: 'fresh' })
    })

    it('persists the pair under the theme storage key', async () => {
      const store = useThemeStore()
      store.applyTheme({ mode: 'dark', accent: 'emerald' })
      await nextTick()

      expect(JSON.parse(readStorage(STORAGE_KEYS.theme) ?? '{}')).toEqual({
        globalTheme: { mode: 'dark', accent: 'emerald' },
      })
    })
  })

  describe('applyQuizTheme / restoreGlobalTheme', () => {
    it('keeps the global theme when the quiz carries no theme', () => {
      const store = useThemeStore()
      store.applyTheme({ mode: 'dark', accent: 'emerald' })

      store.applyQuizTheme(undefined)

      expect(store.temporaryTheme).toBeNull()
      expect(store.globalTheme).toEqual({ mode: 'dark', accent: 'emerald' })
      expect(rootTheme()).toEqual({ mode: 'dark', accent: 'emerald' })
    })

    it('changes both attributes without touching the global theme', () => {
      const store = useThemeStore()
      store.applyTheme({ mode: 'light', accent: 'emerald' })

      store.applyQuizTheme({ mode: 'dark', accent: 'mint' })

      expect(store.temporaryTheme).toEqual({ mode: 'dark', accent: 'mint' })
      expect(store.globalTheme).toEqual({ mode: 'light', accent: 'emerald' })
      expect(rootTheme()).toEqual({ mode: 'dark', accent: 'mint' })
    })

    it('accepts a legacy name left in an older quiz', () => {
      const store = useThemeStore()

      store.applyQuizTheme('infinity-yellow-dark')

      expect(store.temporaryTheme).toEqual({ mode: 'dark', accent: 'fresh' })
    })

    it('keeps the global theme for a quiz whose theme is unknown', () => {
      const store = useThemeStore()
      store.applyTheme({ mode: 'dark', accent: 'fresh' })

      store.applyQuizTheme('removed-theme')

      expect(store.temporaryTheme).toBeNull()
      expect(rootTheme()).toEqual({ mode: 'dark', accent: 'fresh' })
    })

    it('restores the global theme', () => {
      const store = useThemeStore()
      store.applyTheme({ mode: 'light', accent: 'emerald' })
      store.applyQuizTheme({ mode: 'dark', accent: 'fresh' })

      store.restoreGlobalTheme()

      expect(store.temporaryTheme).toBeNull()
      expect(rootTheme()).toEqual({ mode: 'light', accent: 'emerald' })
    })
  })

  describe('rehydrate', () => {
    it('writes the rehydrated theme on the document element', () => {
      const store = useThemeStore()
      store.applyTheme({ mode: 'dark', accent: 'fresh' })

      store.rehydrate()

      expect(rootTheme()).toEqual({ mode: 'dark', accent: 'fresh' })
    })

    it('normalizes an unsupported stored selection back to a valid one', () => {
      // A payload written by a build this one does not know.
      localStorage.setItem(
        STORAGE_KEYS.theme,
        JSON.stringify({ globalTheme: { mode: 'sepia', accent: 'violet' } }),
      )
      installTestPinia()

      const store = useThemeStore()
      store.rehydrate()

      expect(store.globalTheme).toEqual({ mode: 'light', accent: 'mint' })
      expect(rootTheme()).toEqual({ mode: 'light', accent: 'mint' })
    })
  })

  describe('persistence', () => {
    it('keeps the mode and accent across a simulated reload', async () => {
      const store = useThemeStore()
      store.applyTheme({ mode: 'dark', accent: 'fresh' })
      await nextTick()

      installTestPinia()
      const fresh = useThemeStore()

      expect(fresh.globalTheme).toEqual({ mode: 'dark', accent: 'fresh' })
    })
  })
})
