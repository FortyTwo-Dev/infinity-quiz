<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  as?: 'div' | 'span' | 'section' | 'main' | 'article' | 'header'
  inline?: boolean
  direction?: 'row' | 'row-reverse' | 'col' | 'col-reverse'
  wrap?: boolean
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), { wrap: undefined })

const flexClasses = computed(() => {
  const classes = [props.inline ? 'l-flex-inline' : 'l-flex']

  if (props.direction) classes.push(`l-flex-${props.direction}`)
  if (props.wrap !== undefined) classes.push(props.wrap ? 'l-flex-wrap' : 'l-flex-nowrap')
  if (props.gap) classes.push(`l-gap-${props.gap}`)
  if (props.align) classes.push(`l-items-${props.align}`)
  if (props.justify) classes.push(`l-justify-${props.justify}`)
  if (props.fullWidth) classes.push('l-flex-full')

  return classes
})
</script>

<template>
  <component :is="props.as || 'div'" :class="flexClasses">
    <slot />
  </component>
</template>
