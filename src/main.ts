import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'
import { useThemeStore } from './stores'

// Import styles
import './css/main.css'

const app = createApp(App)
const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)

// Rehydrate imported themes and apply the persisted global theme.
useThemeStore().rehydrate()

app.mount('#app')
