<script setup lang="ts">
import { computed } from 'vue'
import { PhCheckCircle, PhXCircle } from '@phosphor-icons/vue'
import { ItAlert, ItCard, ItCardBody } from '@/components/itheme'
import { useQuizSessionStore, useQuizVerificationStore } from '../../../stores'
import { MarkdownContent } from '../content'

const sessionStore = useQuizSessionStore()
const verificationStore = useQuizVerificationStore()

const currentQuestion = computed(() => sessionStore.currentQuestion)
const verifiedAnswerCorrect = computed(() => verificationStore.verifiedAnswerCorrect)
const shouldShowFeedback = computed(() => verificationStore.shouldShowFeedback)

const correctAnswerText = computed(() => {
  const question = currentQuestion.value
  if (!question) return ''
  return question.options[question.correctAnswerIndex] ?? ''
})

const explanation = computed(() => {
  const question = currentQuestion.value
  if (!question) return ''
  return question.explanation || ''
})

const userAnswerIndex = computed(() => {
  const question = currentQuestion.value
  if (!question) return null
  return sessionStore.getAnswerForQuestion(question.id)
})

const userAnswerText = computed(() => {
  const question = currentQuestion.value
  const answerIndex = userAnswerIndex.value
  if (!question || answerIndex === null) return ''
  return question.options[answerIndex] ?? ''
})
</script>

<template>
  <Transition name="quiz-feedback">
    <ItCard v-if="shouldShowFeedback" border class="quiz-feedback-card">
      <ItCardBody size="lg">
        <p class="quiz-feedback-head">
          <PhCheckCircle v-if="verifiedAnswerCorrect" :size="24" weight="fill" />
          <PhXCircle v-else :size="24" weight="fill" />
          <span>{{ verifiedAnswerCorrect ? 'Correct!' : 'Almost…' }}</span>
        </p>

        <p class="quiz-feedback-answer"><strong>Correct answer:</strong> {{ correctAnswerText }}</p>

        <ItAlert v-if="explanation" variant="info">
          <div class="it-alert-body">
            <MarkdownContent :source="explanation" />
          </div>
        </ItAlert>

        <p v-if="!verifiedAnswerCorrect && userAnswerText" class="quiz-feedback-chosen">
          You chose: {{ userAnswerText }}
        </p>
      </ItCardBody>
    </ItCard>
  </Transition>
</template>
