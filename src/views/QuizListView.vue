<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { useRouter } from 'vue-router'
import { PhGear, PhPlus } from '@phosphor-icons/vue'
import { ItButton } from '@infinitylib/infinity-theme-vue'
import { ItCard, ItCardBody } from '@/components/itheme'
import { QuizLaunchCard } from '@/components/quiz/card'
import { QuizInfoModal } from '@/components/quiz/modal'
import { useQuizList } from '../composables/useQuizList'
import { getAttemptStatus, type AttemptStatus } from '../composables/useAttempt'
import { useQuizHistoryStore } from '../stores'

const router = useRouter()
const { quizzes, startQuiz, getQuizById } = useQuizList()
const historyStore = useQuizHistoryStore()

const infoModal = ref<InstanceType<typeof QuizInfoModal> | null>(null)
const selectedQuizId = ref<string | null>(null)

const selectedQuiz = ref<{
  title: string
  description: string
  category?: string
  tags?: string[]
  questionCount?: number
  timeLimit?: number
  hasIndividualQuestionTimeLimits?: boolean
  shuffleQuestions?: boolean
  shuffleAnswers?: boolean
  maxSkips?: number
  enableReviewMode?: boolean
  feedbackEnabled?: boolean
} | null>(null)

function showQuizInfo(quizId: string) {
  const quiz = getQuizById(quizId)
  if (!quiz) return

  selectedQuizId.value = quiz.id
  selectedQuiz.value = {
    title: quiz.title,
    description: quiz.description,
    category: quiz.category,
    tags: quiz.tags,
    questionCount: quiz.questions.length,
    timeLimit: quiz.timeLimit,
    hasIndividualQuestionTimeLimits: quiz.questions.some((q) => q.timeLimit !== undefined),
    shuffleQuestions: quiz.shuffleQuestions,
    shuffleAnswers: quiz.shuffleAnswers,
    maxSkips: quiz.maxSkips,
    enableReviewMode: quiz.enableReviewMode,
    feedbackEnabled: quiz.feedbackEnabled,
  }

  // The modal is mounted by v-if, so its ref exists only after the next render.
  void nextTick(() => infoModal.value?.open())
}

function getStatus(quizId: string): AttemptStatus {
  return getAttemptStatus(historyStore.getLatestResultByQuizId(quizId))
}
</script>

<template>
  <section class="quiz-view">
    <header class="quiz-page-header">
      <div>
        <h1 class="quiz-page-title">Infinity Quiz</h1>
        <p class="quiz-page-subtitle">Choose a quiz to get started</p>
      </div>
      <ItButton variant="secondary" @click="router.push({ name: 'quiz-management' })">
        <PhGear :size="20" />
        Manage quizzes
      </ItButton>
    </header>

    <div v-if="quizzes.length > 0" class="quiz-grid">
      <QuizLaunchCard
        v-for="quiz in quizzes"
        :key="quiz.id"
        :id="quiz.id"
        :title="quiz.title"
        :description="quiz.description"
        :primary-tag="quiz.category"
        :tags="quiz.tags"
        :status="getStatus(quiz.id)"
        @click="startQuiz(quiz.id)"
        @info="showQuizInfo(quiz.id)"
      />
    </div>

    <ItCard v-else border class="quiz-empty">
      <ItCardBody size="lg">
        <p class="quiz-empty-title">No quizzes yet</p>
        <p class="quiz-empty-text">
          Create one from scratch, or import a JSON file someone shared with you.
        </p>
        <div class="quiz-empty-actions">
          <ItButton variant="primary" @click="router.push({ name: 'quiz-create' })">
            <PhPlus :size="18" />
            Create a quiz
          </ItButton>
          <ItButton variant="secondary" @click="router.push({ name: 'quiz-import-export' })">
            Import a quiz
          </ItButton>
        </div>
      </ItCardBody>
    </ItCard>

    <QuizInfoModal
      v-if="selectedQuiz"
      ref="infoModal"
      :title="selectedQuiz.title"
      :description="selectedQuiz.description"
      :primary-tag="selectedQuiz.category"
      :tags="selectedQuiz.tags"
      :status="getStatus(selectedQuizId ?? '')"
      :question-count="selectedQuiz.questionCount"
      :time-limit="selectedQuiz.timeLimit"
      :has-individual-question-time-limits="selectedQuiz.hasIndividualQuestionTimeLimits"
      :shuffle-questions="selectedQuiz.shuffleQuestions"
      :shuffle-answers="selectedQuiz.shuffleAnswers"
      :max-skips="selectedQuiz.maxSkips"
      :enable-review-mode="selectedQuiz.enableReviewMode"
      :feedback-enabled="selectedQuiz.feedbackEnabled"
    />
  </section>
</template>
