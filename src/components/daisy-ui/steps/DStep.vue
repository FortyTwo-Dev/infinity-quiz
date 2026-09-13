<script setup lang="ts">
import { computed } from 'vue'
import type { ColorVariant } from '../types'

interface Props {
  color?: ColorVariant
  content?: string
}

const props = defineProps<Props>()

const colorClasses = {
  primary: 'step step-primary',
  secondary: 'step step-secondary',
  accent: 'step step-accent',
  neutral: 'step step-neutral',
  success: 'step step-success',
  warning: 'step step-warning',
  error: 'step step-error',
  info: 'step step-info',
  ghost: 'step step-ghost',
} as const

const stepClasses = computed(() =>
  props.color && props.color in colorClasses
    ? colorClasses[props.color as keyof typeof colorClasses]
    : 'step',
)
</script>

<template>
  <li :class="stepClasses" :data-content="props.content || undefined">
    <span v-if="$slots.icon" class="step-icon">
      <slot name="icon" />
    </span>
    <slot />
  </li>
</template>
