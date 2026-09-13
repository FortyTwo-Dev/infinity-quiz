<script setup lang="ts">
import type { QuestionResult } from '@/types'
import { DBadge } from '@/components/daisy-ui'
import { DCard, DCardBody } from '@/components/daisy-ui/card'
import { PhCheckCircle, PhXCircle, PhArrowClockwise } from '@phosphor-icons/vue'

interface Props {
  questionResult: QuestionResult
  showFeedback?: boolean
}

const props = defineProps<Props>()

const { questionResult, showFeedback = true } = props

const { question, userAnswer, isCorrect, isSkipped } = questionResult

// Determine the status for display
const getStatusVariant = () => {
  if (isSkipped) return 'warning'
  if (isCorrect) return 'success'
  return 'error'
}

const getStatusLabel = () => {
  if (isSkipped) return 'Sauté'
  if (isCorrect) return 'Correct'
  return 'Incorrect'
}

const getStatusIcon = () => {
  if (isCorrect) return PhCheckCircle
  if (isSkipped) return PhArrowClockwise
  return PhXCircle
}

const isOptionSelected = (optionIndex: number) => {
  return userAnswer === optionIndex
}

const isOptionCorrect = (optionIndex: number) => {
  return optionIndex === question.correctAnswerIndex
}
</script>

<template>
  <DCard
    size="md"
    class="mb-4 transition-all duration-200"
    :class="{
      'border-2 border-success bg-base-300': isCorrect && !isSkipped,
      'border-2 border-error bg-error/10': !isCorrect && !isSkipped,
      'border-2 border-warning bg-warning/10 opacity-85': isSkipped,
    }"
  >
    <DCardBody padding="md">
      <!-- Header with status badge -->
      <div class="flex items-center gap-3 mb-4">
        <DBadge :variant="getStatusVariant()" size="sm" class="inline-flex items-center">
          <component :is="getStatusIcon()" :size="14" weight="fill" class="mr-1" />
          <span>{{ getStatusLabel() }}</span>
        </DBadge>
        <h3 class="m-0 text-lg flex-1 truncate">{{ question.text }}</h3>
      </div>

      <!-- Options -->
      <div class="space-y-2">
        <div
          v-for="(option, index) in question.options"
          :key="index"
          class="flex items-center gap-2 p-2 rounded transition-all cursor-default"
          :class="{
            'border-2 border-success bg-success/10': isOptionCorrect(index),
            'border-2 border-error bg-error/10':
              isOptionSelected(index) && !isOptionCorrect(index) && !isSkipped,
            'border border-primary bg-primary/10 font-bold':
              isOptionSelected(index) && !isSkipped && !isCorrect,
            'border border-base-300': !isOptionSelected(index) && !isOptionCorrect(index),
          }"
        >
          <span
            class="font-bold min-w-[24px] inline-flex items-center justify-center"
            :class="{
              'text-success': isOptionCorrect(index),
              'text-error': isOptionSelected(index) && !isOptionCorrect(index) && !isSkipped,
              'text-primary': isOptionSelected(index) && !isSkipped,
              'text-base-content/60': !isOptionSelected(index) && !isOptionCorrect(index),
            }"
          >
            {{ String.fromCharCode(65 + index) }}.
          </span>
          <span
            class="flex-1 break-words"
            :class="{
              'text-success': isOptionCorrect(index),
              'text-error': isOptionSelected(index) && !isOptionCorrect(index) && !isSkipped,
            }"
          >
            {{ option }}
          </span>
        </div>
      </div>

      <!-- Feedback for incorrect answers -->
      <div
        v-if="showFeedback && !isSkipped && !isCorrect"
        class="alert alert-success mt-3 text-sm inline-flex items-center gap-1"
      >
        <PhCheckCircle :size="16" weight="fill" />
        <span>
          La bonne réponse était :
          <strong>{{ question.options[question.correctAnswerIndex] }}</strong>
        </span>
      </div>
    </DCardBody>
  </DCard>
</template>
