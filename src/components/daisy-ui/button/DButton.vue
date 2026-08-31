<script setup lang="ts">
import type { ButtonVariant, ButtonSize, ButtonType } from '../types'

interface Props {
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  fullWidth?: boolean
  loading?: boolean
  type?: ButtonType
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'neutral',
  size: 'md',
  disabled: false,
  fullWidth: false,
  loading: false,
  type: 'button',
})

interface Emits {
  (e: 'click', event: MouseEvent): void
}

const emit = defineEmits<Emits>()

function handleClick(event: MouseEvent) {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<template>
  <button
    :type="props.type"
    :class="[
      'btn',
      `btn-${props.variant}`,
      `btn-${props.size}`,
      { 'btn-wide': props.fullWidth },
      { 'btn-disabled': props.disabled },
      { 'loading': props.loading },
    ]"
    :disabled="props.disabled || props.loading"
    @click="handleClick"
  >
    <span v-if="props.loading" class="loading loading-spinner" />
    <slot />
  </button>
</template>
