<script setup lang="ts">
import { DBadge, DProgress } from '@/components/daisy-ui'
import { DCard, DCardBody } from '@/components/daisy-ui/card'

interface Props {
  score: number
  totalQuestions: number
  percentage: number
  passed: boolean
  timeTaken?: number
  timeLimit?: number
}

defineProps<Props>()
</script>

<template>
  <DCard size="lg" class="max-w-[600px] mx-auto text-center">
    <DCardBody padding="lg">
      <!-- Score -->
      <div class="text-8xl font-bold mb-4" :class="passed ? 'text-success' : 'text-error'">
        {{ score }}/{{ totalQuestions }}
      </div>

      <!-- Progress Bar -->
      <DProgress :value="score" :max="totalQuestions" color="primary" class="mb-6 h-4" />

      <!-- Percentage -->
      <div class="text-2xl font-semibold mb-4">{{ percentage }}%</div>

      <!-- Stats -->
      <div class="flex justify-center gap-8 text-center mb-6">
        <div>
          <div class="text-sm text-base-content/70">Accuracy</div>
          <div class="font-bold">{{ percentage }}%</div>
        </div>
        <div v-if="timeLimit">
          <div class="text-sm text-base-content/70">Time</div>
          <div class="font-bold">{{ Math.round(timeTaken || 0) }}s</div>
        </div>
        <div>
          <div class="text-sm text-base-content/70">Result</div>
          <div class="font-bold" :class="passed ? 'text-success' : 'text-error'">
            {{ passed ? 'Passed' : 'Failed' }}
          </div>
        </div>
      </div>

      <!-- Badge -->
      <div>
        <DBadge v-if="passed" variant="success" size="lg">
          <slot name="success-message">Congratulations!</slot>
        </DBadge>
        <DBadge v-else variant="error" size="lg">
          <slot name="failure-message">Try again</slot>
        </DBadge>
      </div>
    </DCardBody>
  </DCard>
</template>
