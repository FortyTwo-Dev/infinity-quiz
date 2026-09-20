<script setup lang="ts">
import type { HeadingTag, TextSize } from '../types'

interface Props {
  tag?: HeadingTag
  size?: TextSize
}

const props = withDefaults(defineProps<Props>(), {
  tag: 'h2',
  size: 'md',
})

const sizeClasses: Record<TextSize, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-lg',
  lg: 'text-xl',
  xl: 'text-2xl',
  '2xl': 'text-3xl',
  '3xl': 'text-4xl',
}
</script>

<template>
  <component :is="props.tag" class="card-title" :class="sizeClasses[props.size]">
    <slot />
  </component>
</template>
