<script setup lang="ts">
import { useQuizList } from '../composables/useQuizList'
import Card from '../components/common/Card.vue'

const { quizzes, startQuiz } = useQuizList()
</script>

<template>
  <div class="quiz-list-view">
    <h1>Infinity Quiz</h1>
    <p>Choisissez un quiz pour commencer</p>

    <div class="quiz-list">
      <Card
        v-for="quiz in quizzes"
        :key="quiz.id"
        variant="default"
        padding="medium"
        hoverable
        class="quiz-card"
        @click="startQuiz(quiz.id)"
      >
        <h2>{{ quiz.title }}</h2>
        <p>{{ quiz.description }}</p>
        <span class="question-count">{{ quiz.questions.length }} questions</span>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.quiz-list-view {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--space-md);
  text-align: center;
}

.quiz-list-view h1 {
  color: var(--color-text);
  margin-bottom: var(--space-sm);
}

.quiz-list-view p {
  color: var(--color-text-secondary);
  margin-bottom: var(--space-xl);
}

.quiz-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--space-md);
  margin-top: var(--space-md);
}

.quiz-card {
  cursor: pointer;
  text-align: left;
}

.quiz-card h2 {
  margin-top: 0;
  margin-bottom: var(--space-sm);
  color: var(--color-text);
  font-size: 1.2rem;
}

.quiz-card p {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  margin-bottom: var(--space-sm);
}

.question-count {
  display: inline-block;
  background: var(--color-primary);
  color: var(--color-text-inverse);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
}
</style>
