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
  padding: 20px;
  text-align: center;
}

.quiz-list-view h1 {
  color: #333;
  margin-bottom: 10px;
}

.quiz-list-view p {
  color: #666;
  margin-bottom: 30px;
}

.quiz-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.quiz-card {
  cursor: pointer;
  text-align: left;
}

.quiz-card h2 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #333;
  font-size: 1.2rem;
}

.quiz-card p {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 10px;
}

.question-count {
  display: inline-block;
  background: #007bff;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
}
</style>
