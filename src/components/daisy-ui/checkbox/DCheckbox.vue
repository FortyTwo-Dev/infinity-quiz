<script setup lang="ts">
import type { CheckboxVariant, Size } from '../types'
import { ref, watch } from 'vue'

interface Props {
  modelValue?: boolean
  variant?: CheckboxVariant
  size?: Size
  disabled?: boolean
  indeterminate?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  variant: 'primary',
  size: 'md',
  disabled: false,
  indeterminate: false,
})

interface Emits {
  (e: 'update:modelValue', value: boolean): void
}

const emit = defineEmits<Emits>()

const inputRef = ref<HTMLInputElement | null>(null)

function handleChange(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.checked)
}

watch(() => props.indeterminate, (value) => {
  if (inputRef.value) {
    inputRef.value.indeterminate = value
  }
}, { immediate: true })
</script>

<template>
  <input
    ref="inputRef"
    type="checkbox"
    :checked="props.modelValue"
    @change="handleChange"
    :class="[
      'checkbox',
      { 'checkbox-xs': props.size === 'xs' },
      { 'checkbox-sm': props.size === 'sm' },
      { 'checkbox-md': props.size === 'md' },
      { 'checkbox-lg': props.size === 'lg' },
      { 'checkbox-xl': props.size === 'xl' },
      { 'checkbox-primary': props.variant === 'primary' },
      { 'checkbox-secondary': props.variant === 'secondary' },
      { 'checkbox-accent': props.variant === 'accent' },
      { 'checkbox-neutral': props.variant === 'neutral' },
      { 'checkbox-success': props.variant === 'success' },
      { 'checkbox-warning': props.variant === 'warning' },
      { 'checkbox-info': props.variant === 'info' },
      { 'checkbox-error': props.variant === 'error' },
    ]"
    :disabled="props.disabled"
  />
</template>
