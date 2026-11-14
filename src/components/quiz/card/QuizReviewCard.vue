<script setup lang="ts">
import { computed } from 'vue'
import { PhCheckCircle, PhXCircle, PhArrowClockwise } from '@phosphor-icons/vue'
import { ItBadge, ItCard, ItCardBody } from '@/components/itheme'
import type { WidgetVariant } from '@/components/itheme'
import type { QuestionResult } from '@/types'

interface Props {
  questionResult: QuestionResult
  showFeedback?: boolean
}

const props = defineProps<Props>()

const showFeedback = computed(() => props.showFeedback ?? true)

const status = computed<{ variant: WidgetVariant; label: string; icon: unknown }>(() => {
  const { isSkipped, isCorrect } = props.questionResult
  if (isSkipped) return { variant: 'warning', label: 'Skipped', icon: PhArrowClockwise }
  if (isCorrect) return { variant: 'success', label: 'Correct', icon: PhCheckCircle }
  return { variant: 'danger', label: 'Incorrect', icon: PhXCircle }
})

function isSelected(optionIndex: number): boolean {
  return props.questionResult.userAnswer === optionIndex
}

function isCorrectOption(optionIndex: number): boolean {
  return optionIndex === props.questionResult.question.correctAnswerIndex
}

/** A row is in one of four states; the state drives the styling, not a stack
 * of conditionals. */
function optionState(optionIndex: number): string {
  const { isSkipped } = props.questionResult
  if (isCorrectOption(optionIndex)) return 'correct'
  if (isSelected(optionIndex) && !isSkipped) return 'wrong'
  if (isSelected(optionIndex)) return 'skipped'
  return 'plain'
}

const correctAnswerText = computed(
  () =>
    props.questionResult.question.options[props.questionResult.question.correctAnswerIndex] ?? '',
)
</script>

<template>
  <ItCard border class="quiz-review-card" :data-state="status.variant">
    <ItCardBody>
      <div class="quiz-review-head">
        <ItBadge :variant="status.variant">
          <component :is="status.icon" :size="14" weight="fill" />
          {{ status.label }}
        </ItBadge>
        <h3 class="quiz-review-question-title">{{ questionResult.question.text }}</h3>
      </div>

      <ul class="quiz-review-answer-list">
        <li
          v-for="(option, index) in questionResult.question.options"
          :key="index"
          class="quiz-review-answer"
          :data-state="optionState(index)"
        >
          <span class="quiz-review-answer-letter">
            {{ String.fromCharCode(65 + index) }}
          </span>
          <span class="quiz-review-answer-text">{{ option }}</span>
        </li>
      </ul>

      <p
        v-if="showFeedback && !questionResult.isSkipped && !questionResult.isCorrect"
        class="quiz-review-correct"
      >
        <PhCheckCircle :size="16" weight="fill" />
        The correct answer was <strong>{{ correctAnswerText }}</strong>
      </p>
    </ItCardBody>
  </ItCard>
</template>
