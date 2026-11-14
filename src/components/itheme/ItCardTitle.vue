<script setup lang="ts">
// Candidate for upstream.
interface Props {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), { as: 'h2', size: 'md' })

const sizeClasses: Record<NonNullable<Props['size']>, string> = {
  sm: 'it-card-title-sm',
  md: '',
  lg: 'it-card-title-lg',
}
</script>

<template>
  <component :is="props.as" class="it-card-title" :class="sizeClasses[props.size]">
    <slot />
  </component>
</template>
