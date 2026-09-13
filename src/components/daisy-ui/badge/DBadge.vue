<script setup lang="ts">
import type { Size, ColorVariant } from '../types'
import { PhX } from '@phosphor-icons/vue'

interface Props {
  variant?: ColorVariant
  size?: Size
  outline?: boolean
  soft?: boolean
  removable?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'neutral',
  size: 'md',
  outline: false,
  soft: false,
  removable: false,
  disabled: false,
})

const variantClasses: Record<ColorVariant, string> = {
  primary: 'badge-primary',
  secondary: 'badge-secondary',
  accent: 'badge-accent',
  neutral: 'badge-neutral',
  success: 'badge-success',
  warning: 'badge-warning',
  error: 'badge-error',
  info: 'badge-info',
  ghost: 'badge-ghost',
}

const sizeClasses: Record<Size, string> = {
  xs: 'badge-xs',
  sm: 'badge-sm',
  md: 'badge-md',
  lg: 'badge-lg',
  xl: 'badge-xl',
}

interface Emits {
  (e: 'remove'): void
}

const emit = defineEmits<Emits>()

function handleRemove() {
  if (!props.disabled) {
    emit('remove')
  }
}
</script>

<template>
  <span
    :class="[
      'badge',
      variantClasses[props.variant],
      sizeClasses[props.size],
      { 'badge-outline': props.outline },
      { 'badge-soft': props.soft },
      { 'cursor-pointer': props.removable && !props.disabled },
      { 'cursor-not-allowed': props.removable && props.disabled },
    ]"
  >
    <slot />
    <button
      v-if="props.removable"
      type="button"
      :class="[
        'ml-1',
        'p-0',
        'bg-transparent',
        'border-none',
        'rounded-full',
        'hover:bg-base-100',
        { 'cursor-not-allowed': props.disabled },
        { 'cursor-pointer': !props.disabled },
      ]"
      :disabled="props.disabled"
      @click="handleRemove"
      :aria-label="'Remove'"
    >
      <PhX :size="14" class="text-current" />
    </button>
  </span>
</template>
