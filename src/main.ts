import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'

// Import styles
import './assets/styles/_variables.css'

// Import theme store
import { useThemeStore } from './stores/theme-store'

const app = createApp(App)
const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)

// Persist theme in localStorage
pinia.use(() => {
  return {
    onSet: (store, key, value) => {
      if (store.$id === 'theme' && key === 'currentThemeName') {
        localStorage.setItem('theme', value)
      }
    },
  }
})

app.use(pinia)
app.use(router)

app.mount('#app')
