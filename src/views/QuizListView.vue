<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useQuizList } from '../composables/useQuizList'
import { useQuizHistoryStore } from '../stores'
import Button from '../components/common/Button.vue'
import Card from '../components/common/Card.vue'
import { PhTrophy, PhCheckCircle, PhXCircle, PhGear } from '@phosphor-icons/vue'

const router = useRouter()
const { quizzes, startQuiz } = useQuizList()
const historyStore = useQuizHistoryStore()

function goToManagement() {
  router.push({ name: 'quiz-management' })
}

function getResult(quizId: string) {
  return historyStore.getLatestResultByQuizId(quizId)
}

function getResultIcon(quizId: string) {
  const result = getResult(quizId)
  if (!result) return null

  if (result.passed) return PhTrophy
  if (result.score > 0) return PhCheckCircle
  return PhXCircle
}

function getResultScore(quizId: string) {
  const result = getResult(quizId)
  if (!result) return null
  return `${result.score}/${result.totalQuestions}`
}
</script>

<template>
  <div class="quiz-list-view">
    <div class="header">
      <div class="title">
        <h1>Infinity Quiz</h1>
        <p>Choisissez un quiz pour commencer</p>
      </div>
      <Button variant="secondary" @click="goToManagement">
        <PhGear :size="20" />
        Gérer les quiz
      </Button>
    </div>

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
        <div class="quiz-card-content">
          <h2>{{ quiz.title }}</h2>
          <p>{{ quiz.description }}</p>
          <span class="question-count">{{ quiz.questions.length }} questions</span>
        </div>
        <div v-if="getResult(quiz.id)" class="quiz-card-result">
          <component
            :is="getResultIcon(quiz.id)"
            :size="20"
            weight="duotone"
            :class="{
              'result-icon--passed': getResult(quiz.id)!.passed,
              'result-icon--failed': !getResult(quiz.id)!.passed && getResult(quiz.id)!.score > 0,
              'result-icon--zero': getResult(quiz.id)!.score === 0,
            }"
          />
          <span class="result-score">{{ getResultScore(quiz.id) }}</span>
        </div>
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

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-xl);
}

.title {
  text-align: left;
}

.quiz-list-view h1 {
  color: var(--color-text);
  margin: 0 0 var(--space-sm) 0;
}

.quiz-list-view p {
  color: var(--color-text-secondary);
  margin: 0;
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
  position: relative;
  overflow: hidden;
}

.quiz-card-content {
  padding-right: var(--space-xl);
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

.quiz-card-result {
  position: absolute;
  bottom: var(--space-sm);
  right: var(--space-sm);
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  background: var(--color-bg);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  font-size: 0.8rem;
}

.result-score {
  color: var(--color-text-secondary);
  font-weight: 500;
}

.result-icon--passed {
  color: var(--color-success);
}

.result-icon--failed {
  color: var(--color-warning);
}

.result-icon--zero {
  color: var(--color-danger);
}
</style>
