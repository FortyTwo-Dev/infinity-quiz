import { createPinia, setActivePinia } from 'pinia'
import { beforeEach } from 'vitest'

// Setup Pinia for each test
beforeEach(() => {
  const pinia = createPinia()
  setActivePinia(pinia)
})
