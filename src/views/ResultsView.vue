<script setup lang="ts">
import { ref } from 'vue'
import { PhEye, PhEyeClosed } from '@phosphor-icons/vue'
import { ItButton } from '@infinitylib/infinity-theme-vue'
import { QuizScoreCard, QuizReviewCard } from '@/components/quiz/card'
import { useResults } from '../composables/useResults'
import type { FeedbackLevel } from '../composables/useFeedback'

const {
  currentQuiz,
  score,
  totalQuestions,
  percentage,
  passed,
  formattedScore,
  level,
  label,
  canReview,
  questionResults,
  restartQuiz,
  backToQuizList,
} = useResults()

const levelClass: Record<FeedbackLevel, string> = {
  perfect: 'quiz-feedback-level-success',
  excellent: 'quiz-feedback-level-success',
  good: 'quiz-feedback-level-success',
  average: 'quiz-feedback-level-warning',
  poor: 'quiz-feedback-level-danger',
}

const showReview = ref(false)

function toggleReview() {
  showReview.value = !showReview.value
}
</script>

<template>
  <section class="quiz-results">
    <h1 class="quiz-page-title">Results</h1>

    <template v-if="currentQuiz">
      <p class="quiz-results-quiz">{{ currentQuiz.title }}</p>
      <p class="quiz-results-level" :class="levelClass[level]">{{ label }}</p>

      <QuizScoreCard
        :score="score"
        :total-questions="totalQuestions"
        :percentage="percentage"
        :passed="passed"
      >
        <template #success-message>Congratulations!</template>
        <template #failure-message>Try again</template>
      </QuizScoreCard>

      <p class="quiz-results-score">Correct answers: {{ formattedScore }}</p>

      <div v-if="canReview" class="quiz-results-review-toggle">
        <ItButton variant="secondary" :aria-expanded="showReview" @click="toggleReview">
          <PhEye v-if="!showReview" :size="18" />
          <PhEyeClosed v-else :size="18" />
          {{ showReview ? 'Hide review' : 'Show review' }}
        </ItButton>
      </div>

      <div class="quiz-results-actions">
        <ItButton variant="primary" @click="restartQuiz">Restart quiz</ItButton>
        <ItButton variant="secondary" @click="backToQuizList">Back to list</ItButton>
      </div>

      <section v-if="showReview && canReview" class="quiz-results-review">
        <h2 class="quiz-results-review-title">Question review</h2>
        <QuizReviewCard
          v-for="result in questionResults"
          :key="result.question.id"
          :question-result="result"
          :show-feedback="true"
        />
      </section>
    </template>

    <div v-else class="quiz-results-empty">
      <p>No results to display</p>
      <ItButton variant="secondary" @click="backToQuizList">Back to list</ItButton>
    </div>
  </section>
</template>
