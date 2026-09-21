<script setup lang="ts">
import { Field } from 'vee-validate'
import { DCheckbox, DInput, DLabel } from '@/components/daisy-ui'
import { DCard, DCardBody, DCardTitle } from '@/components/daisy-ui/card'
</script>

<template>
  <DCard border class="bg-base-100 w-full">
    <DCardBody padding="lg" class="gap-6">
      <DCardTitle tag="h2" size="lg">Quiz settings</DCardTitle>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field v-slot="{ field, errorMessage }" name="timeLimit">
          <DLabel variant="input" text="Time limit (seconds, optional)" class="w-full">
            <DInput
              type="number"
              :model-value="field.value ?? ''"
              :color="errorMessage ? 'error' : undefined"
              placeholder="No global limit"
              @update:model-value="field.onChange"
              @blur="field.onBlur"
            />
          </DLabel>
          <span v-if="errorMessage" class="text-error text-sm">{{ errorMessage }}</span>
        </Field>

        <Field v-slot="{ field, errorMessage }" name="maxSkips">
          <DLabel variant="input" text="Maximum skips (optional)" class="w-full">
            <DInput
              type="number"
              :model-value="field.value ?? ''"
              :color="errorMessage ? 'error' : undefined"
              placeholder="Unlimited"
              @update:model-value="field.onChange"
              @blur="field.onBlur"
            />
          </DLabel>
          <span v-if="errorMessage" class="text-error text-sm">{{ errorMessage }}</span>
        </Field>
      </div>

      <div class="flex flex-col gap-4">
        <Field v-slot="{ field }" name="shuffleQuestions">
          <label class="flex items-center gap-3 cursor-pointer">
            <DCheckbox :model-value="field.value" @update:model-value="field.onChange" />
            <span>Shuffle questions</span>
          </label>
        </Field>

        <Field v-slot="{ field }" name="shuffleAnswers">
          <label class="flex items-center gap-3 cursor-pointer">
            <DCheckbox :model-value="field.value" @update:model-value="field.onChange" />
            <span>Shuffle all answers</span>
          </label>
        </Field>

        <Field v-slot="{ field }" name="enableReviewMode">
          <label class="flex items-center gap-3 cursor-pointer">
            <DCheckbox :model-value="field.value" @update:model-value="field.onChange" />
            <span>Enable review mode at the end</span>
          </label>
        </Field>

        <Field v-slot="{ field }" name="feedbackEnabled">
          <label class="flex items-center gap-3 cursor-pointer">
            <DCheckbox :model-value="field.value" @update:model-value="field.onChange" />
            <span>Show immediate feedback after each answer</span>
          </label>
        </Field>
      </div>
    </DCardBody>
  </DCard>
</template>
