<script setup lang="ts">
import { watch, onMounted, onBeforeUnmount } from 'vue'
import { useQuiz } from '@/composables'
import { useRouter } from 'vue-router'
import { DButton, DProgress } from '@/components/daisy-ui'
import { AppTimer } from '@/components/quiz'
import { QuizFeedbackCard as FeedbackCard, QuizQuestionCard } from '@/components/quiz/card'
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

// Apply the quiz theme on mount and restore the global theme on unmount.
onMounted(() => {
  themeStore.applyQuizTheme(currentQuiz.value?.theme)
})

onBeforeUnmount(() => {
  themeStore.restoreGlobalTheme()
})

// Auto-navigate to results when quiz is completed (e.g., timer expiry on last question)
watch(
  isCompleted,
  (completed) => {
    if (completed) {
      router.push({ name: 'results' })
    }
  },
  { immediate: true },
)
</script>

<template>
  <!-- Container : groupe centré (header + carte) + feedback en overlay -->
  <div
    class="grid place-items-center min-h-[calc(100vh-2rem)] max-w-7xl mx-auto p-4"
  >
    <div class="relative w-full">
      <!--  Zone 1 - l'entête de la page  -->
      <div v-if="currentQuiz" class="text-center relative">
        <DButton variant="ghost" size="sm" class="absolute left-4 top-4" @click="backToQuizList"
          >← Back to list</DButton
        >
        <h1 class="text-base-content mb-2 text-xl font-bold">{{ currentQuiz.title }}</h1>
        <p class="text-base-content/70 mb-4">{{ currentQuiz.description }}</p>
        <div class="flex flex-col gap-2 mt-4">
          <AppTimer
            v-if="hasTimer"
            :time-left="timeLeft"
            :time-limit="getCurrentQuestionTimeLimit"
          />
          <DProgress :value="progress" :max="100" class="h-2" />
          <span class="text-base-content/70 text-sm"
            >Question {{ currentQuestionIndex + 1 }} / {{ totalQuestions }}</span
          >
        </div>
      </div>

      <!--  Zone 2 - la carte question  -->
      <QuizQuestionCard
        v-if="currentQuestion"
        class="w-full my-4"
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

      <div v-else class="text-center p-8 text-base-content/70">
        <p>No questions available</p>
      </div>

      <!--  Zone 3 - le feedback, en overlay juste sous la carte  -->
      <FeedbackCard v-if="shouldShowFeedback" class="absolute top-full left-0 right-0" />
    </div>
  </div>
</template>
