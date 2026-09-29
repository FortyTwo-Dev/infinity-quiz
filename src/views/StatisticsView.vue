<script setup lang="ts">
import { computed } from 'vue'
import { useQuizStore, useQuizHistoryStore } from '@/stores'
import { DCard, DCardBody, DCardTitle } from '@/components/daisy-ui'
import { LContainer, LGrid } from '@/components/layout'
import ScoreEvolutionChart from '@/components/quiz/ScoreEvolutionChart.vue'

const quizStore = useQuizStore()
const historyStore = useQuizHistoryStore()

/** Quizzes that have at least one recorded attempt. */
const attemptedQuizzes = computed(() =>
  quizStore.quizzes.filter((quiz) => historyStore.getResultsByQuizId(quiz.id).length > 0),
)

function formatPercentage(value: number): string {
  return `${Math.round(value)}%`
}
</script>

<template>
  <LContainer as="section" size="7xl" padding="md" centered>
    <div class="mb-8">
      <h1 class="text-base-content mb-2 text-3xl font-bold">Statistics</h1>
      <p class="text-base-content/70 m-0">
        Track your performance and review your quiz history
      </p>
    </div>

    <div v-if="attemptedQuizzes.length === 0" class="text-center p-8 text-base-content/70">
      <p>No attempts recorded yet. Play a quiz to see your statistics.</p>
    </div>

    <LGrid v-else as="div" cols="1 md:2" gap="lg">
      <DCard v-for="quiz in attemptedQuizzes" :key="quiz.id" border class="bg-base-100">
        <DCardBody padding="lg" class="gap-4">
          <DCardTitle>{{ quiz.title }}</DCardTitle>

          <ScoreEvolutionChart :results="historyStore.getResultsByQuizId(quiz.id)" />

          <div class="grid grid-cols-3 gap-2 text-center">
            <div>
              <div class="text-sm text-base-content/70">Attempts</div>
              <div class="font-bold">{{ historyStore.getStatsByQuizId(quiz.id)?.attempts }}</div>
            </div>
            <div>
              <div class="text-sm text-base-content/70">Best</div>
              <div class="font-bold">
                {{ formatPercentage(historyStore.getStatsByQuizId(quiz.id)?.bestPercentage ?? 0) }}
              </div>
            </div>
            <div>
              <div class="text-sm text-base-content/70">Pass rate</div>
              <div class="font-bold">
                {{ formatPercentage(historyStore.getStatsByQuizId(quiz.id)?.passRate ?? 0) }}
              </div>
            </div>
          </div>
        </DCardBody>
      </DCard>
    </LGrid>
  </LContainer>
</template>
