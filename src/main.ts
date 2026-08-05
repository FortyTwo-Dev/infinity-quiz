import { createApp } from 'vue'
import { createPinia } from 'pinia'
import type { PiniaPluginContext } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'

// Import styles
import './assets/styles/_variables.css'

const app = createApp(App)
const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)

// Persist theme in localStorage
pinia.use(({ store }: PiniaPluginContext) => {
  store.$subscribe((mutation, state) => {
    if (store.$id === 'theme') {
      localStorage.setItem('theme', state.currentThemeName)
    }
  })
})

app.use(pinia)
app.use(router)

app.mount('#app')
