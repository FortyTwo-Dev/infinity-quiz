<script setup lang="ts">
// Candidate for upstream.
interface Props {
  size?: 'none' | 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), { size: 'md' })

const sizeClasses: Record<NonNullable<Props['size']>, string> = {
  none: '',
  sm: 'it-card-body-sm',
  md: '',
  lg: 'it-card-body-lg',
}
</script>

<template>
  <div class="it-card-body" :class="sizeClasses[props.size]">
    <slot />
  </div>
</template>
