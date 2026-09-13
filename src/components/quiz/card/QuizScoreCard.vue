<script setup lang="ts">
import { computed } from 'vue'
import { DBadge, DProgress } from '@/components/daisy-ui'
import { DCard, DCardBody } from '@/components/daisy-ui/card'

interface Props {
  score: number
  totalQuestions: number
  passed: boolean
  timeTaken?: number
  timeLimit?: number
}

const props = defineProps<Props>()

const percentage = computed(() => {
  return Math.round((props.score / props.totalQuestions) * 100)
})
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
          <div class="text-sm text-base-content/70">Précision</div>
          <div class="font-bold">{{ percentage }}%</div>
        </div>
        <div v-if="timeLimit">
          <div class="text-sm text-base-content/70">Temps</div>
          <div class="font-bold">{{ Math.round(timeTaken || 0) }}s</div>
        </div>
        <div>
          <div class="text-sm text-base-content/70">Résultat</div>
          <div class="font-bold" :class="passed ? 'text-success' : 'text-error'">
            {{ passed ? 'Réussi' : 'Échoué' }}
          </div>
        </div>
      </div>

      <!-- Badge -->
      <div>
        <DBadge v-if="passed" variant="success" size="lg">
          <slot name="success-message">Félicitations !</slot>
        </DBadge>
        <DBadge v-else variant="error" size="lg">
          <slot name="failure-message">Essayez encore</slot>
        </DBadge>
      </div>
    </DCardBody>
  </DCard>
</template>
