<script setup lang="ts">
import { computed } from 'vue'
import { DBadge } from '@/components/daisy-ui'
import { DCard, DCardBody, DCardTitle } from '@/components/daisy-ui/card'
import type { QuizFormValues } from '@/utils/validation'

interface Props {
  values: QuizFormValues
}

const props = defineProps<Props>()

const optionLetters = 'ABCD'

interface SettingRow {
  label: string
  value: string
}

const settings = computed<SettingRow[]>(() => [
  { label: 'Time limit', value: props.values.timeLimit ? `${props.values.timeLimit}s` : 'None' },
  {
    label: 'Max skips',
    value: props.values.maxSkips !== undefined ? String(props.values.maxSkips) : 'Unlimited',
  },
  { label: 'Shuffle questions', value: props.values.shuffleQuestions ? 'Yes' : 'No' },
  { label: 'Shuffle answers', value: props.values.shuffleAnswers ? 'Yes' : 'No' },
  { label: 'Review mode', value: props.values.enableReviewMode ? 'Yes' : 'No' },
  { label: 'Immediate feedback', value: props.values.feedbackEnabled ? 'Yes' : 'No' },
])
</script>

<template>
  <div class="flex flex-col gap-4 w-full">
    <DCard border class="bg-base-100 w-full">
      <DCardBody padding="lg" class="gap-3">
        <DCardTitle tag="h2" size="lg">Summary</DCardTitle>
        <h3 class="text-xl font-semibold">{{ values.title }}</h3>
        <p class="text-base-content/70">{{ values.description }}</p>

        <div class="flex flex-wrap gap-2 items-center">
          <DBadge soft variant="primary" class="uppercase font-bold">
            {{ values.category || 'Uncategorized' }}
          </DBadge>
          <DBadge v-for="tag in values.tags" :key="tag" variant="primary" soft>{{ tag }}</DBadge>
        </div>
      </DCardBody>
    </DCard>

    <DCard border class="bg-base-100 w-full">
      <DCardBody padding="lg" class="gap-3">
        <DCardTitle tag="h3" size="md">Settings</DCardTitle>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
          <div v-for="setting in settings" :key="setting.label">
            <div class="text-base-content/60">{{ setting.label }}</div>
            <div class="font-semibold">{{ setting.value }}</div>
          </div>
        </div>
      </DCardBody>
    </DCard>

    <DCard border class="bg-base-100 w-full">
      <DCardBody padding="lg" class="gap-4">
        <DCardTitle tag="h3" size="md">
          Questions ({{ values.questions.length }})
        </DCardTitle>

        <div
          v-for="(question, index) in values.questions"
          :key="index"
          class="flex flex-col gap-2 border-b border-base-200 pb-3 last:border-none"
        >
          <div class="font-medium">{{ index + 1 }}. {{ question.text }}</div>
          <ul class="flex flex-col gap-1 text-sm">
            <li
              v-for="(option, optionIndex) in question.options"
              :key="optionIndex"
              :class="optionIndex === question.correctAnswerIndex ? 'text-success' : ''"
            >
              {{ optionLetters[optionIndex] ?? '?' }}. {{ option }}
              <span v-if="optionIndex === question.correctAnswerIndex"> (correct)</span>
            </li>
          </ul>
        </div>
      </DCardBody>
    </DCard>
  </div>
</template>
