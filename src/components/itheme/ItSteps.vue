<script setup lang="ts">
// Candidate for upstream. The current step is marked with aria-current, never
// with colour alone.
interface Props {
  steps: string[]
  /** Index of the step in progress, 0-based. */
  current: number
  vertical?: boolean
}

const props = withDefaults(defineProps<Props>(), { vertical: false })
</script>

<template>
  <ol class="it-steps" :class="{ 'it-steps-vertical': props.vertical }">
    <li
      v-for="(step, index) in props.steps"
      :key="step"
      class="it-step"
      :aria-current="index === props.current ? 'step' : undefined"
    >
      {{ step }}
    </li>
  </ol>
</template>
