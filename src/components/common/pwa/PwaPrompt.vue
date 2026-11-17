<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue'
import { ItButton } from '@infinitylib/infinity-theme-vue'

/**
 * The service worker registers on mount. The user is told when the application
 * is ready offline, and when a new build is waiting: the reload is offered,
 * never forced, so an attempt in progress is not interrupted.
 */
const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW()

function close() {
  offlineReady.value = false
  needRefresh.value = false
}
</script>

<template>
  <output
    v-if="offlineReady || needRefresh"
    class="pwa-banner"
    aria-label="Application status"
    aria-live="polite"
  >
    <div class="pwa-inner">
      <span class="pwa-message">
        {{ needRefresh ? 'A new version is available.' : 'Ready to work offline.' }}
      </span>
      <ItButton v-if="needRefresh" size="sm" @click="updateServiceWorker()">Reload</ItButton>
      <ItButton variant="secondary" size="sm" @click="close">Close</ItButton>
    </div>
  </output>
</template>
