<script setup lang="ts">
import type { CardSize } from '../types'

interface Props {
  size?: CardSize
  border?: boolean
  compact?: boolean
  side?: boolean
  dash?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  border: false,
  compact: false,
  side: false,
  dash: false,
})

const cardSizeClasses: Record<CardSize, string> = {
  sm: 'card-sm',
  md: 'card-md',
  lg: 'card-lg',
  xl: 'card-xl',
}
</script>

<template>
  <div
    :class="[
      'card',
      cardSizeClasses[props.size],
      { 'card-border': props.border },
      { 'card-compact': props.compact },
      { 'card-side': props.side },
      { 'card-dash': props.dash },
    ]"
  >
    <slot />
  </div>
</template>
