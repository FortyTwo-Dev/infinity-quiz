<script setup lang="ts">
// Candidate for upstream. Styles the native <progress> element.
interface Props {
  /** Omit for an indeterminate bar. */
  value?: number
  max?: number
  variant?: 'neutral' | 'accent' | 'success' | 'warning' | 'danger'
  /** Accessible name: a bar alone carries no meaning. */
  label: string
}

const props = withDefaults(defineProps<Props>(), { max: 100, variant: 'accent' })
</script>

<template>
  <progress
    class="it-progress"
    :class="`it-progress-${props.variant}`"
    :value="props.value"
    :max="props.max"
    :aria-label="props.label"
  />
</template>
