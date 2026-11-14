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
      store.applyTheme({ mode: 'dark', accent: 'yellow' })

      expect(store.globalTheme).toEqual({ mode: 'dark', accent: 'yellow' })
      expect(rootTheme()).toEqual({ mode: 'dark', accent: 'yellow' })
    })

    it('persists the pair under the theme storage key', async () => {
      const store = useThemeStore()
      store.applyTheme({ mode: 'dark', accent: 'red' })
      await nextTick()

      expect(JSON.parse(readStorage(STORAGE_KEYS.theme) ?? '{}')).toEqual({
        globalTheme: { mode: 'dark', accent: 'red' },
      })
    })
  })

  describe('applyQuizTheme / restoreGlobalTheme', () => {
    it('applies the default theme when the quiz has no theme', () => {
      const store = useThemeStore()
      store.applyTheme({ mode: 'dark', accent: 'red' })

      store.applyQuizTheme(undefined)

      expect(store.temporaryTheme).toEqual({ mode: 'light', accent: 'blue' })
      expect(store.globalTheme).toEqual({ mode: 'dark', accent: 'red' })
    })

    it('changes both attributes without touching the global theme', () => {
      const store = useThemeStore()
      store.applyTheme({ mode: 'light', accent: 'red' })

      store.applyQuizTheme({ mode: 'dark', accent: 'blue' })

      expect(store.temporaryTheme).toEqual({ mode: 'dark', accent: 'blue' })
      expect(store.globalTheme).toEqual({ mode: 'light', accent: 'red' })
      expect(rootTheme()).toEqual({ mode: 'dark', accent: 'blue' })
    })

    it('accepts a legacy name left in an older quiz', () => {
      const store = useThemeStore()

      store.applyQuizTheme('infinity-yellow-dark')

      expect(store.temporaryTheme).toEqual({ mode: 'dark', accent: 'yellow' })
    })

    it('falls back to the default for an unknown theme', () => {
      const store = useThemeStore()

      store.applyQuizTheme('removed-theme')

      expect(store.temporaryTheme).toEqual({ mode: 'light', accent: 'blue' })
    })

    it('restores the global theme', () => {
      const store = useThemeStore()
      store.applyTheme({ mode: 'light', accent: 'red' })
      store.applyQuizTheme({ mode: 'dark', accent: 'yellow' })

      store.restoreGlobalTheme()

      expect(store.temporaryTheme).toBeNull()
      expect(rootTheme()).toEqual({ mode: 'light', accent: 'red' })
    })
  })

  describe('rehydrate', () => {
    it('writes the rehydrated theme on the document element', () => {
      const store = useThemeStore()
      store.applyTheme({ mode: 'dark', accent: 'yellow' })

      store.rehydrate()

      expect(rootTheme()).toEqual({ mode: 'dark', accent: 'yellow' })
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

      expect(store.globalTheme).toEqual({ mode: 'light', accent: 'blue' })
      expect(rootTheme()).toEqual({ mode: 'light', accent: 'blue' })
    })
  })

  describe('persistence', () => {
    it('keeps the mode and accent across a simulated reload', async () => {
      const store = useThemeStore()
      store.applyTheme({ mode: 'dark', accent: 'yellow' })
      await nextTick()

      installTestPinia()
      const fresh = useThemeStore()

      expect(fresh.globalTheme).toEqual({ mode: 'dark', accent: 'yellow' })
    })
  })
})
