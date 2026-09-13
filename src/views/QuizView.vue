<script setup lang="ts">
import { watch } from 'vue'
import { useQuiz } from '@/composables'
import { useRouter } from 'vue-router'
import { DButton, DProgress } from '@/components/daisy-ui'
import { AppTimer } from '@/components/quiz'
import { QuizFeedbackCard as FeedbackCard, QuizQuestionCard } from '@/components/quiz/card'

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
  <!-- Container -->
  <div class="flex flex-col gap-6 max-w-7xl mx-auto p-4">
    <!--  Component - l'entête de la page  -->
    <div v-if="currentQuiz" class="mb-8 text-center relative">
      <DButton variant="ghost" size="sm" class="absolute left-4 top-4" @click="backToQuizList"
        >← Retour à la liste</DButton
      >
      <h1 class="text-base-content mb-2 text-xl font-bold">{{ currentQuiz.title }}</h1>
      <p class="text-base-content/70 mb-4">{{ currentQuiz.description }}</p>
      <div class="flex flex-col gap-2 mt-4">
        <DProgress :value="progress" :max="100" class="h-2" />
        <span class="text-base-content/70 text-sm"
          >Question {{ currentQuestionIndex + 1 }} / {{ totalQuestions }}</span
        >
        <AppTimer v-if="hasTimer" :time-left="timeLeft" :time-limit="timeLeft" />
      </div>
    </div>

    <!--  Component QuizQuestionCard -->
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

    <div v-else class="text-center p-8 text-base-content/70">
      <p>Aucune question disponible</p>
    </div>

    <!--  Déjà un composant donc nickel  -->
    <FeedbackCard v-if="shouldShowFeedback" />
  </div>
</template>
