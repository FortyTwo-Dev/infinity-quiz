<script setup lang="ts">
// Candidate for upstream.
import type { WidgetVariant } from './types'

interface Props {
  variant?: WidgetVariant
  /** Adds role="status" so a message announced later is read out. */
  live?: boolean
}

const props = withDefaults(defineProps<Props>(), { variant: 'info', live: false })
</script>

<template>
  <div
    class="it-alert"
    :class="`it-alert-${props.variant}`"
    :role="props.live ? 'status' : undefined"
  >
    <slot />
  </div>
</template>
