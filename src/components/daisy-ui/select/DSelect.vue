<script setup lang="ts">
import type { ColorVariant, Size } from '../types'

interface Props {
  modelValue?: string | number | null
  color?: ColorVariant
  size?: Size
  ghost?: boolean
  disabled?: boolean
  id?: string
  name?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  color: undefined,
  size: undefined,
  ghost: false,
  disabled: false,
})

const colorClasses: Record<ColorVariant, string> = {
  primary: 'select-primary',
  secondary: 'select-secondary',
  accent: 'select-accent',
  neutral: 'select-neutral',
  success: 'select-success',
  warning: 'select-warning',
  error: 'select-error',
  info: 'select-info',
  ghost: 'select-ghost',
}

const sizeClasses: Record<Size, string> = {
  xs: 'select-xs',
  sm: 'select-sm',
  md: 'select-md',
  lg: 'select-lg',
  xl: 'select-xl',
}

interface Emits {
  (e: 'update:modelValue', value: string | number | null): void
  (e: 'change', event: Event): void
}

const emit = defineEmits<Emits>()

function handleChange(event: Event) {
  const target = event.target as HTMLSelectElement
  const value = target.value

  if (value === '') {
    emit('update:modelValue', null)
  } else if (!Number.isNaN(Number(value))) {
    emit('update:modelValue', Number(value))
  } else {
    emit('update:modelValue', value)
  }

  emit('change', event)
}
</script>

<template>
  <select
    class="select"
    :class="[
      props.color ? colorClasses[props.color] : '',
      props.size ? sizeClasses[props.size] : '',
      { 'select-ghost': props.ghost },
    ]"
    :id="props.id"
    :name="props.name"
    :value="props.modelValue ?? ''"
    :disabled="props.disabled"
    @change="handleChange"
    v-bind="$attrs"
  >
    <slot />
  </select>
</template>
