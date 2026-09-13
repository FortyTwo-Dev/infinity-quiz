<script setup lang="ts">
import type { ColorVariant, Size } from '../types'

interface Props {
  modelValue?: File | null
  color?: ColorVariant
  size?: Size
  ghost?: boolean
  disabled?: boolean
  accept?: string
  multiple?: boolean
  id?: string
  name?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  color: undefined,
  size: undefined,
  ghost: false,
  disabled: false,
  accept: '',
  multiple: false,
})

const colorClasses: Record<ColorVariant, string> = {
  primary: 'file-input-primary',
  secondary: 'file-input-secondary',
  accent: 'file-input-accent',
  neutral: 'file-input-neutral',
  success: 'file-input-success',
  warning: 'file-input-warning',
  error: 'file-input-error',
  info: 'file-input-info',
  ghost: 'file-input-ghost',
}

const sizeClasses: Record<Size, string> = {
  xs: 'file-input-xs',
  sm: 'file-input-sm',
  md: 'file-input-md',
  lg: 'file-input-lg',
  xl: 'file-input-xl',
}

interface Emits {
  (e: 'update:modelValue', value: File | File[] | null): void
  (e: 'change', event: Event): void
}

const emit = defineEmits<Emits>()

function handleChange(event: Event) {
  const target = event.target as HTMLInputElement
  const files = target.files

  if (!files || files.length === 0) {
    emit('update:modelValue', null)
    emit('change', event)
    return
  }

  if (props.multiple) {
    emit('update:modelValue', Array.from(files))
  } else {
    emit('update:modelValue', files[0])
  }

  emit('change', event)
}
</script>

<template>
  <input
    type="file"
    class="file-input"
    :class="[
      props.color ? colorClasses[props.color] : '',
      props.size ? sizeClasses[props.size] : '',
      { 'file-input-ghost': props.ghost },
    ]"
    :id="props.id"
    :name="props.name"
    :accept="props.accept"
    :multiple="props.multiple"
    :disabled="props.disabled"
    @change="handleChange"
    v-bind="$attrs"
  />
</template>
