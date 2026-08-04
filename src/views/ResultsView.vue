<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useResults } from '../composables/useResults'
import Button from '../components/common/Button.vue'

const router = useRouter()
const { currentQuiz, score, totalQuestions, percentage, formattedScore, feedback, restartQuiz, backToQuizList } = useResults()
</script>

<template>
  <div class="results-view">
    <h1>Résultats</h1>

    <div v-if="currentQuiz" class="results-container">
      <h2>{{ currentQuiz.title }}</h2>
      <p class="feedback" :class="feedback.class">{{ feedback.text }}</p>

      <div class="score-display">
        <div class="score-circle">
          <span class="score-value">{{ score }}</span>
          <span class="score-max">/ {{ totalQuestions }}</span>
        </div>
        <div class="percentage">{{ percentage }}%</div>
      </div>

      <div class="summary">
        <p>Bonnes réponses : {{ formattedScore }}</p>
      </div>

      <div class="actions">
        <Button variant="primary" size="medium" @click="restartQuiz">Recommencer le quiz</Button>
        <Button variant="secondary" size="medium" @click="backToQuizList">Retour à la liste</Button>
      </div>
    </div>

    <div v-else class="no-results">
      <p>Aucun résultat à afficher</p>
      <Button variant="secondary" size="medium" @click="backToQuizList">Retour à la liste</Button>
    </div>
  </div>
</template>

<style scoped>
.results-view {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

.results-view h1 {
  color: #333;
  margin-bottom: 20px;
}

.results-container {
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 30px;
}

.results-container h2 {
  color: #333;
  margin-bottom: 10px;
}

.feedback {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 20px 0;
}

.feedback.excellent {
  color: #28a745;
}

.feedback.good {
  color: #28a745;
}

.feedback.average {
  color: #ffc107;
}

.feedback.poor {
  color: #dc3545;
}

.score-display {
  margin: 30px 0;
}

.score-circle {
  width: 150px;
  height: 150px;
  border: 8px solid #007bff;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 auto 20px;
  background: white;
}

.score-value {
  font-size: 2.5rem;
  font-weight: bold;
  color: #007bff;
  line-height: 1;
}

.score-max {
  font-size: 1rem;
  color: #666;
}

.percentage {
  font-size: 2rem;
  font-weight: bold;
  color: #007bff;
}

.summary {
  background: white;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 30px;
}

.summary p {
  margin: 0;
  color: #333;
  font-size: 1.1rem;
}

.actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.actions > * {
  min-width: 150px;
}

.no-results {
  text-align: center;
  padding: 40px;
  color: #666;
}

.no-results > * {
  margin-top: 20px;
}
</style>
