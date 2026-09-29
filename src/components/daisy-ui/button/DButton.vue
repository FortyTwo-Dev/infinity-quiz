<script setup lang="ts">
import type { ButtonVariant, Size, ButtonType } from '../types'
import { computed } from 'vue'

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  accent: 'btn-accent',
  neutral: 'btn-neutral',
  success: 'btn-success',
  warning: 'btn-warning',
  error: 'btn-error',
  info: 'btn-info',
  ghost: 'btn-ghost',
  link: 'btn-link',
  outline: 'btn-outline',
}

const sizeClasses: Record<Size, string> = {
  xs: 'btn-xs',
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg',
  xl: 'btn-xl',
}

interface Props {
  variant?: ButtonVariant
  size?: Size
  disabled?: boolean
  fullWidth?: boolean
  loading?: boolean
  type?: ButtonType
  soft?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'neutral',
  size: 'md',
  disabled: false,
  fullWidth: false,
  loading: false,
  type: 'button',
  soft: false,
})

const buttonClasses = computed(() => [
  'btn',
  variantClasses[props.variant],
  sizeClasses[props.size],
  { 'btn-wide': props.fullWidth },
  { 'btn-disabled': props.disabled },
  { loading: props.loading },
  { 'btn-soft': props.soft },
])

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
    :disabled="props.disabled || props.loading"
    :class="buttonClasses"
    @click="handleClick"
  >
    <span v-if="props.loading" class="loading loading-spinner" />
    <slot />
  </button>
</template>
