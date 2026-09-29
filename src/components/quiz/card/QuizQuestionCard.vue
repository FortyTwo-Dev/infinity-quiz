<script setup lang="ts">
import type { Question } from '@/types'
import type { QuestionOption } from '@/composables/useQuiz'
import {
  DButton,
  DRadio,
  DLabel,
  DCardTitle,
  DCard,
  DCardBody,
  DCardActions,
} from '@/components/daisy-ui'
import type { RadioVariant } from '@/components/daisy-ui/types'
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

const getRadioVariant = (originalIndex: number): RadioVariant | undefined => {
  if (!props.isAnswerVerified) {
    return undefined
  }
  if (isCorrectAnswer(originalIndex)) {
    return 'success'
  }
  if (isOptionSelected(originalIndex) && !isCorrectAnswer(originalIndex)) {
    return 'error'
  }
  return undefined
}
</script>

<template>
  <DCard border size="lg" class="bg-base-100 w-full">
    <DCardBody padding="lg" class="gap-4">
      <DCardTitle>{{ question.text }}</DCardTitle>

      <LGrid as="div" cols="1 md:2 lg:3" gap="4">
        <DLabel v-for="(item, displayIndex) in questionOptions" :key="displayIndex" class="p-2 bg-base-200">
          <DRadio
            :name="question.id"
            :value="item.originalIndex"
            :checked="selectedAnswer === item.originalIndex"
            :disabled="
              isCurrentQuestionVerified &&
              !isCorrectAnswer(item.originalIndex) &&
              !isOptionSelected(item.originalIndex)
            "
            :variant="getRadioVariant(item.originalIndex)"
            size="xs"
            @change="!isCurrentQuestionVerified ? emit('select', item.originalIndex) : null"
          />
          <span class="text-base-content">{{ item.option }}</span>
        </DLabel>
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
          Previous
        </DButton>
        <DButton
          v-if="canSkip"
          variant="ghost"
          size="md"
          :disabled="!canSkip"
          @click="emit('skip')"
          class="flex-1"
        >
          Skip{{ remainingSkips !== null ? ` (${remainingSkips})` : '' }}
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
              ? 'Check'
              : hasNextQuestion
                ? 'Next'
                : 'Finish'
          }}
        </DButton>
      </DCardActions>
    </DCardBody>
  </DCard>
</template>
