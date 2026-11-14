import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'
import { useThemeStore } from './stores'
import { STORAGE_KEYS } from './constants'
import { migrateQuizCatalogue, migrateThemeStorage } from './utils/theme'

// Import styles: the cascade order comes first (index.html), then the theme
// package, then the application's brand layer.
import '@infinitylib/infinity-theme'
import './css/brand.css'
import './css/itheme/index.css'

/**
 * Rewrite the theme payloads written by the daisyUI build before any store
 * rehydrates them: a theme is now a mode and an accent, not a theme name.
 * Idempotent, and silent when storage is unavailable.
 */
function migrateStoredThemes() {
  if (typeof localStorage === 'undefined') return

  try {
    localStorage.setItem(
      STORAGE_KEYS.theme,
      migrateThemeStorage(localStorage.getItem(STORAGE_KEYS.theme)),
    )
    const catalogue = migrateQuizCatalogue(localStorage.getItem(STORAGE_KEYS.quizzes))
    if (catalogue !== null) localStorage.setItem(STORAGE_KEYS.quizzes, catalogue)
  } catch {
    // Storage can be denied (private mode) or full: the app runs on defaults.
  }
}

migrateStoredThemes()

const app = createApp(App)
const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)

useThemeStore().rehydrate()

app.mount('#app')
