<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import QuizForm from '../components/quiz/QuizForm.vue'
import { useQuizForm } from '../composables/useQuizForm'

const route = useRoute()
const router = useRouter()

const quizId = computed(() => {
  return route.params.quizId && typeof route.params.quizId === 'string' ? route.params.quizId : undefined
})

const { form, errors, tagSuggestions, saveAndContinue, saveAndCreateNew, loadQuiz } = useQuizForm()

// Load quiz data when quizId changes
watch(
  quizId,
  (newId) => {
    if (newId) {
      loadQuiz(newId)
    }
  },
  { immediate: true }
)

const handleCancel = () => {
  router.push({ name: 'quiz-management' })
}

const handleSubmit = async () => {
  const result = await saveAndContinue()
  if (result) {
    router.push({ name: 'quiz-management' })
  }
}

const handleSaveAndNew = async () => {
  await saveAndCreateNew()
}
</script>

<template>
  <div class="quiz-form-view">
    <div class="header">
      <h1>{{ quizId ? 'Modifier le Quiz' : 'Créer un nouveau Quiz' }}</h1>
      <p>
        {{
          quizId
            ? 'Modifiez les détails de votre quiz existant'
            : 'Remplissez le formulaire pour créer un nouveau quiz'
        }}
      </p>
    </div>

    <QuizForm
      :form="form"
      :errors="errors"
      :tagSuggestions="tagSuggestions"
      @update:form="(newForm) => (form = newForm)"
      @add-question="
        () =>
          form.questions.push({
            id: `q-new-${Date.now()}`,
            text: '',
            options: ['', ''],
            correctAnswerIndex: 0,
          })
      "
      @remove-question="(index) => form.questions.splice(index, 1)"
      @add-option="(questionIndex) => form.questions[questionIndex].options.push('')"
      @remove-option="
        (questionIndex, optionIndex) => form.questions[questionIndex].options.splice(optionIndex, 1)
      "
      @add-tag="
        (tag) => {
          if (!form.tags.includes(tag)) form.tags.push(tag)
        }
      "
      @remove-tag="
        (tag) => {
          form.tags = form.tags.filter((t) => t !== tag)
        }
      "
      @submit.prevent="handleSubmit"
      @save-and-continue="handleSubmit"
      @save-and-create-new="handleSaveAndNew"
      @cancel="handleCancel"
    />
  </div>
</template>

<style scoped>
.quiz-form-view {
  max-width: 1000px;
  margin: 0 auto;
  padding: var(--space-md);
}

.header {
  margin-bottom: var(--space-xl);
}

.header h1 {
  margin: 0 0 var(--space-sm) 0;
  color: var(--color-text);
}

.header p {
  margin: 0;
  color: var(--color-text-secondary);
}
</style>
