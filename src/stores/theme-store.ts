import { defineStore } from 'pinia'
import { ref } from 'vue'
import { parseThemeBlock, buildThemeCss } from '../utils/theme-import'
import { BUILT_IN_THEMES, DEFAULT_THEME_NAME, isValidThemeName } from '../constants/themes'
import { STORAGE_KEYS } from '../constants'

export interface ImportedTheme {
  name: string
  colorScheme: 'light' | 'dark'
  raw: string
}

const STYLE_PREFIX = 'iq-imported-theme-'

export const useThemeStore = defineStore(
  'theme',
  () => {
    const globalThemeName = ref<string>(DEFAULT_THEME_NAME)
    const importedThemes = ref<ImportedTheme[]>([])
    const temporaryThemeName = ref<string | null>(null)

    function writeDomTheme(name: string) {
      if (typeof document === 'undefined') return
      document.documentElement.dataset.theme = name
    }

    function applyTheme(name: string) {
      globalThemeName.value = name
      writeDomTheme(name)
    }

    function resolveTheme(name: string | undefined): string | null {
      if (!name) return null
      if (
        BUILT_IN_THEMES.includes(name) ||
        importedThemes.value.some((t) => t.name === name)
      ) {
        return name
      }
      return null
    }

    function applyQuizTheme(name: string | undefined) {
      const resolved = resolveTheme(name) ?? DEFAULT_THEME_NAME
      temporaryThemeName.value = resolved
      writeDomTheme(resolved)
    }

    function restoreGlobalTheme() {
      temporaryThemeName.value = null
      writeDomTheme(globalThemeName.value)
    }

    function injectThemeStyle(theme: ImportedTheme) {
      if (typeof document === 'undefined') return
      const styleId = `${STYLE_PREFIX}${theme.name}`
      document.getElementById(styleId)?.remove()

      const style = document.createElement('style')
      style.id = styleId
      style.setAttribute('data-theme', theme.name)
      style.textContent = buildThemeCss({
        name: theme.name,
        colorScheme: theme.colorScheme,
        variables: parseThemeBlock(theme.raw).variables,
      })
      document.head.appendChild(style)
    }

    function isNameTaken(name: string): boolean {
      return BUILT_IN_THEMES.includes(name) || importedThemes.value.some((t) => t.name === name)
    }

    function importTheme(css: string, nameOverride?: string): boolean {
      const parsed = parseThemeBlock(css)
      const name = (nameOverride ?? parsed.name).trim()
      if (!name || !isValidThemeName(name)) {
        throw new Error('Theme name is invalid (letters, digits, "-", "_" only)')
      }
      if (isNameTaken(name)) {
        throw new Error(`A theme named "${name}" already exists`)
      }

      const theme: ImportedTheme = {
        name,
        colorScheme: parsed.colorScheme,
        raw: css,
      }
      importedThemes.value.push(theme)
      injectThemeStyle(theme)
      applyTheme(name)
      return true
    }

    function removeTheme(name: string) {
      importedThemes.value = importedThemes.value.filter((t) => t.name !== name)
      if (typeof document !== 'undefined') {
        document.getElementById(`${STYLE_PREFIX}${name}`)?.remove()
      }
      if (globalThemeName.value === name) {
        applyTheme(DEFAULT_THEME_NAME)
      }
    }

    function rehydrate() {
      for (const theme of importedThemes.value) {
        injectThemeStyle(theme)
      }
      writeDomTheme(globalThemeName.value)
    }

    return {
      globalThemeName,
      importedThemes,
      temporaryThemeName,
      applyTheme,
      applyQuizTheme,
      restoreGlobalTheme,
      importTheme,
      removeTheme,
      rehydrate,
    }
  },
  {
    persist: {
      key: STORAGE_KEYS.theme,
      pick: ['globalThemeName', 'importedThemes'],
    },
  },
)
