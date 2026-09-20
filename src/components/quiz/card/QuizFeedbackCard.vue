<script setup lang="ts">
import { computed } from 'vue'
import { useQuizSessionStore, useQuizVerificationStore } from '../../../stores'
import { DCard, DCardBody } from '@/components/daisy-ui/card'
import { PhCheckCircle, PhXCircle } from '@phosphor-icons/vue'

const sessionStore = useQuizSessionStore()
const verificationStore = useQuizVerificationStore()

const currentQuestion = computed(() => sessionStore.currentQuestion)
const verifiedAnswerCorrect = computed(() => verificationStore.verifiedAnswerCorrect)
const shouldShowFeedback = computed(() => verificationStore.shouldShowFeedback)

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
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 -translate-y-2.5"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition-all duration-300 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 -translate-y-2.5"
  >
    <DCard v-if="shouldShowFeedback" size="lg" class="mb-6 bg-base-100" border>
      <DCardBody padding="lg">
        <!-- Header with icon -->
        <div class="flex items-center gap-3 mb-4">
          <PhCheckCircle
            v-if="verifiedAnswerCorrect"
            :size="24"
            weight="fill"
            class="text-success"
          />
          <PhXCircle v-else :size="24" weight="fill" class="text-warning" />
          <span class="text-xl font-bold">
            {{ verifiedAnswerCorrect ? 'Correct!' : 'Almost...' }}
          </span>
        </div>

        <!-- Body content -->
        <div class="space-y-3">
          <p class="text-success font-medium">
            <strong>Correct answer:</strong> {{ correctAnswerText }}
          </p>

          <div v-if="explanation" class="alert alert-success text-sm">
            <span>{{ explanation }}</span>
          </div>

          <p v-if="!verifiedAnswerCorrect && userAnswerText" class="text-warning">
            <em>You chose: {{ userAnswerText }}</em>
          </p>
        </div>
      </DCardBody>
    </DCard>
  </Transition>
</template>
