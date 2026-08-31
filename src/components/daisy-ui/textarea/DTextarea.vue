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
      { 'textarea-neutral': props.variant === 'neutral' },
      { 'textarea-primary': props.variant === 'primary' },
      { 'textarea-secondary': props.variant === 'secondary' },
      { 'textarea-accent': props.variant === 'accent' },
      { 'textarea-ghost': props.variant === 'ghost' },
      { 'textarea-info': props.variant === 'info' },
      { 'textarea-success': props.variant === 'success' },
      { 'textarea-warning': props.variant === 'warning' },
      { 'textarea-error': props.variant === 'error' },
      { 'textarea-xs': props.size === 'xs' },
      { 'textarea-sm': props.size === 'sm' },
      { 'textarea-md': props.size === 'md' },
      { 'textarea-lg': props.size === 'lg' },
      { 'textarea-xl': props.size === 'xl' },
    ]"
    :placeholder="props.placeholder"
    :disabled="props.disabled"
    :readonly="props.readonly"
    :rows="props.rows"
  />
</template>
