<script setup lang="ts">
import { ref, computed } from 'vue'
import { ItBadge, ItDialog } from '@/components/itheme'
import { ItButton } from '@infinitylib/infinity-theme-vue'
import {
  ATTEMPT_STATUS_COLORS,
  ATTEMPT_STATUS_LABELS,
  type AttemptStatus,
} from '@/composables/useAttempt'
import type { WidgetVariant } from '@/components/itheme'

interface Props {
  title: string
  description: string
  primaryTag?: string
  tags?: string[]
  status?: AttemptStatus
  questionCount?: number
  timeLimit?: number
  hasIndividualQuestionTimeLimits?: boolean
  shuffleQuestions?: boolean
  shuffleAnswers?: boolean
  maxSkips?: number
  enableReviewMode?: boolean
  feedbackEnabled?: boolean
}

const props = defineProps<Props>()

const statusLabel = computed(() => (props.status ? ATTEMPT_STATUS_LABELS[props.status] : ''))

const statusVariant = computed<WidgetVariant>(() => {
  const color = props.status ? ATTEMPT_STATUS_COLORS[props.status] : 'neutral'
  return color === 'error' ? 'danger' : color
})

const isOpen = ref(false)

function open() {
  isOpen.value = true
}

function close() {
  isOpen.value = false
}

defineExpose({ open, close })
</script>

<template>
  <ItDialog :open="isOpen" labelled-by="quiz-info-title" class="quiz-info-dialog" @close="close">
    <h2 id="quiz-info-title" class="it-h3">{{ title }}</h2>
    <p class="quiz-info-description">{{ description }}</p>

    <section v-if="primaryTag || (tags && tags.length > 0)" class="quiz-info-section">
      <h3 class="quiz-info-heading">Category &amp; tags</h3>
      <div class="quiz-info-row">
        <ItBadge v-if="primaryTag" variant="primary" class="quiz-info-tag-strong">
          {{ primaryTag }}
        </ItBadge>
        <ItBadge v-for="tag in tags" :key="tag" variant="primary" soft>{{ tag }}</ItBadge>
      </div>
    </section>

    <section class="quiz-info-section">
      <h3 class="quiz-info-heading">Statistics</h3>
      <dl class="quiz-info-stats">
        <div class="quiz-info-stat">
          <dt>Questions</dt>
          <dd>{{ questionCount ?? 0 }}</dd>
        </div>
        <div class="quiz-info-stat">
          <dt>Time limit</dt>
          <dd>{{ timeLimit !== undefined ? `${timeLimit}s` : 'None' }}</dd>
        </div>
        <div class="quiz-info-stat">
          <dt>Max skips</dt>
          <dd>{{ maxSkips ?? 'Unlimited' }}</dd>
        </div>
      </dl>
    </section>

    <section class="quiz-info-section">
      <h3 class="quiz-info-heading">Options</h3>
      <div class="quiz-info-row">
        <ItBadge :variant="hasIndividualQuestionTimeLimits ? 'success' : 'danger'" soft>
          Per-question time limits: {{ hasIndividualQuestionTimeLimits ? 'Yes' : 'No' }}
        </ItBadge>
        <ItBadge :variant="shuffleQuestions ? 'success' : 'danger'" soft>
          Questions shuffled: {{ shuffleQuestions ? 'Yes' : 'No' }}
        </ItBadge>
        <ItBadge :variant="shuffleAnswers ? 'success' : 'danger'" soft>
          Answers shuffled: {{ shuffleAnswers ? 'Yes' : 'No' }}
        </ItBadge>
        <ItBadge :variant="enableReviewMode ? 'success' : 'danger'" soft>
          Review mode: {{ enableReviewMode ? 'Yes' : 'No' }}
        </ItBadge>
        <ItBadge :variant="feedbackEnabled ? 'success' : 'danger'" soft>
          Feedback enabled: {{ feedbackEnabled ? 'Yes' : 'No' }}
        </ItBadge>
      </div>
    </section>

    <section v-if="props.status" class="quiz-info-section">
      <h3 class="quiz-info-heading">Quiz status</h3>
      <ItBadge :variant="statusVariant">{{ statusLabel }}</ItBadge>
    </section>

    <div class="it-dialog-actions">
      <ItButton @click="close">Close</ItButton>
    </div>
  </ItDialog>
</template>
