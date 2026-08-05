import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { lightTheme, darkTheme } from '@/theme/themes'
import { generateThemeCSS } from '@/theme/utils/generate-css'
import type { ThemeTokens, ThemeName } from '@/types/theme'

export const useThemeStore = defineStore('theme', () => {
  // State - initialisé depuis localStorage
  const initialTheme = typeof window !== 'undefined' ? localStorage.getItem('theme') || 'light' : 'light'
  const currentThemeName = ref<ThemeName>(initialTheme)
  const customThemes = ref<Map<string, ThemeTokens>>(new Map())
  const styleElement = ref<HTMLStyleElement | null>(null)

  // Thèmes disponibles
  const builtInThemes = computed(() => ({
    light: lightTheme,
    dark: darkTheme,
  }))

  // Tous les thèmes (built-in + custom)
  const allThemes = computed<Record<string, ThemeTokens>>(() => ({
    ...builtInThemes.value,
    ...Object.fromEntries(customThemes.value),
  }))

  // Thème actuel complet
  const currentTheme = computed(() => {
    return allThemes.value[currentThemeName.value] || lightTheme
  })

  // Initialise le style element pour injecter les CSS
  const initializeStyleElement = () => {
    if (typeof document !== 'undefined') {
      const existing = document.getElementById('theme-styles')
      if (existing) existing.remove()

      const styleEl = document.createElement('style')
      styleEl.id = 'theme-styles'
      document.head.appendChild(styleEl)
      styleElement.value = styleEl
      applyTheme()
    }
  }

  // Applique le thème
  const applyTheme = () => {
    if (!styleElement.value) {
      initializeStyleElement()
      return
    }

    const theme = currentTheme.value
    styleElement.value.textContent = generateThemeCSS(theme)
    document.documentElement.dataset.theme = theme.name
  }

  // Actions
  const setTheme = (name: ThemeName) => {
    if (allThemes.value[name]) {
      currentThemeName.value = name
      localStorage.setItem('theme', name)
      applyTheme()
    }
  }

  const toggleTheme = () => {
    const current = currentThemeName.value
    const nextTheme = current === 'light' ? 'dark' : 'light'
    setTheme(nextTheme)
  }

  const addCustomTheme = (theme: ThemeTokens) => {
    customThemes.value.set(theme.name, theme)
  }

  const removeCustomTheme = (name: string) => {
    customThemes.value.delete(name)
    if (currentThemeName.value === name) {
      setTheme('light')
    }
  }

  // Crée un thème custom à partir de tokens partiels
  const createCustomTheme = (
    name: string,
    customizations: Partial<Omit<ThemeTokens, 'name'>>,
  ): ThemeTokens => {
    return {
      name,
      ...lightTheme,
      ...customizations,
    }
  }

  return {
    currentThemeName,
    currentTheme,
    builtInThemes,
    allThemes,
    customThemes,
    setTheme,
    toggleTheme,
    addCustomTheme,
    removeCustomTheme,
    createCustomTheme,
    initializeStyleElement,
  }
})
