<script setup lang="ts">
import { ref } from 'vue'
import Button from '../common/Button.vue'
import Card from '../common/Card.vue'
import type { QuizFormState, FormQuestion } from '../../composables/useQuizForm'

interface Props {
  form: QuizFormState
  errors: Record<string, string>
  tagSuggestions: string[]
}

interface Emits {
  (e: 'update:form', value: QuizFormState): void
  (e: 'addQuestion'): void
  (e: 'removeQuestion', index: number): void
  (e: 'addOption', questionIndex: number): void
  (e: 'removeOption', questionIndex: number, optionIndex: number): void
  (e: 'addTag', tag: string): void
  (e: 'removeTag', tag: string): void
  (e: 'submit', event?: Event): void
  (e: 'saveAndContinue'): void
  (e: 'saveAndCreateNew'): void
  (e: 'cancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Local state for new tag input
const newTagInput = ref('')
const showAdvancedOptions = ref(false)

// Emit form updates
const updateForm = (updates: Partial<QuizFormState>) => {
  emit('update:form', { ...props.form, ...updates })
}

// Form handlers
const handleTitleChange = (e: Event) => {
  updateForm({ title: (e.target as HTMLInputElement).value })
}

const handleDescriptionChange = (e: Event) => {
  updateForm({ description: (e.target as HTMLTextAreaElement).value })
}

const handleCategoryChange = (e: Event) => {
  updateForm({ category: (e.target as HTMLInputElement).value })
}

const handleTimeLimitChange = (e: Event) => {
  const value = (e.target as HTMLInputElement).value
  updateForm({ timeLimit: value ? Number(value) : undefined })
}

const handleMaxSkipsChange = (e: Event) => {
  const value = (e.target as HTMLInputElement).value
  updateForm({ maxSkips: value ? Number(value) : undefined })
}

const handleShuffleQuestionsChange = (e: Event) => {
  updateForm({ shuffleQuestions: (e.target as HTMLInputElement).checked })
}

const handleShuffleAnswersChange = (e: Event) => {
  updateForm({ shuffleAnswers: (e.target as HTMLInputElement).checked })
}

const handleReviewModeChange = (e: Event) => {
  updateForm({ enableReviewMode: (e.target as HTMLInputElement).checked })
}

const handleFeedbackChange = (e: Event) => {
  updateForm({ feedbackEnabled: (e.target as HTMLInputElement).checked })
}

// Question handlers
const getQuestionWithUpdates = (
  question: FormQuestion,
  updates: Partial<FormQuestion>
): FormQuestion => {
  return { ...question, ...updates }
}

const handleQuestionTextChange = (questionIndex: number, value: string) => {
  const updatedQuestions = [...props.form.questions]
  updatedQuestions[questionIndex] = getQuestionWithUpdates(updatedQuestions[questionIndex], {
    text: value,
  })
  updateForm({ questions: updatedQuestions })
}

const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
  const updatedQuestions = [...props.form.questions]
  const question = updatedQuestions[questionIndex]
  if (question && question.options) {
    const newOptions = [...question.options]
    newOptions[optionIndex] = value
    updatedQuestions[questionIndex] = getQuestionWithUpdates(question, { options: newOptions })
    updateForm({ questions: updatedQuestions })
  }
}

const handleCorrectAnswerChange = (questionIndex: number, value: number) => {
  const updatedQuestions = [...props.form.questions]
  updatedQuestions[questionIndex] = getQuestionWithUpdates(updatedQuestions[questionIndex], {
    correctAnswerIndex: value,
  })
  updateForm({ questions: updatedQuestions })
}

const handleQuestionTimeLimitChange = (questionIndex: number, value: string) => {
  const updatedQuestions = [...props.form.questions]
  updatedQuestions[questionIndex] = getQuestionWithUpdates(updatedQuestions[questionIndex], {
    timeLimit: value ? Number(value) : undefined,
  })
  updateForm({ questions: updatedQuestions })
}

const handleQuestionShuffleAnswersChange = (
  questionIndex: number,
  value: boolean
) => {
  const updatedQuestions = [...props.form.questions]
  updatedQuestions[questionIndex] = getQuestionWithUpdates(updatedQuestions[questionIndex], {
    shuffleAnswers: value,
  })
  updateForm({ questions: updatedQuestions })
}

const handleExplanationChange = (questionIndex: number, value: string) => {
  const updatedQuestions = [...props.form.questions]
  updatedQuestions[questionIndex] = getQuestionWithUpdates(updatedQuestions[questionIndex], {
    explanation: value,
  })
  updateForm({ questions: updatedQuestions })
}

// Tag handlers
const handleNewTagInput = (e: Event) => {
  newTagInput.value = (e.target as HTMLInputElement).value
}

const handleNewTagKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && newTagInput.value.trim()) {
    e.preventDefault()
    emit('addTag', newTagInput.value.trim())
    newTagInput.value = ''
  }
}

const handleAddTagFromInput = () => {
  if (newTagInput.value.trim()) {
    emit('addTag', newTagInput.value.trim())
    newTagInput.value = ''
  }
}

const handleAddTagFromSuggestion = (tag: string) => {
  emit('addTag', tag)
}

// Action handlers
const handleAddQuestion = () => {
  emit('addQuestion')
}

const handleRemoveQuestion = (index: number) => {
  emit('removeQuestion', index)
}

const handleAddOption = (questionIndex: number) => {
  emit('addOption', questionIndex)
}

const handleRemoveOption = (questionIndex: number, optionIndex: number) => {
  emit('removeOption', questionIndex, optionIndex)
}
</script>

<template>
  <form class="quiz-form" @submit.prevent="$emit('submit', $event)">
    <!-- Basic Information -->
    <Card variant="default" padding="medium" class="form-section">
      <h2>Informations de base</h2>

      <div class="form-group">
        <label for="title">Titre *</label>
        <input
          id="title"
          type="text"
          :value="form.title"
          @input="handleTitleChange"
          :class="{ 'input-error': errors.title }"
          placeholder="Entrez le titre du quiz"
        />
        <span v-if="errors.title" class="error-message">{{ errors.title }}</span>
      </div>

      <div class="form-group">
        <label for="description">Description *</label>
        <textarea
          id="description"
          :value="form.description"
          @input="handleDescriptionChange"
          :class="{ 'input-error': errors.description }"
          placeholder="Décrivez votre quiz"
          rows="3"
        />
        <span v-if="errors.description" class="error-message">{{ errors.description }}</span>
      </div>

      <div class="form-group">
        <label for="category">Catégorie</label>
        <input
          id="category"
          type="text"
          :value="form.category"
          @input="handleCategoryChange"
          placeholder="Ex: Général, Sciences, Histoire"
        />
      </div>

      <div class="form-group">
        <label>Tags</label>
        <div class="tags-container">
          <div class="tags-list">
            <span
              v-for="tag in form.tags"
              :key="tag"
              class="tag"
              @click="$emit('removeTag', tag)"
            >
              {{ tag }}
              <span class="tag-remove">×</span>
            </span>
          </div>
          <div class="tag-input-container">
            <input
              id="new-tag-input"
              type="text"
              :value="newTagInput"
              @input="handleNewTagInput"
              @keydown="handleNewTagKeyDown"
              placeholder="Ajouter un tag"
              aria-label="Ajouter un tag"
            />
            <Button type="button" size="small" @click="handleAddTagFromInput">
              Ajouter
            </Button>
          </div>
          <div v-if="tagSuggestions.length > 0" class="tag-suggestions">
            <span
              v-for="tag in tagSuggestions.slice(0, 5)"
              :key="tag"
              class="suggestion-tag"
              @click="handleAddTagFromSuggestion(tag)"
            >
              + {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </Card>

    <!-- Quiz Options -->
    <Card variant="default" padding="medium" class="form-section">
      <h2>Options du quiz</h2>

      <div class="checkbox-group">
        <label class="checkbox-label">
          <input
            id="shuffle-questions"
            type="checkbox"
            :checked="form.shuffleQuestions"
            @change="handleShuffleQuestionsChange"
          />
          <span>Mélanger les questions</span>
        </label>

        <label class="checkbox-label">
          <input
            id="shuffle-answers"
            type="checkbox"
            :checked="form.shuffleAnswers"
            @change="handleShuffleAnswersChange"
          />
          <span>Mélanger les réponses</span>
        </label>

        <label class="checkbox-label">
          <input
            id="enable-review-mode"
            type="checkbox"
            :checked="form.enableReviewMode"
            @change="handleReviewModeChange"
          />
          <span>Activer le mode révision</span>
        </label>

        <label class="checkbox-label">
          <input
            id="feedback-enabled"
            type="checkbox"
            :checked="form.feedbackEnabled"
            @change="handleFeedbackChange"
          />
          <span>Afficher le feedback immédiat</span>
        </label>
      </div>

      <div class="advanced-options">
        <button
          type="button"
          class="advanced-toggle"
          @click="showAdvancedOptions = !showAdvancedOptions"
        >
          Options avancées
          <span>{{ showAdvancedOptions ? '▲' : '▼' }}</span>
        </button>

        <div v-if="showAdvancedOptions" class="advanced-fields">
          <div class="form-row">
            <div class="form-group">
              <label for="timeLimit">Limite de temps (secondes)</label>
              <input
                id="timeLimit"
                type="number"
                :value="form.timeLimit || ''"
                @input="handleTimeLimitChange"
                min="0"
                placeholder="Ex: 60"
              />
            </div>

            <div class="form-group">
              <label for="maxSkips">Nombre max de questions à passer</label>
              <input
                id="maxSkips"
                type="number"
                :value="form.maxSkips || ''"
                @input="handleMaxSkipsChange"
                min="0"
                placeholder="0 = illimité"
              />
            </div>
          </div>
        </div>
      </div>
    </Card>

    <!-- Questions -->
    <Card variant="default" padding="medium" class="form-section">
      <h2>Questions</h2>

      <div v-if="errors.questions" class="error-message">{{ errors.questions }}</div>

      <div class="questions-list">
        <div
          v-for="(question, questionIndex) in form.questions"
          :key="question.id"
          class="question-item"
        >
          <div class="question-header">
            <h3>Question {{ questionIndex + 1 }}</h3>
            <Button
              type="button"
              variant="danger"
              size="small"
              @click="handleRemoveQuestion(questionIndex)"
              :disabled="form.questions.length <= 1"
            >
              Supprimer
            </Button>
          </div>

          <div class="form-group">
            <label :for="`question-text-${questionIndex}`">Texte de la question *</label>
            <textarea
              :id="`question-text-${questionIndex}`"
              :value="question.text"
              @input="(e) => handleQuestionTextChange(questionIndex, (e.target as HTMLTextAreaElement).value)"
              placeholder="Entrez le texte de la question"
              rows="2"
              :class="{ 'input-error': errors[`question-${questionIndex}-text`] }"
            />
            <span
              v-if="errors[`question-${questionIndex}-text`]"
              class="error-message"
            >
              {{ errors[`question-${questionIndex}-text`] }}
            </span>
          </div>

          <div class="form-group">
            <label>Options *</label>
            <div class="options-list">
              <div
                v-for="(option, optionIndex) in question.options"
                :key="optionIndex"
                class="option-item"
              >
                <input
                  :id="`option-correct-${questionIndex}-${optionIndex}`"
                  type="radio"
                  :name="`correct-${questionIndex}`"
                  :checked="question.correctAnswerIndex === optionIndex"
                  @change="() => handleCorrectAnswerChange(questionIndex, optionIndex)"
                />
                <input
                  :id="`option-text-${questionIndex}-${optionIndex}`"
                  type="text"
                  :value="option"
                  @input="(e) => handleOptionChange(questionIndex, optionIndex, (e.target as HTMLInputElement).value)"
                  placeholder="Option"
                  :class="{ 'input-error': errors[`question-${questionIndex}-option-${optionIndex}`] }"
                />
                <Button
                  type="button"
                  variant="danger"
                  size="small"
                  @click="handleRemoveOption(questionIndex, optionIndex)"
                  :disabled="question.options.length <= 2"
                >
                  ×
                </Button>
              </div>
            </div>
            <span
              v-if="errors[`question-${questionIndex}-options`]"
              class="error-message"
            >
              {{ errors[`question-${questionIndex}-options`] }}
            </span>
            <Button
              type="button"
              variant="secondary"
              size="small"
              @click="handleAddOption(questionIndex)"
            >
              + Ajouter une option
            </Button>
          </div>

          <div class="question-advanced-options">
            <div class="form-row">
              <div class="form-group">
                <label :for="`explanation-${questionIndex}`">Explication</label>
                <textarea
                  :id="`explanation-${questionIndex}`"
                  :value="question.explanation || ''"
                  @input="(e) => handleExplanationChange(questionIndex, (e.target as HTMLTextAreaElement).value)"
                  placeholder="Explication à afficher après la réponse"
                  rows="2"
                />
              </div>

              <div class="form-group">
                <label :for="`q-timeLimit-${questionIndex}`">Limite de temps (s)</label>
                <input
                  :id="`q-timeLimit-${questionIndex}`"
                  type="number"
                  :value="question.timeLimit || ''"
                  @input="(e) => handleQuestionTimeLimitChange(questionIndex, (e.target as HTMLInputElement).value)"
                  min="0"
                  placeholder="Temps limite"
                />
              </div>
            </div>

            <label class="checkbox-label inline">
              <input
                :id="`question-shuffle-${questionIndex}`"
                type="checkbox"
                :checked="question.shuffleAnswers ?? form.shuffleAnswers"
                @change="(e) => handleQuestionShuffleAnswersChange(questionIndex, (e.target as HTMLInputElement).checked)"
              />
              <span>Mélanger les réponses pour cette question</span>
            </label>
          </div>
        </div>
      </div>

      <Button type="button" variant="secondary" @click="handleAddQuestion">
        + Ajouter une question
      </Button>
    </Card>

    <!-- Form Actions -->
    <div class="form-actions">
      <Button type="button" variant="secondary" @click="$emit('cancel')">
        Annuler
      </Button>
      <Button type="button" variant="primary" @click="$emit('saveAndCreateNew')">
        Enregistrer et nouveau
      </Button>
      <Button type="submit" variant="primary">
        Enregistrer
      </Button>
    </div>
  </form>
</template>

<style scoped>
.quiz-form {
  max-width: 800px;
  margin: 0 auto;
}

.form-section {
  margin-bottom: var(--space-lg);
}

.form-section h2 {
  margin-top: 0;
  margin-bottom: var(--space-md);
  color: var(--color-text);
  font-size: 1.2rem;
}

.form-group {
  margin-bottom: var(--space-md);
}

.form-group label {
  display: block;
  margin-bottom: var(--space-xs);
  font-weight: 500;
  color: var(--color-text);
}

.form-group input[type="text"],
.form-group input[type="number"],
.form-group textarea,
.form-group select {
  width: 100%;
  padding: var(--space-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-bg);
  color: var(--color-text);
  font-family: inherit;
  font-size: 0.95rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px var(--color-primary-alpha);
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.input-error {
  border-color: var(--color-danger);
}

.error-message {
  display: block;
  color: var(--color-danger);
  font-size: 0.85rem;
  margin-top: var(--space-xs);
}

.checkbox-group {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  cursor: pointer;
  padding: var(--space-sm);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  transition: all 0.2s;
}

.checkbox-label:hover {
  border-color: var(--color-primary);
  background: var(--color-bg-hover);
}

.checkbox-label input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: var(--color-primary);
}

.advanced-options {
  margin-top: var(--space-md);
}

.advanced-toggle {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-md);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  width: 100%;
  justify-content: center;
}

.advanced-toggle:hover {
  background: var(--color-bg-hover);
}

.advanced-fields {
  margin-top: var(--space-sm);
  padding: var(--space-md);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--space-md);
}

.tags-container {
  margin-top: var(--space-xs);
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
  margin-bottom: var(--space-sm);
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-sm);
  background: var(--color-primary);
  color: var(--color-text-inverse);
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.tag:hover {
  background: var(--color-primary-dark);
}

.tag-remove {
  cursor: pointer;
  font-size: 0.75rem;
  opacity: 0.7;
}

.tag-remove:hover {
  opacity: 1;
}

.tag-input-container {
  display: flex;
  gap: var(--space-sm);
  margin-bottom: var(--space-xs);
}

.tag-input-container input {
  flex: 1;
}

.tag-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}

.suggestion-tag {
  display: inline-block;
  padding: var(--space-xs) var(--space-sm);
  background: var(--color-bg);
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.suggestion-tag:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: var(--color-primary-alpha);
}

.questions-list {
  margin-top: var(--space-md);
}

.question-item {
  padding: var(--space-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  margin-bottom: var(--space-md);
  background: var(--color-bg);
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-md);
}

.question-header h3 {
  margin: 0;
  color: var(--color-text);
  font-size: 1rem;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  margin-bottom: var(--space-sm);
}

.option-item {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.option-item input[type="radio"] {
  width: 16px;
  height: 16px;
  accent-color: var(--color-primary);
}

.option-item input[type="text"] {
  flex: 1;
}

.question-advanced-options {
  margin-top: var(--space-md);
  padding-top: var(--space-md);
  border-top: 1px solid var(--color-border);
}

.inline {
  display: inline-flex;
  align-items: center;
  margin-top: var(--space-sm);
}

.form-actions {
  display: flex;
  gap: var(--space-md);
  justify-content: flex-end;
  margin-top: var(--space-lg);
  padding-top: var(--space-md);
  border-top: 1px solid var(--color-border);
}
</style>
