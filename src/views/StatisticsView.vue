<script setup lang="ts">
import { computed, ref } from 'vue'
import { useQuizStore, useQuizHistoryStore } from '@/stores'
import { useStatistics } from '@/composables'
import {
  DCard,
  DCardBody,
  DCardTitle,
  DSelect,
  DSelectOption,
  DFieldset,
} from '@/components/daisy-ui'
import { LContainer, LGrid } from '@/components/layout'
import TrendLineChart from '@/components/quiz/TrendLineChart.vue'
import PassFailDoughnut from '@/components/quiz/PassFailDoughnut.vue'
import ScoreDistributionChart from '@/components/quiz/ScoreDistributionChart.vue'
import AverageByQuizChart from '@/components/quiz/AverageByQuizChart.vue'
import GaugeChart from '@/components/quiz/GaugeChart.vue'

const quizStore = useQuizStore()
const historyStore = useQuizHistoryStore()
const { categories, selectedCategory, learningCurve } = useStatistics()

/** Quizzes that have at least one recorded attempt. */
const attemptedQuizzes = computed(() =>
  quizStore.quizzes.filter((quiz) => historyStore.getResultsByQuizId(quiz.id).length > 0),
)

const selectedQuizId = ref<string | null>(null)

const selectedQuiz = computed(() =>
  selectedQuizId.value ? quizStore.getQuizById(selectedQuizId.value) : null,
)

const globalStats = computed(() => historyStore.getGlobalStats)
const passFailTotals = computed(() => historyStore.getPassFailTotals)
const scoreDistribution = computed(() => historyStore.getScoreDistribution)
const averageByQuiz = computed(() => historyStore.getAverageByQuiz)

const learningCurveChart = computed(() => ({
  labels: learningCurve.value.map((p) => `#${p.attempt}`),
  data: learningCurve.value.map((p) => Math.round(p.passRate)),
}))

const averageByQuizChart = computed(() => ({
  labels: averageByQuiz.value.map(
    (entry) => quizStore.getQuizById(entry.quizId)?.title ?? 'Unknown',
  ),
  data: averageByQuiz.value.map((entry) => Math.round(entry.average)),
}))

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
      <div class="mb-8">
        <h2 class="text-base-content mb-4 text-xl font-semibold">Overall performance</h2>
        <LGrid as="div" cols="1 md:2 lg:4" gap="lg">
          <DCard border class="bg-base-100">
            <DCardBody padding="lg" class="gap-4">
              <DCardTitle>Overall</DCardTitle>
              <div class="flex items-center justify-center">
                <GaugeChart
                  :value="globalStats.averagePercentage"
                  label="Average"
                  color="oklch(54% 0.245 262.881)"
                />
              </div>
            </DCardBody>
          </DCard>

          <DCard border class="bg-base-100">
            <DCardBody padding="lg" class="gap-2">
              <DCardTitle>Pass / fail</DCardTitle>
              <PassFailDoughnut :passed="passFailTotals.passed" :failed="passFailTotals.failed" />
            </DCardBody>
          </DCard>

          <DCard border class="bg-base-100">
            <DCardBody padding="lg" class="gap-2">
              <DCardTitle>Score distribution</DCardTitle>
              <ScoreDistributionChart :bins="scoreDistribution" />
            </DCardBody>
          </DCard>

          <DCard border class="bg-base-100">
            <DCardBody padding="lg" class="gap-2">
              <DCardTitle>Average by quiz</DCardTitle>
              <AverageByQuizChart
                :labels="averageByQuizChart.labels"
                :data="averageByQuizChart.data"
              />
            </DCardBody>
          </DCard>
        </LGrid>
      </div>

      <!-- Learning curve -->
      <DCard border class="bg-base-100 mb-8">
        <DCardBody padding="lg" class="gap-4">
          <div class="flex items-center justify-between gap-4 flex-wrap">
            <DCardTitle>Learning curve</DCardTitle>
            <DFieldset label="Category" class="w-56">
              <DSelect v-model="selectedCategory" class="w-full">
                <DSelectOption value="">All categories</DSelectOption>
                <DSelectOption v-for="category in categories" :key="category" :value="category">
                  {{ category }}
                </DSelectOption>
              </DSelect>
            </DFieldset>
          </div>
          <TrendLineChart :labels="learningCurveChart.labels" :data="learningCurveChart.data" />
          <p class="text-sm text-base-content/70 m-0">
            Average pass rate by attempt number across all quizzes.
          </p>
        </DCardBody>
      </DCard>

      <!-- Per-quiz details -->
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
            <TrendLineChart :labels="quizChart.labels" :data="quizChart.data" />

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
