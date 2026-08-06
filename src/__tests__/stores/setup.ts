import { createPinia, setActivePinia } from 'pinia'
import { beforeEach } from 'vitest'

// Mock localStorage for tests
let store: Record<string, string> = {}

const localStorageMock: Storage = {
  getItem: (key: string) => store[key] ?? null,
  setItem: (key: string, value: string) => {
    store[key] = String(value)
  },
  removeItem: (key: string) => {
    delete store[key]
  },
  clear: () => {
    store = {}
  },
  key: (index: number) => Object.keys(store)[index] ?? null,
  get length() {
    return Object.keys(store).length
  },
}

// Assign to globalThis for pinia-plugin-persistedstate
// This works in both browser (window) and Node.js (global) environments
Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
  configurable: true,
})

// Setup Pinia for each test
beforeEach(() => {
  // Reset localStorage before each test
  store = {}
  const pinia = createPinia()
  setActivePinia(pinia)
})
