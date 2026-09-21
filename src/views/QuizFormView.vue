<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { DButton, DStep, DSteps } from '@/components/daisy-ui'
import { LContainer, LFlex } from '@/components/layout'
import { useQuizManagement } from '@/composables/useQuizManagement'
import { useQuizForm } from '@/composables/useQuizForm'
import {
  QuizGeneralStep,
  QuizQuestionsStep,
  QuizSettingsStep,
  QuizReviewStep,
} from '@/components/quiz/form'

const route = useRoute()
const quizId = computed(() => route.params.quizId as string | undefined)

const {
  values,
  currentStep,
  currentStepIndex,
  stepCount,
  isFirstStep,
  isLastStep,
  goToNextStep,
  goToPreviousStep,
  questionFields,
  addQuestion,
  removeQuestionAt,
  tagSuggestions,
  addTag,
  removeTag,
  submit,
  isEditing,
} = useQuizForm(quizId.value)

const { navigateToImportExport } = useQuizManagement()

const STEP_LABELS = ['General', 'Questions', 'Settings', 'Review'] as const

const heading = computed(() => (isEditing.value ? 'Edit quiz' : 'Create a quiz'))

async function handleNext() {
  await goToNextStep()
}
</script>

<template>
  <LContainer as="section" size="4xl" padding="md" centered>
    <LFlex as="header" align="center" justify="between" class="mb-6">
      <div>
        <h1 class="text-base-content text-2xl font-bold">{{ heading }}</h1>
        <p class="text-base-content/70">Step {{ currentStepIndex + 1 }} of {{ stepCount }}</p>
      </div>
    </LFlex>

    <DSteps class="mb-6">
      <DStep
        v-for="(label, index) in STEP_LABELS"
        :key="label"
        :content="String(index + 1)"
        :color="index <= currentStepIndex ? 'primary' : undefined"
      >
        {{ label }}
      </DStep>
    </DSteps>

    <form class="flex flex-col gap-6" @submit.prevent="submit">
      <QuizGeneralStep
        v-if="currentStep === 'general'"
        :tag-suggestions="tagSuggestions"
        @add-tag="addTag"
        @remove-tag="removeTag"
      />

      <QuizQuestionsStep
        v-else-if="currentStep === 'questions'"
        :question-count="questionFields.length"
        @add="addQuestion"
        @remove="removeQuestionAt"
      />

      <QuizSettingsStep v-else-if="currentStep === 'settings'" />

      <QuizReviewStep v-else :values="values" />

      <div class="flex justify-between gap-4">
        <DButton
          type="button"
          variant="ghost"
          size="md"
          :disabled="isFirstStep"
          @click="goToPreviousStep"
        >
          Previous
        </DButton>

        <div class="flex gap-4">
          <DButton
            type="button"
            variant="secondary"
            size="md"
            @click="navigateToImportExport"
          >
            Import / Export
          </DButton>

          <DButton v-if="!isLastStep" type="button" variant="primary" size="md" @click="handleNext">
            Next
          </DButton>
          <DButton v-else type="submit" variant="primary" size="md">
            {{ isEditing ? 'Save changes' : 'Create quiz' }}
          </DButton>
        </div>
      </div>
    </form>
  </LContainer>
</template>
