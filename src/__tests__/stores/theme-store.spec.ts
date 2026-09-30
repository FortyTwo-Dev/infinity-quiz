import { describe, it, expect, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { useThemeStore } from '../../stores/theme-store'
import { setupTestPinia, installTestPinia, readStorage } from './setup'

const VALID_BLOCK = `@plugin "daisyui/theme" {
  name: "mytheme";
  color-scheme: "dark";
  --color-base-100: oklch(14% 0.005 285.823);
  --color-primary: oklch(59% 0.24 277);
}`

describe('useThemeStore', () => {
  beforeEach(() => {
    setupTestPinia()
  })

  describe('importTheme', () => {
    it('imports a valid theme, applies it and persists it', async () => {
      const store = useThemeStore()
      store.importTheme(VALID_BLOCK)
      await nextTick()

      expect(store.importedThemes).toHaveLength(1)
      expect(store.importedThemes[0]?.name).toBe('mytheme')
      expect(store.globalThemeName).toBe('mytheme')
      expect(store.importedThemes[0]?.raw).toBe(VALID_BLOCK)

      const persisted = JSON.parse(readStorage('infinity-quiz-theme') ?? '{}')
      expect(persisted.importedThemes[0].name).toBe('mytheme')
      expect(persisted.globalThemeName).toBe('mytheme')
    })

    it('uses the name override', () => {
      const store = useThemeStore()
      store.importTheme(VALID_BLOCK, 'renamed-theme')

      expect(store.importedThemes[0]?.name).toBe('renamed-theme')
    })

    it('rejects duplicate names (imported or built-in)', () => {
      const store = useThemeStore()
      store.importTheme(VALID_BLOCK)

      expect(() => store.importTheme(VALID_BLOCK)).toThrow('already exists')
      expect(() => store.importTheme(VALID_BLOCK, 'infinity-blue-light')).toThrow('already exists')
    })

    it('rejects an empty or invalid name override', () => {
      const store = useThemeStore()
      expect(() => store.importTheme(VALID_BLOCK, '')).toThrow('Theme name is invalid')
      expect(() => store.importTheme(VALID_BLOCK, 'bad name')).toThrow('Theme name is invalid')
    })

    it('does not add the theme when parsing fails', () => {
      const store = useThemeStore()
      expect(() => store.importTheme('@plugin "daisyui/theme" { }')).toThrow('Theme name is missing')
      expect(store.importedThemes).toHaveLength(0)
    })
  })

  describe('removeTheme', () => {
    it('removes the theme and falls back to the default when active', () => {
      const store = useThemeStore()
      store.importTheme(VALID_BLOCK)

      store.removeTheme('mytheme')

      expect(store.importedThemes).toHaveLength(0)
      expect(store.globalThemeName).toBe('infinity-blue-light')
    })

    it('keeps the current global theme when removing a non-active theme', () => {
      const store = useThemeStore()
      store.importTheme(VALID_BLOCK)
      store.applyTheme('infinity-red-light')

      store.removeTheme('mytheme')

      expect(store.globalThemeName).toBe('infinity-red-light')
    })
  })

  describe('applyTheme', () => {
    it('updates the global theme name', () => {
      const store = useThemeStore()
      store.applyTheme('infinity-yellow-dark')

      expect(store.globalThemeName).toBe('infinity-yellow-dark')
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
    })

    it('falls back to the default for an unknown theme name', () => {
      const store = useThemeStore()
      store.applyQuizTheme('does-not-exist')

      expect(store.temporaryThemeName).toBe('infinity-blue-light')
    })

    it('applies an imported theme when it exists', () => {
      const store = useThemeStore()
      store.importTheme(VALID_BLOCK)

      store.applyQuizTheme('mytheme')

      expect(store.temporaryThemeName).toBe('mytheme')
    })

    it('restores the global theme', () => {
      const store = useThemeStore()
      store.applyTheme('infinity-red-light')
      store.applyQuizTheme('infinity-yellow-dark')

      store.restoreGlobalTheme()

      expect(store.temporaryThemeName).toBeNull()
    })
  })

  describe('persistence', () => {
    it('rehydrates imported themes after a simulated reload', async () => {
      const store = useThemeStore()
      store.importTheme(VALID_BLOCK)
      await nextTick()

      installTestPinia()
      const fresh = useThemeStore()

      expect(fresh.importedThemes).toHaveLength(1)
      expect(fresh.importedThemes[0]?.name).toBe('mytheme')
      expect(fresh.globalThemeName).toBe('mytheme')
    })
  })
})
