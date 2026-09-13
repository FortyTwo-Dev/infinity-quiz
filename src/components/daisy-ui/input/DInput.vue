<script setup lang="ts">
import type { InputColor, InputSize } from '../types'

interface Props {
  modelValue?: string | number
  type?: string
  color?: InputColor
  size?: InputSize
  ghost?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  color: undefined,
  size: undefined,
  ghost: false,
})

const colorClasses: Record<InputColor, string> = {
  primary: 'input-primary',
  secondary: 'input-secondary',
  accent: 'input-accent',
  neutral: 'input-neutral',
  success: 'input-success',
  warning: 'input-warning',
  error: 'input-error',
  info: 'input-info',
  ghost: 'input-ghost',
}

const sizeClasses: Record<InputSize, string> = {
  xs: 'input-xs',
  sm: 'input-sm',
  md: 'input-md',
  lg: 'input-lg',
  xl: 'input-xl',
}

interface Emits {
  (e: 'update:modelValue', value: string | number): void
}

const emit = defineEmits<Emits>()

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  let value: string | number = target.value

  if (props.type === 'number') {
    value = target.valueAsNumber
  }

  emit('update:modelValue', value)
}
</script>

<template>
  <input
    class="input"
    :class="[
      props.color ? colorClasses[props.color] : '',
      props.size ? sizeClasses[props.size] : '',
      { 'input-ghost': props.ghost },
    ]"
    :type="props.type"
    :value="props.modelValue"
    @input="handleInput"
    v-bind="$attrs"
  />
</template>
