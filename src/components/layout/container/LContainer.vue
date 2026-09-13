<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  as?: 'div' | 'section' | 'main' | 'article' | 'aside' | 'header' | 'footer'
  fluid?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'none'
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  centered?: boolean
}

const props = defineProps<Props>()

const containerClasses = computed(() => {
  const classes: string[] = []

  if (props.fluid) {
    classes.push('w-full', 'max-w-none')
  } else if (props.size) {
    classes.push(`max-w-${props.size}`)
  }

  if (props.padding) {
    const paddingMap: Record<string, string> = {
      none: 'p-0',
      xs: 'p-1',
      sm: 'p-2',
      md: 'p-4',
      lg: 'p-6',
      xl: 'p-8',
    }
    classes.push(paddingMap[props.padding] || 'p-4')
  }

  if (props.centered) {
    classes.push('mx-auto')
  }

  return classes
})
</script>

<template>
  <component :is="props.as || 'div'" :class="containerClasses">
    <slot />
  </component>
</template>
