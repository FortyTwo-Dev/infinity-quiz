<script setup lang="ts">
import type { ProgressColor } from '../types'

interface Props {
  value?: number
  max?: number
  color?: ProgressColor
}

const props = defineProps<Props>()
</script>

<template>
  <progress
    class="progress"
    :class="props.color ? `progress-${props.color}` : ''"
    :value="props.value"
    :max="props.max"
  />
</template>
