<script setup lang="ts">
import { computed } from 'vue'
import type { Direction } from '../types'

interface Props {
  direction?: Direction
}

const props = withDefaults(defineProps<Props>(), {
  direction: 'horizontal',
})

const directionClasses = {
  horizontal: 'steps steps-horizontal w-full',
  vertical: 'steps steps-vertical w-full',
} as const

const stepsClasses = computed(() => directionClasses[props.direction])
</script>

<template>
  <ul :class="stepsClasses">
    <slot />
  </ul>
</template>
