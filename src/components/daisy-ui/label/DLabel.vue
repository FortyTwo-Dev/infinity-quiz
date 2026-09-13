<script setup lang="ts">
import type { LabelVariant } from '../types'

interface Props {
  variant?: LabelVariant
  text?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'input',
  text: '',
})
</script>

<template>
  <label :class="props.variant">
    <span :class="{ label: props.variant !== 'floating-label' }">{{ props.text }}</span>
    <slot />
  </label>
</template>
