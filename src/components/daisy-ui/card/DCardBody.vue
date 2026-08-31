<script setup lang="ts">
import type { PaddingSize } from '../types'

interface Props {
  padding?: PaddingSize
}

const props = withDefaults(defineProps<Props>(), {
  padding: 'md',
})

const paddingClasses: Record<PaddingSize, string> = {
  none: '',
  sm: 'p-2',
  md: 'p-4',
  lg: 'p-6',
}
</script>

<template>
  <div class="card-body" :class="paddingClasses[props.padding]">
    <slot />
  </div>
</template>
