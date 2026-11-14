import { describe, it, expect, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { useThemeStore } from '../../stores/theme-store'
import { setupTestPinia, installTestPinia } from './setup'

describe('useThemeStore', () => {
  beforeEach(() => {
    setupTestPinia()
  })

  describe('applyTheme', () => {
    it('updates the global theme name', () => {
      const store = useThemeStore()
      store.applyTheme('infinity-yellow-dark')

      expect(store.globalThemeName).toBe('infinity-yellow-dark')
    })

    it('writes the theme on the document element', () => {
      const store = useThemeStore()
      store.applyTheme('infinity-red-dark')

      expect(document.documentElement.dataset.theme).toBe('infinity-red-dark')
    })
  })

  describe('applyQuizTheme / restoreGlobalTheme', () => {
    it('applies the default theme when the quiz has no theme', () => {
      const store = useThemeStore()
      store.applyTheme('infinity-red-light')

      store.applyQuizTheme(undefined)

      expect(store.temporaryThemeName).toBe('infinity-blue-light')
      expect(store.globalThemeName).toBe('infinity-red-light')
    })

    it('applies a built-in quiz theme without touching the global theme', () => {
      const store = useThemeStore()
      store.applyTheme('infinity-blue-light')

      store.applyQuizTheme('infinity-red-dark')

      expect(store.temporaryThemeName).toBe('infinity-red-dark')
      expect(store.globalThemeName).toBe('infinity-blue-light')
      expect(document.documentElement.dataset.theme).toBe('infinity-red-dark')
    })

    it('falls back to the default for an unknown theme name', () => {
      const store = useThemeStore()
      store.applyQuizTheme('does-not-exist')

      expect(store.temporaryThemeName).toBe('infinity-blue-light')
    })

    it('restores the global theme', () => {
      const store = useThemeStore()
      store.applyTheme('infinity-red-light')
      store.applyQuizTheme('infinity-yellow-dark')

      store.restoreGlobalTheme()

      expect(store.temporaryThemeName).toBeNull()
      expect(document.documentElement.dataset.theme).toBe('infinity-red-light')
    })
  })

  describe('persistence', () => {
    it('keeps the global theme across a simulated reload', async () => {
      const store = useThemeStore()
      store.applyTheme('infinity-yellow-light')
      await nextTick()

      installTestPinia()
      const fresh = useThemeStore()

      expect(fresh.globalThemeName).toBe('infinity-yellow-light')
    })
  })
})
