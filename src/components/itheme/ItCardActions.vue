<script setup lang="ts">
// Candidate for upstream.
interface Props {
  justify?: 'start' | 'center' | 'end' | 'between'
}

const props = withDefaults(defineProps<Props>(), { justify: 'end' })
</script>

<template>
  <div class="it-card-actions" :class="`it-card-actions-${props.justify}`">
    <slot />
  </div>
</template>
