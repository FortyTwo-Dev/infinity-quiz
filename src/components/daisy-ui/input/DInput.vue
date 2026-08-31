<script setup lang="ts">
import type { InputColor, InputSize } from '../types'

interface Props {
  modelValue?: string | number
  type?: string
  color?: InputColor
  size?: InputSize
  ghost?: boolean
}

const props = defineProps<Props>()

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
      props.color ? `input-${props.color}` : '',
      props.size ? `input-${props.size}` : '',
      { 'input-ghost': props.ghost },
    ]"
    :type="props.type"
    :value="props.modelValue"
    @input="handleInput"
    v-bind="$attrs"
  />
</template>
