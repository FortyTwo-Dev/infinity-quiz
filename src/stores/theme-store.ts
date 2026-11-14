import { defineStore } from 'pinia'
import { ref } from 'vue'
import { DEFAULT_THEME, type ThemeSelection } from '../constants/themes'
import { STORAGE_KEYS } from '../constants'
import { normalizeGlobalTheme, normalizeQuizTheme } from '../utils/theme'

function writeDomTheme(selection: ThemeSelection) {
  if (typeof document === 'undefined') return
  document.documentElement.dataset.theme = selection.mode
  document.documentElement.dataset.accent = selection.accent
}

export const useThemeStore = defineStore(
  'theme',
  () => {
    const globalTheme = ref<ThemeSelection>({ ...DEFAULT_THEME })
    const temporaryTheme = ref<ThemeSelection | null>(null)

    function applyTheme(selection: ThemeSelection) {
      globalTheme.value = normalizeGlobalTheme(selection)
      writeDomTheme(globalTheme.value)
    }

    /**
     * Apply the theme of the quiz being played without touching the global
     * one. Anything the store cannot resolve plays the quiz with the default.
     */
    function applyQuizTheme(selection: unknown) {
      const resolved = normalizeQuizTheme(selection) ?? { ...DEFAULT_THEME }
      temporaryTheme.value = resolved
      writeDomTheme(resolved)
    }

    function restoreGlobalTheme() {
      temporaryTheme.value = null
      writeDomTheme(globalTheme.value)
    }

    /** Apply the rehydrated theme, normalized: storage is untrusted. */
    function rehydrate() {
      globalTheme.value = normalizeGlobalTheme(globalTheme.value)
      writeDomTheme(globalTheme.value)
    }

    return {
      globalTheme,
      temporaryTheme,
      applyTheme,
      applyQuizTheme,
      restoreGlobalTheme,
      rehydrate,
    }
  },
  {
    persist: {
      key: STORAGE_KEYS.theme,
      pick: ['globalTheme'],
    },
  },
)
