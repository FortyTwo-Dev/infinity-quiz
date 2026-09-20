<script setup lang="ts">
import { ref, computed } from 'vue'
import { DModal, DModalBox, DModalActions, DModalBackdrop } from '@/components/daisy-ui/modal'
import { DBadge } from '@/components/daisy-ui'
import {
  ATTEMPT_STATUS_COLORS,
  ATTEMPT_STATUS_LABELS,
  type AttemptStatus,
} from '@/composables/useAttempt'

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

const statusColor = computed(() => (props.status ? ATTEMPT_STATUS_COLORS[props.status] : 'neutral'))

const modal = ref<InstanceType<typeof DModal> | null>(null)

function open() {
  modal.value?.open()
}

function close() {
  modal.value?.close()
}

defineExpose({
  open,
  close,
})
</script>

<template>
  <DModal ref="modal">
    <DModalBackdrop />
    <DModalBox class="max-w-2xl w-full">
      <h3 class="text-lg font-bold mb-4">{{ title }}</h3>
      <p class="text-base-content/80 mb-6">{{ description }}</p>

      <div class="space-y-6">
        <!-- Category and Tags -->
        <section v-if="primaryTag || (tags && tags.length > 0)">
          <h4 class="text-sm font-medium text-base-content mb-2">Category & Tags</h4>
          <div class="flex flex-wrap gap-2">
            <DBadge v-if="primaryTag" variant="primary" class="uppercase font-bold text-nowrap">
              {{ primaryTag }}
            </DBadge>
            <DBadge v-for="tag in tags" :key="tag" variant="primary" soft class="text-nowrap">
              {{ tag }}
            </DBadge>
          </div>
        </section>

        <!-- Quiz Statistics -->
        <section>
          <h4 class="text-sm font-medium text-base-content mb-2">Statistics</h4>
          <div class="grid grid-cols-3 gap-4 text-sm">
            <div class="flex items-center gap-2">
              <span class="text-base-content/60">Questions:</span>
              <span class="font-semibold">{{ questionCount ?? 0 }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-base-content/60">Time Limit:</span>
              <span class="font-semibold">{{
                timeLimit !== undefined ? `${timeLimit}s` : 'None'
              }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-base-content/60">Max Skips:</span>
              <span class="font-semibold">{{ maxSkips ?? 'Unlimited' }}</span>
            </div>
          </div>
        </section>

        <!-- Quiz Options -->
        <section>
          <h4 class="text-sm font-medium text-base-content mb-2">Options</h4>
          <div class="flex flex-wrap gap-2">
            <DBadge :variant="hasIndividualQuestionTimeLimits ? 'success' : 'error'" soft>
              <span class="text-xs"
                >Per-Question Time Limits:
                {{ hasIndividualQuestionTimeLimits ? 'Yes' : 'No' }}</span
              >
            </DBadge>
            <DBadge :variant="shuffleQuestions ? 'success' : 'error'" soft>
              <span class="text-xs">Questions Shuffled: {{ shuffleQuestions ? 'Yes' : 'No' }}</span>
            </DBadge>
            <DBadge :variant="shuffleAnswers ? 'success' : 'error'" soft>
              <span class="text-xs">Answers Shuffled: {{ shuffleAnswers ? 'Yes' : 'No' }}</span>
            </DBadge>
            <DBadge :variant="enableReviewMode ? 'success' : 'error'" soft>
              <span class="text-xs">Review Mode: {{ enableReviewMode ? 'Yes' : 'No' }}</span>
            </DBadge>
            <DBadge :variant="feedbackEnabled ? 'success' : 'error'" soft>
              <span class="text-xs">Feedback Enabled: {{ feedbackEnabled ? 'Yes' : 'No' }}</span>
            </DBadge>
          </div>
        </section>

        <!-- Status -->
        <section v-if="props.status">
          <h4 class="text-sm font-medium text-base-content mb-2">Quiz Status</h4>
          <span class="badge" :class="`badge-${statusColor}`">
            {{ statusLabel }}
          </span>
        </section>
      </div>

      <DModalActions>
        <button type="button" class="btn btn-neutral" @click="close">Close</button>
      </DModalActions>
    </DModalBox>
  </DModal>
</template>
