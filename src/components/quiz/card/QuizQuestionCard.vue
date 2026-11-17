<script setup lang="ts">
import { computed } from 'vue'
import { ItCard, ItCardActions, ItCardBody, ItCardTitle } from '@/components/itheme'
import { ItButton } from '@infinitylib/infinity-theme-vue'
import type { Question } from '@/types'
import type { QuestionOption } from '@/composables/useQuiz'
import { MarkdownContent } from '../content'

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

const emit = defineEmits<{
  select: [answerIndex: number]
  previous: []
  skip: []
  verify: []
  continue: []
  submit: []
}>()

/** The state of an option is a single value, so the template stays declarative. */
function optionState(originalIndex: number): string {
  if (!props.isAnswerVerified) {
    return props.selectedAnswer === originalIndex ? 'selected' : 'plain'
  }
  if (originalIndex === props.question.correctAnswerIndex) return 'correct'
  if (props.selectedAnswer === originalIndex) return 'wrong'
  return 'plain'
}

const primaryLabel = computed(() => {
  if (props.hasFeedbackEnabled && !props.isCurrentQuestionVerified && props.selectedAnswer !== null)
    return 'Check'
  return props.hasNextQuestion ? 'Next' : 'Finish'
})

const primaryDisabled = computed(() =>
  props.hasFeedbackEnabled
    ? props.selectedAnswer === null && !props.isCurrentQuestionVerified
    : props.selectedAnswer === null,
)

function handlePrimary() {
  if (props.hasFeedbackEnabled && !props.isCurrentQuestionVerified) emit('verify')
  else if (props.hasFeedbackEnabled) emit('continue')
  else emit('submit')
}
</script>

<template>
  <ItCard border class="quiz-question-card">
    <ItCardBody size="lg">
      <div class="quiz-question-scroll">
        <div class="quiz-question-content">
          <ItCardTitle as="h2" size="lg">{{ question.text }}</ItCardTitle>

          <MarkdownContent
            v-if="question.context"
            class="quiz-question-context"
            role="group"
            aria-label="Question context"
            tabindex="0"
            :source="question.context"
          />

          <fieldset class="quiz-answer-grid">
            <legend class="it-sr-only">Answers</legend>
            <label
              v-for="item in questionOptions"
              :key="item.originalIndex"
              class="quiz-answer"
              :data-state="optionState(item.originalIndex)"
            >
              <input
                type="radio"
                class="it-radio-primary"
                :name="question.id"
                :value="item.originalIndex"
                :checked="selectedAnswer === item.originalIndex"
                :disabled="
                  isCurrentQuestionVerified ||
                  (isAnswerVerified && item.originalIndex !== question.correctAnswerIndex)
                "
                @change="!isCurrentQuestionVerified ? emit('select', item.originalIndex) : null"
              />
              <span>{{ item.option }}</span>
            </label>
          </fieldset>
        </div>
      </div>

      <ItCardActions justify="between" class="quiz-question-actions">
        <ItButton
          variant="secondary"
          :disabled="!hasPreviousQuestion || question.timeLimit !== undefined"
          @click="emit('previous')"
        >
          Previous
        </ItButton>
        <ItButton v-if="canSkip" variant="ghost" :disabled="!canSkip" @click="emit('skip')">
          Skip{{ remainingSkips !== null ? ` (${remainingSkips})` : '' }}
        </ItButton>
        <ItButton variant="primary" :disabled="primaryDisabled" @click="handlePrimary">
          {{ primaryLabel }}
        </ItButton>
      </ItCardActions>
    </ItCardBody>
  </ItCard>
</template>
