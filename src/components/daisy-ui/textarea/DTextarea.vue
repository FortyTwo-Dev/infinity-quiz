<script setup lang="ts">
import type { ColorVariant, Size } from '../types'

interface Props {
  modelValue: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  error?: boolean
  variant?: ColorVariant
  size?: Size
  rows?: number
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
  disabled: false,
  readonly: false,
  error: false,
  variant: 'neutral',
  size: 'md',
  rows: 4,
})

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const emit = defineEmits<Emits>()

const variantClasses: Record<ColorVariant, string> = {
  primary: 'textarea-primary',
  secondary: 'textarea-secondary',
  accent: 'textarea-accent',
  neutral: 'textarea-neutral',
  success: 'textarea-success',
  warning: 'textarea-warning',
  error: 'textarea-error',
  info: 'textarea-info',
  ghost: 'textarea-ghost',
}

const sizeClasses: Record<Size, string> = {
  xs: 'textarea-xs',
  sm: 'textarea-sm',
  md: 'textarea-md',
  lg: 'textarea-lg',
  xl: 'textarea-xl',
}

function handleInput(event: Event) {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <textarea
    :value="props.modelValue"
    @input="handleInput"
    :class="[
      'textarea',
      'w-full',
      variantClasses[props.variant],
      sizeClasses[props.size],
    ]"
    :placeholder="props.placeholder"
    :disabled="props.disabled"
    :readonly="props.readonly"
    :rows="props.rows"
  />
</template>
