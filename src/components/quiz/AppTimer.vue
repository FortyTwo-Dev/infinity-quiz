<script setup lang="ts">
import { computed } from 'vue'
import { ItProgress } from '@/components/itheme'

interface Props {
  timeLeft: number | null
  timeLimit: number | null
}

const props = defineProps<Props>()

const formattedTime = computed(() => {
  if (props.timeLeft === null) return '00:00'
  const minutes = Math.floor(props.timeLeft / 60)
  const seconds = props.timeLeft % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

const isTimeLow = computed(() => {
  if (props.timeLeft === null || props.timeLeft <= 0) return false
  if (!props.timeLimit) return props.timeLeft <= 30
  return props.timeLeft <= props.timeLimit * 0.1
})

const progressValue = computed(() => {
  if (!props.timeLimit || props.timeLeft === null) return 0
  return Math.max(100 - (props.timeLeft / props.timeLimit) * 100, 0)
})
</script>

<template>
  <div class="quiz-timer" :data-low="isTimeLow">
    <ItProgress
      v-if="timeLimit && timeLeft !== null"
      :value="progressValue"
      :variant="isTimeLow ? 'warning' : 'accent'"
      label="Time remaining"
      class="quiz-timer-bar"
    />
    <span class="quiz-timer-value">{{ formattedTime }}</span>
  </div>
</template>
