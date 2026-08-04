<script setup lang="ts">
import { computed, withDefaults } from 'vue'

interface Props {
  value: number
  max?: number
  height?: string
  color?: string
  backgroundColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  max: 100,
  height: '8px',
  color: '#007bff',
  backgroundColor: '#e0e0e0',
})

const percentage = computed(() => {
  return Math.min(Math.max((props.value / props.max) * 100, 0), 100)
})
</script>

<template>
  <div class="progress-container" :style="{ height: props.height }">
    <div
      class="progress-bar"
      :style="{
        width: `${percentage}%`,
        height: '100%',
        backgroundColor: props.color,
        borderRadius: props.height,
      }"
    />
  </div>
</template>

<style scoped>
.progress-container {
  width: 100%;
  background-color: v-bind(backgroundColor);
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar {
  transition: width 0.3s ease;
}
</style>
