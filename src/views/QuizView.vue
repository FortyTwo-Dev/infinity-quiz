<script setup lang="ts">
import { watch, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { ItButton } from '@infinitylib/infinity-theme-vue'
import { ItProgress } from '@/components/itheme'
import { AppTimer } from '@/components/quiz'
import { QuizFeedbackCard as FeedbackCard, QuizQuestionCard } from '@/components/quiz/card'
import { useQuiz } from '@/composables'
import { useThemeStore } from '@/stores'

const {
  currentQuiz,
  currentQuestion,
  currentQuestionOptions,
  totalQuestions,
  currentQuestionIndex,
  progress,
  hasNextQuestion,
  hasPreviousQuestion,
  timeLeft,
  hasTimer,
  canSkip,
  remainingSkips,
  hasFeedbackEnabled,
  getCurrentQuestionTimeLimit,
  isAnswerVerified,
  shouldShowFeedback,
  isCurrentQuestionVerified,
  isCompleted,
  selectAnswer,
  skipQuestion,
  verifyAnswer,
  continueToNext,
  submitAndNext,
  goToPrevious,
  backToQuizList,
  getCurrentAnswer,
} = useQuiz()

const router = useRouter()
const themeStore = useThemeStore()

onMounted(() => {
  themeStore.applyQuizTheme(currentQuiz.value?.theme)
})

onBeforeUnmount(() => {
  themeStore.restoreGlobalTheme()
})

watch(
  isCompleted,
  (completed) => {
    if (completed) router.push({ name: 'results' })
  },
  { immediate: true },
)
</script>

<template>
  <section class="quiz-play">
    <header v-if="currentQuiz" class="quiz-play-header">
      <ItButton variant="ghost" size="sm" @click="backToQuizList">← Back to list</ItButton>

      <div class="quiz-play-heading">
        <h1 class="quiz-play-title">{{ currentQuiz.title }}</h1>
        <p class="quiz-play-description">{{ currentQuiz.description }}</p>
      </div>

      <div class="quiz-play-progress">
        <AppTimer v-if="hasTimer" :time-left="timeLeft" :time-limit="getCurrentQuestionTimeLimit" />
        <ItProgress :value="progress" :max="100" label="Quiz progress" />
        <span class="quiz-play-counter">
          Question {{ currentQuestionIndex + 1 }} / {{ totalQuestions }}
        </span>
      </div>
    </header>

    <QuizQuestionCard
      v-if="currentQuestion"
      :question="currentQuestion"
      :question-options="currentQuestionOptions"
      :selected-answer="getCurrentAnswer()"
      :is-answer-verified="isAnswerVerified"
      :is-current-question-verified="isCurrentQuestionVerified"
      :has-previous-question="hasPreviousQuestion"
      :has-next-question="hasNextQuestion"
      :can-skip="canSkip"
      :remaining-skips="remainingSkips"
      :has-feedback-enabled="hasFeedbackEnabled"
      @select="selectAnswer"
      @previous="goToPrevious"
      @skip="skipQuestion"
      @verify="verifyAnswer"
      @continue="continueToNext"
      @submit="submitAndNext"
    />

    <p v-else class="quiz-play-empty">No questions available</p>

    <FeedbackCard v-if="shouldShowFeedback" />
  </section>
</template>
