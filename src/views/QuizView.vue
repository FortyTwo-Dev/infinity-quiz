<script setup lang="ts">
import { computed, watch } from 'vue'
import { useQuiz } from '../composables/useQuiz'
import { useRouter } from 'vue-router'
import Button from '../components/common/Button.vue'
import ProgressBar from '../components/common/ProgressBar.vue'
import FeedbackCard from '../components/quiz/FeedbackCard.vue'
import { PhCheckCircle, PhXCircle } from '@phosphor-icons/vue'

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
  canSkipCurrentQuestion,
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

// Check if an option is the correct answer
const isCorrectAnswer = (originalIndex: number): boolean => {
  const question = currentQuestion.value
  if (!question) return false
  return originalIndex === question.correctAnswerIndex
}

// Check if an option was selected by the user
const isOptionSelected = (originalIndex: number): boolean => {
  const currentAnswer = getCurrentAnswer()
  return currentAnswer === originalIndex
}

// Get the feedback status for styling an option
const getOptionFeedbackClass = (originalIndex: number) => {
  if (!isAnswerVerified.value) return {}

  const isSelected = isOptionSelected(originalIndex)
  const isCorrect = isCorrectAnswer(originalIndex)

  if (isSelected && isCorrect) {
    return { 'option-button--correct': true }
  }
  if (isSelected && !isCorrect) {
    return { 'option-button--incorrect': true }
  }
  if (!isSelected && isCorrect) {
    return { 'option-button--correct': true }
  }
  return {}
}

const formattedTime = computed(() => {
  if (timeLeft.value === null) return null
  const minutes = Math.floor(timeLeft.value / 60)
  const seconds = timeLeft.value % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

const isTimeLow = computed(() => {
  return timeLeft.value !== null && timeLeft.value <= 30 && timeLeft.value > 0
})
</script>

<template>
  <div class="quiz-view">
    <div v-if="currentQuiz" class="quiz-header">
      <Button variant="text" size="small" class="back-button" @click="backToQuizList"
        >← Retour à la liste</Button
      >
      <h1>{{ currentQuiz.title }}</h1>
      <p>{{ currentQuiz.description }}</p>
      <div class="header-meta">
        <ProgressBar :value="progress" :max="100" height="8px" />
        <span class="progress-text"
          >Question {{ currentQuestionIndex + 1 }} / {{ totalQuestions }}</span
        >
        <span v-if="hasTimer" class="timer" :class="{ 'timer--low': isTimeLow }">{{
          formattedTime
        }}</span>
      </div>
    </div>

    <div v-if="currentQuestion" class="question-container">
      <h2>{{ currentQuestion.text }}</h2>

      <div class="options">
        <Button
          v-for="(item, displayIndex) in currentQuestionOptions"
          :key="displayIndex"
          variant="secondary"
          size="medium"
          :class="{
            'option-button--selected': isOptionSelected(item.originalIndex),
            ...getOptionFeedbackClass(item.originalIndex),
          }"
          class="option-button"
          :disabled="isCurrentQuestionVerified"
          @click="selectAnswer(item.originalIndex)"
        >
          <span
            class="option-icon"
            v-if="
              (isAnswerVerified && isCorrectAnswer(item.originalIndex)) ||
              (isAnswerVerified &&
                isOptionSelected(item.originalIndex) &&
                !isCorrectAnswer(item.originalIndex))
            "
          >
            <PhCheckCircle
              v-if="isAnswerVerified && isCorrectAnswer(item.originalIndex)"
              :size="20"
              weight="fill"
            />
            <PhXCircle
              v-else-if="
                isAnswerVerified &&
                isOptionSelected(item.originalIndex) &&
                !isCorrectAnswer(item.originalIndex)
              "
              :size="20"
              weight="fill"
              class="incorrect-icon"
            />
            <span v-else class="icon-placeholder"></span>
          </span>
          <span class="option-text">{{ item.option }}</span>
        </Button>
      </div>

      <div class="navigation">
        <Button variant="secondary" :disabled="!hasPreviousQuestion" @click="goToPrevious">
          Précédent
        </Button>
        <Button
          v-if="canSkip"
          variant="outline"
          :disabled="!canSkipCurrentQuestion"
          @click="skipQuestion"
        >
          Sauter{{ remainingSkips !== null ? ` (${remainingSkips})` : '' }}
        </Button>
        <Button
          variant="primary"
          :disabled="
            hasFeedbackEnabled
              ? getCurrentAnswer() === null && !isCurrentQuestionVerified
              : getCurrentAnswer() === null
          "
          @click="
            hasFeedbackEnabled && !isCurrentQuestionVerified
              ? verifyAnswer()
              : hasFeedbackEnabled
                ? continueToNext()
                : submitAndNext()
          "
        >
          {{
            hasFeedbackEnabled && !isCurrentQuestionVerified && getCurrentAnswer() !== null
              ? 'Vérifier'
              : hasNextQuestion
                ? 'Suivant'
                : 'Terminer'
          }}
        </Button>
      </div>
    </div>

    <div v-else class="no-question">
      <p>Aucune question disponible</p>
    </div>

    <FeedbackCard v-if="shouldShowFeedback" />
  </div>
</template>

<style scoped>
.quiz-view {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  max-width: 800px;
  margin: 0 auto;
  padding: var(--space-md);
}

.quiz-header {
  margin-bottom: var(--space-xl);
  text-align: center;
  position: relative;
}

.back-button {
  position: absolute;
  left: var(--space-md);
  top: var(--space-md);
}

.quiz-header h1 {
  color: var(--color-text);
  margin-bottom: var(--space-sm);
}

.quiz-header p {
  color: var(--color-text-secondary);
  margin-bottom: var(--space-md);
}

.progress-text {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
}

.header-meta {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  margin-top: var(--space-md);
}

.timer {
  font-family: monospace;
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--color-text);
  text-align: center;
  padding: var(--space-xs) var(--space-md);
  background: var(--color-bg-card);
  border-radius: var(--radius-sm);
  border: 2px solid var(--color-border);
  display: inline-block;
  min-width: 80px;
}

.timer--low {
  color: var(--color-error);
  border-color: var(--color-error);
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

.question-container {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-xl);
}

.question-container h2 {
  margin-top: 0;
  margin-bottom: var(--space-xl);
  color: var(--color-text);
  font-size: 1.3rem;
  min-height: 60px;
}

.options {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
}

.option-button {
  width: 100%;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  transition: all var(--transition-normal);
  display: flex;
  gap: var(--space-sm);
}

.option-button:hover:not(.option-button--correct):not(.option-button--incorrect) {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
}

.option-button--selected:not(.option-button--correct):not(.option-button--incorrect) {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
  font-weight: bold;
}

.option-button--correct {
  border-color: var(--color-success) !important;
  background: var(--color-success-light) !important;
  color: var(--color-success-dark) !important;
}

.option-button--incorrect {
  border-color: var(--color-warning) !important;
  background: var(--color-warning-light) !important;
  color: var(--color-warning-dark) !important;
}

.option-button:disabled {
  cursor: not-allowed;
}

.option-icon {
  min-width: 24px;
  width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-placeholder {
  display: block;
  width: 24px;
  height: 20px;
  flex-shrink: 0;
}

.option-text {
  text-align: center;
}

.correct-icon {
  color: var(--color-success);
}

.incorrect-icon {
  color: var(--color-warning);
}

.navigation {
  display: flex;
  justify-content: space-between;
  gap: var(--space-md);
}

.navigation > * {
  flex: 1;
}

.no-question {
  text-align: center;
  padding: var(--space-xl);
  color: var(--color-text-secondary);
}
</style>
