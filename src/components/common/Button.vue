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
  border-radius: 4px;
  cursor: pointer;
  font-family: inherit;
  font-size: 1rem;
  transition: all 0.2s ease;
}

/* Variants */
.btn--primary {
  background-color: #007bff;
  color: white;
}

.btn--primary:hover:not(:disabled) {
  background-color: #0056b3;
}

.btn--secondary {
  background-color: white;
  border: 1px solid #ccc;
  color: #333;
}

.btn--secondary:hover:not(:disabled) {
  background-color: #f0f0f0;
}

.btn--text {
  background-color: transparent;
  color: #007bff;
  padding: 0;
}

.btn--text:hover:not(:disabled) {
  text-decoration: underline;
}

/* Sizes */
.btn--small {
  padding: 6px 12px;
  font-size: 0.875rem;
}

.btn--medium {
  padding: 12px 24px;
  font-size: 1rem;
}

.btn--large {
  padding: 16px 32px;
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
