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
  padding: 20px;
}

.quiz-header {
  margin-bottom: 30px;
  text-align: center;
  position: relative;
}

.back-button {
  position: absolute;
  left: 20px;
  top: 20px;
}

.quiz-header h1 {
  color: #333;
  margin-bottom: 10px;
}

.quiz-header p {
  color: #666;
  margin-bottom: 20px;
}

.progress-text {
  color: #666;
  font-size: 0.9rem;
}

.question-container {
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 30px;
  text-align: center;
}

.question-container h2 {
  margin-top: 0;
  margin-bottom: 30px;
  color: #333;
  font-size: 1.3rem;
  min-height: 60px;
}

.options {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
}

.option-button {
  width: 100%;
  text-align: left;
  border: 2px solid #ccc;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.option-button:hover {
  border-color: #007bff;
  background: #f0f7ff;
}

.option-button--selected {
  border-color: #007bff;
  background: #e3f2fd;
  font-weight: bold;
}

.navigation {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.navigation > * {
  flex: 1;
}

.no-question {
  text-align: center;
  padding: 40px;
  color: #666;
}
</style>
