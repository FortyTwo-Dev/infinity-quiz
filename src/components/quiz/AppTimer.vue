<script setup lang="ts">
import { computed } from 'vue'
import { DBadge, DProgress } from '@/components/daisy-ui'

interface Props {
  timeLeft: number | null
  timeLimit: number | null
}

const props = defineProps<Props>()

const initialTimeLimit = props.timeLimit

const formattedTime = computed(() => {
  if (props.timeLeft === null) return null
  const minutes = Math.floor(props.timeLeft / 60)
  const seconds = props.timeLeft % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

const isTimeLow = computed(() => {
  if (props.timeLeft === null || props.timeLeft <= 0) return false
  if (!initialTimeLimit) return props.timeLeft <= 30
  return props.timeLeft <= initialTimeLimit * 0.1
})

const percentage = computed(() => {
  if (!initialTimeLimit || props.timeLeft === null) return 0
  return Math.max(100 - (props.timeLeft / initialTimeLimit) * 100, 0)
})
</script>

<template>
  <div class="inline-block relative h-8">
    <DProgress
      v-if="props.timeLimit && props.timeLeft !== null"
      :value="percentage"
      :color="isTimeLow ? 'warning' : 'success'"
      class="h-2 absolute top-1/2 left-0 right-0 -translate-y-1/2"
    />
    <DBadge
      variant="ghost"
      size="lg"
      class="font-mono text-xl px-2 py-1 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
      :class="{
        'text-warning animate-pulse': isTimeLow,
        'text-success': !isTimeLow && props.timeLeft !== null,
        'text-error': props.timeLeft !== null && props.timeLeft <= 10,
      }"
    >
      {{ formattedTime || '00:00' }}
    </DBadge>
  </div>
</template>
