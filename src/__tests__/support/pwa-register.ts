import { ref } from 'vue'
import { vi } from 'vitest'

/**
 * Controllable stand-in for `virtual:pwa-register/vue`, aliased in
 * `vitest.config.ts`. The real module only exists once a production build has
 * generated the service worker, and a unit test must not reach one.
 */
export const offlineReady = ref(false)
export const needRefresh = ref(false)
export const updateServiceWorker = vi.fn<(reloadPage?: boolean) => Promise<void>>()

export function useRegisterSW() {
  return { offlineReady, needRefresh, updateServiceWorker }
}

/** Reset the registration between tests: isolation belongs to the harness. */
export function resetPwaRegistration() {
  offlineReady.value = false
  needRefresh.value = false
  updateServiceWorker.mockReset()
}
