import { createApp } from 'vue'
import { createPinia, disposePinia, setActivePinia, type Pinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

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

// Assign to globalThis and window for pinia-plugin-persistedstate.
// Works in both browser (window) and Node/Bun (global) environments.
Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
  configurable: true,
})

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
    configurable: true,
  })
}

let currentPinia: Pinia | null = null

/**
 * Install a fresh Pinia instance with the persistence plugin without clearing
 * the storage. Use it to simulate a page reload and test rehydration.
 */
export function installTestPinia(): void {
  if (currentPinia) disposePinia(currentPinia)
  const pinia = createPinia()
  pinia.use(piniaPluginPersistedstate)
  // Pinia 4 only registers plugins through `app.use(pinia)`; simulate it so
  // the persistence plugin is actually active during tests.
  createApp({ template: '<div />' }).use(pinia)
  setActivePinia(pinia)
  currentPinia = pinia
}

/**
 * Reset the in-memory storage and install a fresh Pinia instance with the
 * persistence plugin. Runner-agnostic: call it from a `beforeEach` in specs.
 */
export function setupTestPinia(): void {
  store = {}
  installTestPinia()
}

/** Read the raw persisted value for a storage key (for assertions). */
export function readStorage(key: string): string | null {
  return store[key] ?? null
}
