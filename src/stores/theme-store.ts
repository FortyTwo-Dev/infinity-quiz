import { defineStore } from 'pinia'
import { ref } from 'vue'
import { BUILT_IN_THEMES, DEFAULT_THEME_NAME } from '../constants/themes'
import { STORAGE_KEYS } from '../constants'

function writeDomTheme(name: string) {
  if (typeof document === 'undefined') return
  document.documentElement.dataset.theme = name
}

export const useThemeStore = defineStore(
  'theme',
  () => {
    const globalThemeName = ref<string>(DEFAULT_THEME_NAME)
    const temporaryThemeName = ref<string | null>(null)

    function applyTheme(name: string) {
      globalThemeName.value = name
      writeDomTheme(name)
    }

    function resolveTheme(name: string | undefined): string | null {
      if (!name) return null
      return BUILT_IN_THEMES.includes(name) ? name : null
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

    function rehydrate() {
      writeDomTheme(globalThemeName.value)
    }

    return {
      globalThemeName,
      temporaryThemeName,
      applyTheme,
      applyQuizTheme,
      restoreGlobalTheme,
      rehydrate,
    }
  },
  {
    persist: {
      key: STORAGE_KEYS.theme,
      pick: ['globalThemeName'],
    },
  },
)
