<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuizList } from '../composables/useQuizList'
import { useQuizHistoryStore } from '../stores'
import { DButton } from '@/components/daisy-ui'
import { QuizLaunchCard } from '@/components/quiz/card'
import { QuizInfoModal } from '@/components/quiz/modal'
import { PhGear } from '@phosphor-icons/vue'
import { LContainer, LFlex, LGrid } from '@/components/layout'

const router = useRouter()
const { quizzes, startQuiz, getQuizById } = useQuizList()
const historyStore = useQuizHistoryStore()

const infoModal = ref<InstanceType<typeof QuizInfoModal> | null>(null)
const selectedQuiz = ref<{
  id: string
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
  if (quiz) {
    const hasIndividualQuestionTimeLimits = quiz.questions.some((q) => q.timeLimit !== undefined)

    selectedQuiz.value = {
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      category: quiz.category,
      tags: quiz.tags,
      questionCount: quiz.questions.length,
      timeLimit: quiz.timeLimit,
      hasIndividualQuestionTimeLimits,
      shuffleQuestions: quiz.shuffleQuestions,
      shuffleAnswers: quiz.shuffleAnswers,
      maxSkips: quiz.maxSkips,
      enableReviewMode: quiz.enableReviewMode,
      feedbackEnabled: quiz.feedbackEnabled,
    }
    infoModal.value?.open()
  }
}

function getStatus(quizId: string): 'success' | 'neutral' | 'error' | 'warning' {
  const result = historyStore.getLatestResultByQuizId(quizId)
  if (!result) return 'neutral'
  if (result.passed) return 'success'
  if (result.score > 0) return 'warning'
  return 'error'
}

function goToManagement() {
  router.push({ name: 'quiz-management' })
}
</script>

<template>
  <LContainer as="section" size="7xl" padding="md" centered>
    <LFlex as="header" align="center" justify="between" class="p-4">
      <div class="text-left">
        <h1 class="text-base-content mb-2 text-2xl font-bold">Infinity Quiz</h1>
        <p class="text-base-content/70">Choisissez un quiz pour commencer</p>
      </div>
      <DButton
        variant="accent"
        size="md"
        @click="goToManagement"
        class="inline-flex items-center gap-2"
      >
        <PhGear :size="20" />
        Gérer les quiz
      </DButton>
    </LFlex>
    <LGrid as="div" cols="1 md:2 lg:3" gap="4">
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
    </LGrid>
    <QuizInfoModal
      v-if="selectedQuiz"
      ref="infoModal"
      :title="selectedQuiz.title"
      :description="selectedQuiz.description"
      :primary-tag="selectedQuiz.category"
      :tags="selectedQuiz.tags"
      :status="getStatus(selectedQuiz.id)"
      :question-count="selectedQuiz.questionCount"
      :time-limit="selectedQuiz.timeLimit"
      :has-individual-question-time-limits="selectedQuiz.hasIndividualQuestionTimeLimits"
      :shuffle-questions="selectedQuiz.shuffleQuestions"
      :shuffle-answers="selectedQuiz.shuffleAnswers"
      :max-skips="selectedQuiz.maxSkips"
      :enable-review-mode="selectedQuiz.enableReviewMode"
      :feedback-enabled="selectedQuiz.feedbackEnabled"
    />
  </LContainer>
</template>
