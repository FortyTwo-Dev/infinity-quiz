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
  padding: var(--space-md);
  text-align: center;
}

.results-view h1 {
  color: var(--color-text);
  margin-bottom: var(--space-lg);
}

.results-container {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-xl);
}

.results-container h2 {
  color: var(--color-text);
  margin-bottom: var(--space-sm);
}

.feedback {
  font-size: 1.5rem;
  font-weight: bold;
  margin: var(--space-md) 0;
}

.feedback.excellent,
.feedback.good {
  color: var(--color-success);
}

.feedback.average {
  color: var(--color-warning);
}

.feedback.poor {
  color: var(--color-danger);
}

.score-display {
  margin: var(--space-xl) 0;
}

.score-circle {
  width: 150px;
  height: 150px;
  border: 8px solid var(--color-primary);
  border-radius: var(--radius-full);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 auto var(--space-md);
  background: var(--color-bg-card);
}

.score-value {
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--color-primary);
  line-height: 1;
}

.score-max {
  font-size: 1rem;
  color: var(--color-text-secondary);
}

.percentage {
  font-size: 2rem;
  font-weight: bold;
  color: var(--color-primary);
}

.summary {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  margin-bottom: var(--space-xl);
}

.summary p {
  margin: 0;
  color: var(--color-text);
  font-size: 1.1rem;
}

.actions {
  display: flex;
  gap: var(--space-md);
  justify-content: center;
}

.actions > * {
  min-width: 150px;
}

.no-results {
  text-align: center;
  padding: var(--space-xl);
  color: var(--color-text-secondary);
}

.no-results > * {
  margin-top: var(--space-md);
}
</style>
