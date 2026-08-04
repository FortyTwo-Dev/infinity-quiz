<script setup lang="ts">
import { useQuiz } from '../composables/useQuiz'
import Button from '../components/common/Button.vue'
import ProgressBar from '../components/common/ProgressBar.vue'

const {
  currentQuiz,
  currentQuestion,
  totalQuestions,
  currentQuestionIndex,
  progress,
  hasNextQuestion,
  hasPreviousQuestion,
  selectAnswer,
  submitAndNext,
  goToPrevious,
  backToQuizList,
  getCurrentAnswer,
} = useQuiz()
</script>

<template>
  <div class="quiz-view">
    <div v-if="currentQuiz" class="quiz-header">
      <Button variant="text" size="small" class="back-button" @click="backToQuizList"
        >← Retour à la liste</Button
      >
      <h1>{{ currentQuiz.title }}</h1>
      <p>{{ currentQuiz.description }}</p>
      <ProgressBar :value="progress" :max="100" height="8px" />
      <span class="progress-text"
        >Question {{ currentQuestionIndex + 1 }} / {{ totalQuestions }}</span
      >
    </div>

    <div v-if="currentQuestion" class="question-container">
      <h2>{{ currentQuestion.text }}</h2>
      <div class="options">
        <Button
          v-for="(option, index) in currentQuestion.options"
          :key="index"
          variant="secondary"
          size="medium"
          :class="{ 'option-button--selected': getCurrentAnswer() === index }"
          class="option-button"
          @click="selectAnswer(index)"
        >
          {{ option }}
        </Button>
      </div>

      <div class="navigation">
        <Button variant="secondary" :disabled="!hasPreviousQuestion" @click="goToPrevious">
          Précédent
        </Button>
        <Button variant="primary" :disabled="getCurrentAnswer() === null" @click="submitAndNext">
          {{ hasNextQuestion ? 'Suivant' : 'Terminer' }}
        </Button>
      </div>
    </div>

    <div v-else class="no-question">
      <p>Aucune question disponible</p>
    </div>
  </div>
</template>

<style scoped>
.quiz-view {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--space-md);
}

.quiz-header {
  margin-bottom: var(--space-xl);
  text-align: center;
  position: relative;
}

.back-button {
  position: absolute;
  left: var(--space-md);
  top: var(--space-md);
}

.quiz-header h1 {
  color: var(--color-text);
  margin-bottom: var(--space-sm);
}

.quiz-header p {
  color: var(--color-text-secondary);
  margin-bottom: var(--space-md);
}

.progress-text {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
}

.question-container {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-xl);
  text-align: center;
}

.question-container h2 {
  margin-top: 0;
  margin-bottom: var(--space-xl);
  color: var(--color-text);
  font-size: 1.3rem;
  min-height: 60px;
}

.options {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
}

.option-button {
  width: 100%;
  text-align: left;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  transition: all var(--transition-normal);
}

.option-button:hover {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
}

.option-button--selected {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
  font-weight: bold;
}

.navigation {
  display: flex;
  justify-content: space-between;
  gap: var(--space-md);
}

.navigation > * {
  flex: 1;
}

.no-question {
  text-align: center;
  padding: var(--space-xl);
  color: var(--color-text-secondary);
}
</style>
