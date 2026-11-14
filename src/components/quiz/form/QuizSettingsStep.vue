<script setup lang="ts">
import { Field } from 'vee-validate'
import { ItCard, ItCardBody, ItCardTitle } from '@/components/itheme'
import { ItCheckbox, ItField, ItInput } from '@infinitylib/infinity-theme-vue'

const checkboxes = [
  { name: 'shuffleQuestions', label: 'Shuffle questions' },
  { name: 'shuffleAnswers', label: 'Shuffle all answers' },
  { name: 'enableReviewMode', label: 'Enable review mode at the end' },
  { name: 'feedbackEnabled', label: 'Show immediate feedback after each answer' },
] as const
</script>

<template>
  <ItCard border class="quiz-form-card">
    <ItCardBody size="lg">
      <ItCardTitle as="h2" size="lg">Quiz settings</ItCardTitle>

      <div class="quiz-settings-grid">
        <Field v-slot="{ field, errorMessage }" name="timeLimit">
          <ItField
            label="Time limit (seconds, optional)"
            html-for="quiz-time-limit"
            :error="errorMessage"
          >
            <ItInput
              id="quiz-time-limit"
              type="number"
              :model-value="field.value ?? ''"
              :invalid="!!errorMessage"
              placeholder="No global limit"
              @update:model-value="field.onChange"
              @blur="field.onBlur"
            />
          </ItField>
        </Field>

        <Field v-slot="{ field, errorMessage }" name="maxSkips">
          <ItField label="Maximum skips (optional)" html-for="quiz-max-skips" :error="errorMessage">
            <ItInput
              id="quiz-max-skips"
              type="number"
              :model-value="field.value ?? ''"
              :invalid="!!errorMessage"
              placeholder="Unlimited"
              @update:model-value="field.onChange"
              @blur="field.onBlur"
            />
          </ItField>
        </Field>
      </div>

      <div class="quiz-checkbox-list">
        <Field
          v-for="checkbox in checkboxes"
          :key="checkbox.name"
          v-slot="{ field }"
          :name="checkbox.name"
        >
          <ItCheckbox
            :id="`quiz-${checkbox.name}`"
            :label="checkbox.label"
            :model-value="field.value"
            @update:model-value="field.onChange"
          />
        </Field>
      </div>
    </ItCardBody>
  </ItCard>
</template>
