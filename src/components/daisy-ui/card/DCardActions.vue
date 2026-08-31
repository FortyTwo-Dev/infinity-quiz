<script setup lang="ts">
import type { Justify } from '../types'

interface Props {
  justify?: Justify
}

const props = withDefaults(defineProps<Props>(), {
  justify: 'end',
})
</script>

<template>
  <div class="card-actions" :class="`justify-${props.justify}`">
    <slot />
  </div>
</template>
