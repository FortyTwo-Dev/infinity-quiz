<script setup lang="ts">
import { computed, ref } from 'vue'
import { useQuizStore, useQuizHistoryStore } from '@/stores'
import {
  DCard,
  DCardBody,
  DCardTitle,
  DSelect,
  DSelectOption,
  DFieldset,
} from '@/components/daisy-ui'
import { LContainer } from '@/components/layout'
import ScoreEvolutionChart from '@/components/quiz/ScoreEvolutionChart.vue'

const quizStore = useQuizStore()
const historyStore = useQuizHistoryStore()

/** Quizzes that have at least one recorded attempt. */
const attemptedQuizzes = computed(() =>
  quizStore.quizzes.filter((quiz) => historyStore.getResultsByQuizId(quiz.id).length > 0),
)

const selectedQuizId = ref<string | null>(null)

const selectedQuiz = computed(() =>
  selectedQuizId.value ? quizStore.getQuizById(selectedQuizId.value) : null,
)

const globalStats = computed(() => historyStore.getGlobalStats)

const cumulativeAverages = computed(() => historyStore.getCumulativeAverages)

const cumulativeChart = computed(() => {
  const points = cumulativeAverages.value
  return {
    labels: points.map((_, index) => `#${index + 1}`),
    data: points.map((p) => Math.round(p.average)),
  }
})

const quizResults = computed(() =>
  selectedQuizId.value ? historyStore.getResultsByQuizId(selectedQuizId.value) : [],
)

const quizChart = computed(() => ({
  labels: quizResults.value.map((_, index) => `#${index + 1}`),
  data: quizResults.value.map((r) =>
    r.totalQuestions > 0 ? Math.round((r.score / r.totalQuestions) * 100) : 0,
  ),
}))

const quizStats = computed(() =>
  selectedQuizId.value ? historyStore.getStatsByQuizId(selectedQuizId.value) : null,
)

function formatPercentage(value: number | undefined): string {
  return `${Math.round(value ?? 0)}%`
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

    <div v-if="!globalStats" class="text-center p-8 text-base-content/70">
      <p>No attempts recorded yet. Play a quiz to see your statistics.</p>
    </div>

    <template v-else>
      <!-- Global overview -->
      <DCard border class="bg-base-100 mb-8">
        <DCardBody padding="lg" class="gap-4">
          <DCardTitle>Overall performance</DCardTitle>
          <ScoreEvolutionChart :labels="cumulativeChart.labels" :data="cumulativeChart.data" />

          <div class="grid grid-cols-3 gap-2 text-center">
            <div>
              <div class="text-sm text-base-content/70">Attempts</div>
              <div class="font-bold">{{ globalStats.attempts }}</div>
            </div>
            <div>
              <div class="text-sm text-base-content/70">Average</div>
              <div class="font-bold">{{ formatPercentage(globalStats.averagePercentage) }}</div>
            </div>
            <div>
              <div class="text-sm text-base-content/70">Pass rate</div>
              <div class="font-bold">{{ formatPercentage(globalStats.passRate) }}</div>
            </div>
          </div>
        </DCardBody>
      </DCard>

      <!-- Per-quiz selector -->
      <DCard border class="bg-base-100">
        <DCardBody padding="lg" class="gap-4">
          <DCardTitle>Quiz details</DCardTitle>

          <DFieldset label="Select a quiz">
            <DSelect v-model="selectedQuizId" :disabled="attemptedQuizzes.length === 0" class="w-full">
              <DSelectOption value="">All quizzes</DSelectOption>
              <DSelectOption v-for="quiz in attemptedQuizzes" :key="quiz.id" :value="quiz.id">
                {{ quiz.title }}
              </DSelectOption>
            </DSelect>
          </DFieldset>

          <div v-if="!selectedQuiz" class="text-center p-4 text-base-content/70">
            <p>Select a quiz to see its detailed statistics.</p>
          </div>

          <template v-else>
            <ScoreEvolutionChart :labels="quizChart.labels" :data="quizChart.data" />

            <div class="grid grid-cols-3 gap-2 text-center">
              <div>
                <div class="text-sm text-base-content/70">Attempts</div>
                <div class="font-bold">{{ quizStats?.attempts }}</div>
              </div>
              <div>
                <div class="text-sm text-base-content/70">Best</div>
                <div class="font-bold">{{ formatPercentage(quizStats?.bestPercentage) }}</div>
              </div>
              <div>
                <div class="text-sm text-base-content/70">Pass rate</div>
                <div class="font-bold">{{ formatPercentage(quizStats?.passRate) }}</div>
              </div>
            </div>
          </template>
        </DCardBody>
      </DCard>
    </template>
  </LContainer>
</template>
