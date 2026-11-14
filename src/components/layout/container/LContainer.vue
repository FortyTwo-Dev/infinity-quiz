<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  as?: 'div' | 'section' | 'main' | 'article' | 'aside' | 'header' | 'footer'
  fluid?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'none'
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  /** Every container is centred by `.l-container`; kept for the call sites. */
  centered?: boolean
}

const props = defineProps<Props>()

const containerClasses = computed(() => {
  const classes = ['l-container']

  if (props.fluid) classes.push('l-container-fluid')
  else if (props.size) classes.push(`l-container-${props.size}`)

  if (props.padding) classes.push(`l-container-pad-${props.padding}`)

  return classes
})
</script>

<template>
  <component :is="props.as || 'div'" :class="containerClasses">
    <slot />
  </component>
</template>
