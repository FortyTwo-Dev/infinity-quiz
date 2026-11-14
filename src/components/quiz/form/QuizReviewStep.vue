<script setup lang="ts">
import { computed } from 'vue'
import { ItBadge, ItCard, ItCardBody, ItCardTitle } from '@/components/itheme'
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
  { label: 'Theme', value: props.values.theme ?? 'Default' },
])
</script>

<template>
  <div class="quiz-review-step">
    <ItCard border class="quiz-form-card">
      <ItCardBody size="lg">
        <ItCardTitle as="h2" size="lg">Summary</ItCardTitle>
        <h3 class="quiz-review-title">{{ values.title }}</h3>
        <p class="quiz-review-description">{{ values.description }}</p>

        <div class="quiz-review-badges">
          <ItBadge variant="primary" soft class="quiz-review-category">
            {{ values.category || 'Uncategorized' }}
          </ItBadge>
          <ItBadge v-for="tag in values.tags" :key="tag" variant="primary" soft>{{ tag }}</ItBadge>
        </div>
      </ItCardBody>
    </ItCard>

    <ItCard border class="quiz-form-card">
      <ItCardBody size="lg">
        <ItCardTitle as="h3">Settings</ItCardTitle>
        <dl class="quiz-review-settings">
          <div v-for="setting in settings" :key="setting.label">
            <dt>{{ setting.label }}</dt>
            <dd>{{ setting.value }}</dd>
          </div>
        </dl>
      </ItCardBody>
    </ItCard>

    <ItCard border class="quiz-form-card">
      <ItCardBody size="lg">
        <ItCardTitle as="h3">Questions ({{ values.questions.length }})</ItCardTitle>

        <div
          v-for="(question, index) in values.questions"
          :key="index"
          class="quiz-review-question"
        >
          <div class="quiz-review-question-title">{{ index + 1 }}. {{ question.text }}</div>
          <ul class="quiz-review-options">
            <li
              v-for="(option, optionIndex) in question.options"
              :key="optionIndex"
              :class="{ 'quiz-review-option-correct': optionIndex === question.correctAnswerIndex }"
            >
              {{ optionLetters[optionIndex] ?? '?' }}. {{ option }}
              <span v-if="optionIndex === question.correctAnswerIndex"> (correct)</span>
            </li>
          </ul>
        </div>
      </ItCardBody>
    </ItCard>
  </div>
</template>
