<script setup lang="ts">
import { computed } from 'vue'
import { ItButton } from '@infinitylib/infinity-theme-vue'
import { ItCardActions } from '@/components/itheme'

interface Props {
  hasPreviousQuestion: boolean
  hasNextQuestion: boolean
  canSkip: boolean
  remainingSkips: number | null
  hasFeedbackEnabled: boolean
  isCurrentQuestionVerified: boolean
  selectedAnswer: number | null
  hasTimeLimit: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  previous: []
  skip: []
  verify: []
  continue: []
  submit: []
}>()

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
  <ItCardActions justify="between" class="quiz-question-actions">
    <ItButton
      variant="secondary"
      :disabled="!hasPreviousQuestion || hasTimeLimit"
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
</template>
