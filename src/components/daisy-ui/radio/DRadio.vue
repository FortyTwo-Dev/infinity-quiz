<script setup lang="ts">
import type { RadioVariant, Size } from '../types'

interface Props {
  value?: string | number
  name?: string
  checked?: boolean
  variant?: RadioVariant
  size?: Size
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  value: undefined,
  name: undefined,
  checked: false,
  variant: undefined,
  size: 'md',
  disabled: false,
})

interface Emits {
  (e: 'change', event: Event): void
}

const emit = defineEmits<Emits>()

const sizeClasses: Record<Size, string> = {
  xs: 'radio-xs',
  sm: 'radio-sm',
  md: 'radio-md',
  lg: 'radio-lg',
  xl: 'radio-xl',
}

const variantClasses: Record<RadioVariant, string> = {
  primary: 'radio-primary',
  secondary: 'radio-secondary',
  accent: 'radio-accent',
  neutral: 'radio-neutral',
  success: 'radio-success',
  warning: 'radio-warning',
  info: 'radio-info',
  error: 'radio-error',
}

function handleChange(event: Event) {
  emit('change', event)
}
</script>

<template>
  <input
    type="radio"
    class="radio"
    :class="[
      props.size ? sizeClasses[props.size] : '',
      props.variant ? variantClasses[props.variant] : '',
    ]"
    :value="props.value"
    :name="props.name"
    :checked="props.checked"
    :disabled="props.disabled"
    @change="handleChange"
    v-bind="$attrs"
  />
</template>
