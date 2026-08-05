<script setup lang="ts">
import type { QuestionResult } from '@/types'
import { PhCheckCircle, PhXCircle, PhArrowClockwise } from '@phosphor-icons/vue'

interface Props {
  questionResult: QuestionResult
  showFeedback?: boolean
}

const props = defineProps<Props>()

const { questionResult, showFeedback = true } = props

const { question, userAnswer, isCorrect, isSkipped } = questionResult

// Determine the status for display
const getStatus = () => {
  if (isSkipped) return 'skipped'
  if (isCorrect) return 'correct'
  return 'incorrect'
}

const getStatusLabel = () => {
  if (isSkipped) return 'Sauté'
  if (isCorrect) return 'Correct'
  return 'Incorrect'
}

const getStatusClass = () => {
  if (isSkipped) return 'status-skipped'
  if (isCorrect) return 'status-correct'
  return 'status-incorrect'
}

const getOptionClass = (optionIndex: number) => {
  const classes = []

  if (userAnswer === optionIndex) {
    classes.push('option--selected')
    if (!isSkipped && !isCorrect) {
      classes.push('option--incorrect')
    }
  }

  if (optionIndex === question.correctAnswerIndex) {
    classes.push('option--correct')
  }

  return classes
}
</script>

<template>
  <div class="question-review-card" :class="getStatusClass()">
    <div class="question-header">
      <span class="status-badge" :class="`status-badge--${getStatus()}`">
        <PhCheckCircle v-if="isCorrect" :size="16" weight="fill" />
        <PhXCircle v-else-if="!isSkipped" :size="16" weight="fill" />
        <PhArrowClockwise v-else :size="16" weight="fill" />
        <span class="status-label">{{ getStatusLabel() }}</span>
      </span>
      <h3>{{ question.text }}</h3>
    </div>

    <div class="options">
      <div
        v-for="(option, index) in question.options"
        :key="index"
        class="option"
        :class="getOptionClass(index)"
      >
        <span class="option-letter">{{ String.fromCharCode(65 + index) }}.</span>
        <span class="option-text">{{ option }}</span>
      </div>
    </div>

    <div v-if="showFeedback && !isSkipped && !isCorrect" class="feedback">
      <PhCheckCircle :size="16" weight="fill" class="feedback-icon" />
      <p>La bonne réponse était : <strong>{{ question.options[question.correctAnswerIndex] }}</strong></p>
    </div>
  </div>
</template>

<style scoped>
.question-review-card {
  background: var(--color-bg-card);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  margin-bottom: var(--space-md);
  transition: all var(--transition-normal);
}

.question-review-card.status-correct {
  border-color: var(--color-success);
  background: var(--color-success-light);
}

.question-review-card.status-incorrect {
  border-color: var(--color-danger);
  background: var(--color-danger-light);
}

.question-review-card.status-skipped {
  border-color: var(--color-warning);
  background: var(--color-warning-light);
  opacity: 0.85;
}

.question-header {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: var(--space-md);
}

.question-header h3 {
  margin: 0;
  color: var(--color-text);
  flex: 1;
  font-size: 1.1rem;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  font-weight: bold;
  text-transform: uppercase;
}

.status-label {
  line-height: 1;
}

.status-badge--correct {
  background: var(--color-success);
  color: white;
}

.status-badge--incorrect {
  background: var(--color-danger);
  color: white;
}

.status-badge--skipped {
  background: var(--color-warning);
  color: var(--color-text);
}

.options {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.option {
  padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  transition: all var(--transition-fast);
}

.option--selected {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
  font-weight: bold;
}

.option--correct {
  border-color: var(--color-success);
  background: var(--color-success-light);
}

.option--incorrect {
  border-color: var(--color-danger);
  background: var(--color-danger-light);
}

.option-letter {
  font-weight: bold;
  color: var(--color-text-secondary);
  min-width: 24px;
}

.option-text {
  color: var(--color-text);
}

.feedback {
  display: flex;
  align-items: flex-start;
  gap: var(--space-sm);
  margin-top: var(--space-sm);
  padding: var(--space-sm);
  background: var(--color-bg);
  border-radius: var(--radius-sm);
  border-left: 3px solid var(--color-primary);
}

.feedback-icon {
  color: var(--color-success);
  flex-shrink: 0;
  margin-top: 2px;
}

.feedback p {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
}

.feedback strong {
  color: var(--color-success);
}
</style>
