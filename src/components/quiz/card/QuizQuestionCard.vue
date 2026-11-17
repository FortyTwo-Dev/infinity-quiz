<script setup lang="ts">
import { ItCard, ItCardBody, ItCardTitle } from '@/components/itheme'
import type { Question } from '@/types'
import type { QuestionOption } from '@/composables/useQuiz'
import { MarkdownContent } from '../content'

interface Props {
  question: Question
  questionOptions: QuestionOption[]
  selectedAnswer: number | null
  isAnswerVerified: boolean
  isCurrentQuestionVerified: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{ select: [answerIndex: number] }>()

/** The state of an option is a single value, so the template stays declarative. */
function optionState(originalIndex: number): string {
  if (!props.isAnswerVerified) {
    return props.selectedAnswer === originalIndex ? 'selected' : 'plain'
  }
  if (originalIndex === props.question.correctAnswerIndex) return 'correct'
  if (props.selectedAnswer === originalIndex) return 'wrong'
  return 'plain'
}
</script>

<template>
  <ItCard border class="quiz-question-card">
    <ItCardBody size="lg">
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
    </ItCardBody>
  </ItCard>
</template>
