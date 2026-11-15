<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { ItButton } from '@infinitylib/infinity-theme-vue'
import { ItSteps } from '@/components/itheme'
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

const STEP_LABELS = ['General', 'Questions', 'Settings', 'Review']

const heading = computed(() => (isEditing.value ? 'Edit quiz' : 'Create a quiz'))

async function handleNext() {
  await goToNextStep()
}
</script>

<template>
  <section class="quiz-form-view">
    <header class="quiz-page-header">
      <div>
        <h1 class="quiz-page-title">{{ heading }}</h1>
        <p class="quiz-page-subtitle">Step {{ currentStepIndex + 1 }} of {{ stepCount }}</p>
      </div>
    </header>

    <ItSteps :steps="STEP_LABELS" :current="currentStepIndex" />

    <form class="quiz-form" @submit.prevent="submit">
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

      <div class="quiz-form-footer">
        <ItButton type="button" variant="ghost" :disabled="isFirstStep" @click="goToPreviousStep">
          Previous
        </ItButton>

        <div class="quiz-form-footer-actions">
          <ItButton type="button" variant="secondary" @click="navigateToImportExport">
            Import / Export
          </ItButton>

          <ItButton v-if="!isLastStep" type="button" variant="primary" @click="handleNext">
            Next
          </ItButton>
          <ItButton v-else type="submit" variant="primary">
            {{ isEditing ? 'Save changes' : 'Create quiz' }}
          </ItButton>
        </div>
      </div>
    </form>
  </section>
</template>
