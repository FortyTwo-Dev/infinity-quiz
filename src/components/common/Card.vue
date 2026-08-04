<script setup lang="ts">
import { withDefaults } from 'vue'

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
  border-radius: 8px;
  transition: all 0.2s ease;
}

/* Variants */
.card--default {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
}

.card--elevated {
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card--outlined {
  background-color: transparent;
  border: 1px solid #ddd;
}

/* Padding */
.card--padding-none {
  padding: 0;
}

.card--padding-small {
  padding: 12px;
}

.card--padding-medium {
  padding: 20px;
}

.card--padding-large {
  padding: 30px;
}

/* Hover */
.card--hoverable:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>
