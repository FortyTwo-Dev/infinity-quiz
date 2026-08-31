<script setup lang="ts">
import type { BadgeVariant, BadgeSize } from '../types'

interface Props {
  variant?: BadgeVariant
  size?: BadgeSize
  outline?: boolean
  soft?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'neutral',
  size: 'md',
  outline: false,
  soft: false,
})
</script>

<template>
  <span
    :class="[
      'badge',
      `badge-${props.variant}`,
      `badge-${props.size}`,
      { 'badge-outline': props.outline },
      { 'badge-soft': props.soft },
    ]"
  >
    <slot />
  </span>
</template>
