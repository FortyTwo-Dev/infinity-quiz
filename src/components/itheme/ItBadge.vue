<script setup lang="ts">
// Candidate for upstream.
import { PhX } from '@phosphor-icons/vue'
import type { WidgetVariant } from './types'

interface Props {
  variant?: WidgetVariant
  size?: 'sm' | 'md'
  outline?: boolean
  soft?: boolean
  removable?: boolean
  disabled?: boolean
  /** Accessible name of the remove button. */
  removeLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'neutral',
  size: 'md',
  outline: false,
  soft: false,
  removable: false,
  disabled: false,
  removeLabel: 'Remove',
})

const emit = defineEmits<{ remove: [] }>()
</script>

<template>
  <span
    class="it-badge"
    :class="[
      `it-badge-${props.variant}`,
      `it-badge-${props.size}`,
      { 'it-badge-outline': props.outline, 'it-badge-soft': props.soft },
    ]"
  >
    <slot />
    <button
      v-if="props.removable"
      type="button"
      class="it-badge-remove"
      :disabled="props.disabled"
      :aria-label="props.removeLabel"
      @click="emit('remove')"
    >
      <PhX :size="12" />
    </button>
  </span>
</template>
