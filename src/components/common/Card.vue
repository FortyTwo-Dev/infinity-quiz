<script setup lang="ts">
interface Props {
  variant?: 'default' | 'elevated' | 'outlined'
  padding?: 'none' | 'small' | 'medium' | 'large'
  hoverable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  padding: 'medium',
  hoverable: false,
})
</script>

<template>
  <div
    :class="[
      'card',
      `card--${props.variant}`,
      `card--padding-${props.padding}`,
      { 'card--hoverable': props.hoverable },
    ]"
  >
    <slot />
  </div>
</template>

<style scoped>
.card {
  border-radius: var(--radius-md);
  transition: all var(--transition-normal);
}

/* Variants */
.card--default {
  background-color: var(--color-bg-card);
  border: 1px solid var(--color-border);
}

.card--elevated {
  background-color: var(--color-bg-card);
  box-shadow: var(--shadow-md);
}

.card--outlined {
  background-color: transparent;
  border: 1px solid var(--color-border);
}

/* Padding */
.card--padding-none {
  padding: 0;
}

.card--padding-small {
  padding: var(--space-sm);
}

.card--padding-medium {
  padding: var(--space-md);
}

.card--padding-large {
  padding: var(--space-lg);
}

/* Hover */
.card--hoverable:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
</style>
