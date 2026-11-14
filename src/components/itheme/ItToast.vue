<script setup lang="ts">
// Candidate for upstream. A fixed region; the child carries the alert.
interface Props {
  horizontal?: 'start' | 'center' | 'end'
  vertical?: 'top' | 'middle' | 'bottom'
}

const props = withDefaults(defineProps<Props>(), { horizontal: 'end', vertical: 'bottom' })
</script>

<template>
  <div class="it-toast" :class="[`it-toast-${props.horizontal}`, `it-toast-${props.vertical}`]">
    <slot />
  </div>
</template>
