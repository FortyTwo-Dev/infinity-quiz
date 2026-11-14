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
      store.applyTheme({ mode: 'dark', accent: 'green' })

      expect(store.globalTheme).toEqual({ mode: 'dark', accent: 'green' })
      expect(rootTheme()).toEqual({ mode: 'dark', accent: 'green' })
    })

    it('persists the pair under the theme storage key', async () => {
      const store = useThemeStore()
      store.applyTheme({ mode: 'dark', accent: 'green' })
      await nextTick()

      expect(JSON.parse(readStorage(STORAGE_KEYS.theme) ?? '{}')).toEqual({
        globalTheme: { mode: 'dark', accent: 'green' },
      })
    })
  })

  describe('applyQuizTheme / restoreGlobalTheme', () => {
    it('keeps the global theme when the quiz carries no theme', () => {
      const store = useThemeStore()
      store.applyTheme({ mode: 'dark', accent: 'green' })

      store.applyQuizTheme(undefined)

      expect(store.temporaryTheme).toBeNull()
      expect(store.globalTheme).toEqual({ mode: 'dark', accent: 'green' })
      expect(rootTheme()).toEqual({ mode: 'dark', accent: 'green' })
    })

    it('changes both attributes without touching the global theme', () => {
      const store = useThemeStore()
      store.applyTheme({ mode: 'light', accent: 'green' })

      store.applyQuizTheme({ mode: 'dark', accent: 'green' })

      expect(store.temporaryTheme).toEqual({ mode: 'dark', accent: 'green' })
      expect(store.globalTheme).toEqual({ mode: 'light', accent: 'green' })
      expect(rootTheme()).toEqual({ mode: 'dark', accent: 'green' })
    })

    it('accepts a legacy name left in an older quiz', () => {
      const store = useThemeStore()

      store.applyQuizTheme('infinity-yellow-dark')

      expect(store.temporaryTheme).toEqual({ mode: 'dark', accent: 'green' })
    })

    it('keeps the global theme for a quiz whose theme is unknown', () => {
      const store = useThemeStore()
      store.applyTheme({ mode: 'dark', accent: 'green' })

      store.applyQuizTheme('removed-theme')

      expect(store.temporaryTheme).toBeNull()
      expect(rootTheme()).toEqual({ mode: 'dark', accent: 'green' })
    })

    it('restores the global theme', () => {
      const store = useThemeStore()
      store.applyTheme({ mode: 'light', accent: 'green' })
      store.applyQuizTheme({ mode: 'dark', accent: 'green' })

      store.restoreGlobalTheme()

      expect(store.temporaryTheme).toBeNull()
      expect(rootTheme()).toEqual({ mode: 'light', accent: 'green' })
    })
  })

  describe('rehydrate', () => {
    it('writes the rehydrated theme on the document element', () => {
      const store = useThemeStore()
      store.applyTheme({ mode: 'dark', accent: 'green' })

      store.rehydrate()

      expect(rootTheme()).toEqual({ mode: 'dark', accent: 'green' })
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

      expect(store.globalTheme).toEqual({ mode: 'light', accent: 'green' })
      expect(rootTheme()).toEqual({ mode: 'light', accent: 'green' })
    })
  })

  describe('persistence', () => {
    it('keeps the mode and accent across a simulated reload', async () => {
      const store = useThemeStore()
      store.applyTheme({ mode: 'dark', accent: 'green' })
      await nextTick()

      installTestPinia()
      const fresh = useThemeStore()

      expect(fresh.globalTheme).toEqual({ mode: 'dark', accent: 'green' })
    })
  })
})
