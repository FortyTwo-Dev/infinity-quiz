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

const props = defineProps<Props>()

const flexClasses = computed(() => {
  const classes: string[] = []

  if (props.inline) {
    classes.push('inline-flex')
  } else {
    classes.push('flex')
  }

  if (props.direction) {
    classes.push(`flex-${props.direction}`)
  }

  if (props.wrap !== undefined) {
    classes.push(props.wrap ? 'flex-wrap' : 'flex-nowrap')
  }

  if (props.gap) {
    const gapMap: Record<string, string> = {
      none: 'gap-0',
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8',
    }
    classes.push(gapMap[props.gap] || 'gap-4')
  }

  if (props.align) {
    classes.push(`items-${props.align}`)
  }

  if (props.justify) {
    classes.push(`justify-${props.justify}`)
  }

  if (props.fullWidth) {
    classes.push('w-full')
  }

  return classes
})
</script>

<template>
  <component :is="props.as || 'div'" :class="flexClasses">
    <slot />
  </component>
</template>
