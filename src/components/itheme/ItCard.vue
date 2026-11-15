<script setup lang="ts">
// Candidate for upstream: `@infinitylib/infinity-theme` ships no card.
interface Props {
  border?: boolean
}

const props = withDefaults(defineProps<Props>(), { border: false })
</script>

<template>
  <div class="it-card" :class="{ 'it-card-border': props.border }">
    <slot />
  </div>
</template>
