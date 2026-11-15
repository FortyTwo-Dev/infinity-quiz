<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  as?: 'div' | 'section' | 'main' | 'article'
  /** A column count, or a breakpoint list such as `1 md:2 lg:4`. */
  cols?: number | 'auto-fit' | 'auto-fill' | string
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
}

const props = defineProps<Props>()

/** `md:2` becomes `l-grid-md-cols-2`, a bare `3` becomes `l-grid-cols-3`. */
function parseColumns(input: number | string): string[] {
  if (typeof input === 'number') return [`l-grid-cols-${input}`]

  if (input === 'auto-fit' || input === 'auto-fill') return [`l-grid-cols-${input}`]

  return input
    .split(' ')
    .filter(Boolean)
    .map((part) => {
      const [breakpoint, count] = part.includes(':') ? part.split(':') : [undefined, part]
      return breakpoint ? `l-grid-${breakpoint}-cols-${count}` : `l-grid-cols-${count}`
    })
}

const gridClasses = computed(() => {
  const classes = ['l-grid']

  if (props.cols !== undefined) classes.push(...parseColumns(props.cols))
  if (props.gap) classes.push(`l-gap-${props.gap}`)
  if (props.align) classes.push(`l-items-${props.align}`)
  if (props.justify) classes.push(`l-justify-${props.justify}`)

  return classes
})
</script>

<template>
  <component :is="props.as || 'div'" :class="gridClasses">
    <slot />
  </component>
</template>
