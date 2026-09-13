<script setup lang="ts">
import type { ProgressColor } from '../types'

interface Props {
  value?: number
  max?: number
  color?: ProgressColor
}

const props = withDefaults(defineProps<Props>(), {
  value: 0,
  max: 100,
  color: undefined,
})

const colorClasses: Record<ProgressColor, string> = {
  neutral: 'progress-neutral',
  primary: 'progress-primary',
  secondary: 'progress-secondary',
  accent: 'progress-accent',
  info: 'progress-info',
  success: 'progress-success',
  warning: 'progress-warning',
  error: 'progress-error',
}
</script>

<template>
  <progress
    class="progress"
    :class="props.color ? colorClasses[props.color] : ''"
    :value="props.value"
    :max="props.max"
  />
</template>
