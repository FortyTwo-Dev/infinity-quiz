<script setup lang="ts">
import type { Question } from '@/types'
import type { QuestionOption } from '@/composables/useQuiz'
import { DButton, DCardTitle, DCard, DCardBody, DCardActions } from '@/components/daisy-ui'
import type { ColorVariant } from '@/components/daisy-ui/types'
import { LGrid } from '@/components/layout'

interface Props {
  question: Question
  questionOptions: QuestionOption[]
  selectedAnswer: number | null
  isAnswerVerified: boolean
  isCurrentQuestionVerified: boolean
  hasPreviousQuestion: boolean
  hasNextQuestion: boolean
  canSkip: boolean
  remainingSkips: number | null
  hasFeedbackEnabled: boolean
}

const props = defineProps<Props>()

interface Emits {
  (e: 'select', answerIndex: number): void
  (e: 'previous'): void
  (e: 'skip'): void
  (e: 'verify'): void
  (e: 'continue'): void
  (e: 'submit'): void
}

const emit = defineEmits<Emits>()

const isCorrectAnswer = (originalIndex: number): boolean => {
  return originalIndex === props.question.correctAnswerIndex
}

const isOptionSelected = (originalIndex: number): boolean => {
  return props.selectedAnswer === originalIndex
}

const getButtonVariant = (originalIndex: number): ColorVariant => {
  if (!props.isAnswerVerified) {
    return 'ghost'
  }
  if (isCorrectAnswer(originalIndex)) {
    return 'success'
  }
  if (isOptionSelected(originalIndex) && !isCorrectAnswer(originalIndex)) {
    return 'error'
  }
  return 'neutral'
}
</script>

<template>
  <DCard border size="lg" class="bg-base-100 w-full">
    <DCardBody padding="lg" class="gap-4">
      <DCardTitle>{{ question.text }}</DCardTitle>

      <LGrid as="div" cols="1 md:2 lg:3" gap="4">
        <DButton
          v-for="(item, displayIndex) in questionOptions"
          :key="displayIndex"
          as="input-radio"
          :name="question.options[displayIndex]"
          :value="item.originalIndex"
          :checked="selectedAnswer === item.originalIndex"
          :disabled="
            isCurrentQuestionVerified &&
            !isCorrectAnswer(item.originalIndex) &&
            !isOptionSelected(item.originalIndex)
          "
          :variant="getButtonVariant(item.originalIndex)"
          size="md"
          class="w-full"
          @change="!isCurrentQuestionVerified ? emit('select', item.originalIndex) : null"
        />
      </LGrid>

      <div class="divider"></div>

      <DCardActions justify="between" class="mt-0">
        <DButton
          variant="accent"
          size="md"
          :disabled="!hasPreviousQuestion || props.question.timeLimit !== undefined"
          @click="emit('previous')"
          class="flex-1"
        >
          Précédent
        </DButton>
        <DButton
          v-if="canSkip"
          variant="ghost"
          size="md"
          :disabled="!canSkip"
          @click="emit('skip')"
          class="flex-1"
        >
          Sauter{{ remainingSkips !== null ? ` (${remainingSkips})` : '' }}
        </DButton>
        <DButton
          variant="primary"
          size="md"
          :disabled="
            hasFeedbackEnabled
              ? selectedAnswer === null && !isCurrentQuestionVerified
              : selectedAnswer === null
          "
          @click="
            hasFeedbackEnabled && !isCurrentQuestionVerified
              ? emit('verify')
              : hasFeedbackEnabled
                ? emit('continue')
                : emit('submit')
          "
          class="flex-1"
        >
          {{
            hasFeedbackEnabled && !isCurrentQuestionVerified && selectedAnswer !== null
              ? 'Vérifier'
              : hasNextQuestion
                ? 'Suivant'
                : 'Terminer'
          }}
        </DButton>
      </DCardActions>
    </DCardBody>
  </DCard>
</template>
