<script setup lang="ts">
import type { Position, IndicatorAlign } from '../types'

interface Props {
  position?: Position
  align?: IndicatorAlign
}

const props = withDefaults(defineProps<Props>(), {
  position: 'top',
  align: 'end',
})
</script>

<template>
  <div class="indicator">
    <span
      class="indicator-item"
      :class="[`indicator-${props.position}`, `indicator-${props.align}`]"
    >
      <slot name="indicator" />
    </span>
    <slot />
  </div>
</template>
