<script setup lang="ts">
import { withDefaults } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'text'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'secondary',
  size: 'medium',
  disabled: false,
  fullWidth: false,
})

const emit = defineEmits(['click'])

function handleClick(event: MouseEvent) {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>

<template>
  <button
    type="button"
    :class="[
      'btn',
      `btn--${props.variant}`,
      `btn--${props.size}`,
      { 'btn--disabled': props.disabled },
      { 'btn--full-width': props.fullWidth },
    ]"
    :disabled="props.disabled"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-family: inherit;
  font-size: 1rem;
  transition: all var(--transition-normal);
}

/* Variants */
.btn--primary {
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
}

.btn--primary:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
}

.btn--secondary {
  background-color: var(--color-bg-card);
  border: 1px solid var(--color-border);
  color: var(--color-text);
}

.btn--secondary:hover:not(:disabled) {
  background-color: var(--color-border-light);
}

.btn--text {
  background-color: transparent;
  color: var(--color-primary);
  padding: 0;
}

.btn--text:hover:not(:disabled) {
  text-decoration: underline;
}

/* Sizes */
.btn--small {
  padding: var(--space-sm) var(--space-md);
  font-size: 0.875rem;
}

.btn--medium {
  padding: var(--space-md) var(--space-lg);
  font-size: 1rem;
}

.btn--large {
  padding: var(--space-lg) var(--space-xl);
  font-size: 1.125rem;
}

/* States */
.btn--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn--full-width {
  width: 100%;
}
</style>
