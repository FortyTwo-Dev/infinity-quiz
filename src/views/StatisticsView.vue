<script setup lang="ts">
import { computed, ref } from 'vue'
import { ItCard, ItCardBody, ItCardTitle } from '@/components/itheme'
import { ItField, ItOption, ItSelect } from '@infinitylib/infinity-theme-vue'
import { useQuizStore, useQuizHistoryStore } from '@/stores'
import { useStatistics } from '@/composables'
import {
  TrendLineChart,
  PassFailDoughnut,
  ScoreDistributionChart,
  AverageByQuizChart,
  GaugeChart,
} from '@/components/quiz/charts'

const quizStore = useQuizStore()
const historyStore = useQuizHistoryStore()
const { categories, selectedCategory, learningCurve } = useStatistics()

/** Quizzes that have at least one recorded attempt. */
const attemptedQuizzes = computed(() =>
  quizStore.quizzes.filter((quiz) => historyStore.getResultsByQuizId(quiz.id).length > 0),
)

const selectedQuizId = ref<string | null>(null)

// The select works with strings; the refs keep `null` for "no selection".
const categorySelection = computed({
  get: () => selectedCategory.value ?? '',
  set: (value: string) => {
    selectedCategory.value = value || null
  },
})

const quizSelection = computed({
  get: () => selectedQuizId.value ?? '',
  set: (value: string) => {
    selectedQuizId.value = value || null
  },
})

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
  <section class="stats-view">
    <header class="quiz-page-header">
      <div>
        <h1 class="quiz-page-title">Statistics</h1>
        <p class="quiz-page-subtitle">Track your performance and review your quiz history</p>
      </div>
    </header>

    <p v-if="!globalStats" class="stats-empty">
      No attempts recorded yet. Play a quiz to see your statistics.
    </p>

    <template v-else>
      <section class="stats-section">
        <h2 class="stats-section-title">Overall performance</h2>
        <div class="stats-grid">
          <ItCard border>
            <ItCardBody size="lg">
              <ItCardTitle as="h3">Overall</ItCardTitle>
              <div class="stats-chart stats-chart-gauge">
                <GaugeChart
                  :value="globalStats.averagePercentage"
                  label="Average"
                  color="accent"
                  :size="200"
                />
              </div>
            </ItCardBody>
          </ItCard>

          <ItCard border>
            <ItCardBody size="lg">
              <ItCardTitle as="h3">Pass / fail</ItCardTitle>
              <PassFailDoughnut :passed="passFailTotals.passed" :failed="passFailTotals.failed" />
            </ItCardBody>
          </ItCard>

          <ItCard border>
            <ItCardBody size="lg">
              <ItCardTitle as="h3">Score distribution</ItCardTitle>
              <ScoreDistributionChart :bins="scoreDistribution" />
            </ItCardBody>
          </ItCard>

          <ItCard border>
            <ItCardBody size="lg">
              <ItCardTitle as="h3">Average by quiz</ItCardTitle>
              <AverageByQuizChart
                :labels="averageByQuizChart.labels"
                :data="averageByQuizChart.data"
              />
            </ItCardBody>
          </ItCard>
        </div>
      </section>

      <ItCard border>
        <ItCardBody size="lg">
          <div class="stats-card-head">
            <ItCardTitle as="h2">Learning curve</ItCardTitle>
            <ItField label="Category" html-for="stats-category" class="stats-filter">
              <ItSelect id="stats-category" v-model="categorySelection">
                <ItOption value="" text="All categories" />
                <ItOption
                  v-for="category in categories"
                  :key="category"
                  :value="category"
                  :text="category"
                />
              </ItSelect>
            </ItField>
          </div>
          <TrendLineChart :labels="learningCurveChart.labels" :data="learningCurveChart.data" />
          <p class="stats-note">Average pass rate by attempt number across all quizzes.</p>
        </ItCardBody>
      </ItCard>

      <ItCard border>
        <ItCardBody size="lg">
          <ItCardTitle as="h2">Quiz details</ItCardTitle>

          <ItField label="Select a quiz" html-for="stats-quiz">
            <ItSelect
              id="stats-quiz"
              v-model="quizSelection"
              :disabled="attemptedQuizzes.length === 0"
            >
              <ItOption value="" text="All quizzes" />
              <ItOption
                v-for="quiz in attemptedQuizzes"
                :key="quiz.id"
                :value="quiz.id"
                :text="quiz.title"
              />
            </ItSelect>
          </ItField>

          <p v-if="!selectedQuiz" class="stats-empty">
            Select a quiz to see its detailed statistics.
          </p>

          <template v-else>
            <TrendLineChart :labels="quizChart.labels" :data="quizChart.data" />

            <dl class="stats-metrics">
              <div>
                <dt>Attempts</dt>
                <dd>{{ quizStats?.attempts }}</dd>
              </div>
              <div>
                <dt>Best</dt>
                <dd>{{ formatPercentage(quizStats?.bestPercentage) }}</dd>
              </div>
              <div>
                <dt>Pass rate</dt>
                <dd>{{ formatPercentage(quizStats?.passRate) }}</dd>
              </div>
            </dl>
          </template>
        </ItCardBody>
      </ItCard>
    </template>
  </section>
</template>
