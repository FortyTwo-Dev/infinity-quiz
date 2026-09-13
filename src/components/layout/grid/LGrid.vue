<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  as?: 'div' | 'section' | 'main' | 'article'
  cols?: number | 'auto-fit' | 'auto-fill' | string
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | string
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
}

const props = defineProps<Props>()

function parseColsInput(input: string): string {
  return input
    .split(' ')
    .map((part) => {
      if (part.includes(':')) {
        const [prefix, value] = part.split(':')
        return `${prefix}:grid-cols-${value}`
      }
      return `grid-cols-${part}`
    })
    .join(' ')
}

function parseGapInput(input: string): string {
  return input
    .split(' ')
    .map((part) => {
      if (part.includes(':')) {
        const [prefix, value] = part.split(':')
        return `${prefix}:gap-${value}`
      }
      return `gap-${part}`
    })
    .join(' ')
}

const gridClasses = computed(() => {
  const classes: string[] = ['grid']

  if (props.cols !== undefined) {
    if (props.cols === 'auto-fit') {
      classes.push('grid-cols-[auto-fit_minmax(0,1fr)]')
    } else if (props.cols === 'auto-fill') {
      classes.push('grid-cols-[auto-fill_minmax(0,1fr)]')
    } else if (typeof props.cols === 'number') {
      classes.push(`grid-cols-${props.cols}`)
    } else if (typeof props.cols === 'string') {
      classes.push(parseColsInput(props.cols))
    }
  }

  if (props.gap !== undefined) {
    if (typeof props.gap === 'string') {
      if (props.gap.includes(' ')) {
        classes.push(parseGapInput(props.gap))
      } else {
        const gapMap: Record<string, string> = {
          none: 'gap-0',
          xs: 'gap-1',
          sm: 'gap-2',
          md: 'gap-4',
          lg: 'gap-6',
          xl: 'gap-8',
        }
        classes.push(gapMap[props.gap] || `gap-${props.gap}`)
      }
    }
  }

  if (props.align) {
    classes.push(`items-${props.align}`)
  }

  if (props.justify) {
    classes.push(`justify-${props.justify}`)
  }

  return classes
})
</script>

<template>
  <component :is="props.as || 'div'" :class="gridClasses">
    <slot />
  </component>
</template>
