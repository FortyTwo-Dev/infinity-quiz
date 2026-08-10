<script setup lang="ts">
import { computed } from 'vue'
import { useQuizSessionStore, useQuizVerificationStore } from '../../stores'
import { PhCheckCircle, PhXCircle } from '@phosphor-icons/vue'

const sessionStore = useQuizSessionStore()
const verificationStore = useQuizVerificationStore()

const currentQuestion = computed(() => sessionStore.currentQuestion)
const verifiedAnswerCorrect = computed(() => verificationStore.verifiedAnswerCorrect)

// Get the correct answer text and explanation
const correctAnswerText = computed(() => {
  const question = currentQuestion.value
  if (!question) return ''
  return question.options[question.correctAnswerIndex]
})

const explanation = computed(() => {
  const question = currentQuestion.value
  if (!question) return ''
  return question.explanation || ''
})

// Get the user's selected answer index
const userAnswerIndex = computed(() => {
  const question = currentQuestion.value
  if (!question) return null
  return sessionStore.getAnswerForQuestion(question.id)
})

// Get the user's selected answer text
const userAnswerText = computed(() => {
  const question = currentQuestion.value
  const answerIndex = userAnswerIndex.value
  if (!question || answerIndex === null) return ''
  return question.options[answerIndex]
})

const shouldShowFeedback = computed(() => verificationStore.shouldShowFeedback)
</script>

<template>
  <Transition name="fade">
    <div v-if="shouldShowFeedback" class="feedback-card">
      <div class="feedback-content">
        <div class="feedback-header">
          <span class="feedback-icon">
            <PhCheckCircle
              v-if="verifiedAnswerCorrect"
              :size="24"
              weight="fill"
              class="correct-icon"
            />
            <PhXCircle v-else :size="24" weight="fill" class="incorrect-icon" />
          </span>
          <span class="feedback-title">
            {{ verifiedAnswerCorrect ? 'Bonne réponse !' : 'Presque...' }}
          </span>
        </div>

        <div class="feedback-body">
          <p class="correct-answer"><strong>Réponse correcte :</strong> {{ correctAnswerText }}</p>
          <p v-if="explanation" class="explanation">{{ explanation }}</p>
          <p v-if="!verifiedAnswerCorrect && userAnswerText" class="user-answer">
            <em>Vous avez choisi : {{ userAnswerText }}</em>
          </p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.feedback-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
  margin-bottom: var(--space-lg);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.feedback-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.feedback-header {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.feedback-icon {
  font-size: 1.5rem;
}

.feedback-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--color-text);
}

.feedback-body {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.correct-answer {
  color: var(--color-success);
  font-size: 1rem;
}

.explanation {
  color: var(--color-text);
  font-size: 0.95rem;
  line-height: 1.6;
  padding: var(--space-sm);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-sm);
  border-left: 3px solid var(--color-success);
}

.user-answer {
  color: var(--color-warning);
  font-size: 0.9rem;
}

.correct-icon {
  color: var(--color-success);
}

.incorrect-icon {
  color: var(--color-warning);
}
</style>
