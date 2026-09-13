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
  as?: 'button' | 'input-radio' | 'input-checkbox'
  checked?: boolean
  name?: string
  value?: string | number
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'neutral',
  size: 'md',
  disabled: false,
  fullWidth: false,
  loading: false,
  type: 'button',
  soft: false,
  as: 'button',
  checked: false,
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
  (e: 'change', event: Event): void
}

const emit = defineEmits<Emits>()

function handleClick(event: MouseEvent) {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}

function handleChange(event: Event) {
  if (!props.disabled && !props.loading) {
    emit('change', event)
  }
}
</script>

<template>
  <component
    :is="props.as === 'button' ? 'button' : 'input'"
    v-bind="
      props.as === 'button'
        ? {
            type: props.type,
            disabled: props.disabled || props.loading,
            onClick: handleClick,
          }
        : {
            type: props.as === 'input-radio' ? 'radio' : 'checkbox',
            checked: props.checked,
            name: props.name,
            value: props.value,
            disabled: props.disabled || props.loading,
            onChange: handleChange,
            'aria-label': props.name || 'button',
          }
    "
    :class="buttonClasses"
  >
    <span v-if="props.as === 'button' && props.loading" class="loading loading-spinner" />
    <slot v-if="props.as === 'button'" />
  </component>
</template>
