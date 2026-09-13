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

const sizeClasses: Record<Size, string> = {
  xs: 'checkbox-xs',
  sm: 'checkbox-sm',
  md: 'checkbox-md',
  lg: 'checkbox-lg',
  xl: 'checkbox-xl',
}

const variantClasses: Record<CheckboxVariant, string> = {
  primary: 'checkbox-primary',
  secondary: 'checkbox-secondary',
  accent: 'checkbox-accent',
  neutral: 'checkbox-neutral',
  success: 'checkbox-success',
  warning: 'checkbox-warning',
  info: 'checkbox-info',
  error: 'checkbox-error',
}

const inputRef = ref<HTMLInputElement | null>(null)

function handleChange(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.checked)
}

watch(
  () => props.indeterminate,
  (value) => {
    if (inputRef.value) {
      inputRef.value.indeterminate = value
    }
  },
  { immediate: true },
)
</script>

<template>
  <input
    ref="inputRef"
    type="checkbox"
    :checked="props.modelValue"
    @change="handleChange"
    :class="[
      'checkbox',
      sizeClasses[props.size],
      variantClasses[props.variant],
    ]"
    :disabled="props.disabled"
  />
</template>
