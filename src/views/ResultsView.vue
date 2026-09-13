<script setup lang="ts">
import { computed, ref } from 'vue'
import { useResults } from '../composables/useResults'
import { PhEye, PhEyeClosed } from '@phosphor-icons/vue'
import { DButton } from '@/components/daisy-ui'
import { QuizScoreCard, QuizReviewCard } from '@/components/quiz/card'

const {
  currentQuiz,
  score,
  totalQuestions,
  percentage,
  formattedScore,
  feedback,
  canReview,
  questionResults,
  restartQuiz,
  backToQuizList,
} = useResults()

const showReview = ref(false)

const passed = computed(() => percentage.value >= 60)

function toggleReview() {
  showReview.value = !showReview.value
}
</script>

<template>
  <div class="max-w-xl mx-auto p-4 text-center">
    <h1 class="text-base-content mb-6 text-4xl font-bold">Résultats</h1>

    <div v-if="currentQuiz" class="bg-base-100 border border-base-200 p-8">
      <h2 class="text-base-content mb-2 text-xl font-semibold">{{ currentQuiz.title }}</h2>

      <p
        class="text-xl font-bold my-4"
        :class="{
          'text-success': feedback.class === 'excellent' || feedback.class === 'good',
          'text-warning': feedback.class === 'average',
          'text-error': feedback.class === 'poor',
        }"
      >
        {{ feedback.text }}
      </p>

      <QuizScoreCard :score="score" :total-questions="totalQuestions" :passed="passed" class="my-6">
        <template #success-message>Félicitations !</template>
        <template #failure-message>Essayez encore</template>
      </QuizScoreCard>

      <div class="bg-base-200 p-4 mb-8">
        <p class="m-0 text-base-content text-lg">Bonnes réponses : {{ formattedScore }}</p>
      </div>

      <div v-if="canReview" class="my-4 text-center">
        <DButton variant="outline" size="md" @click="toggleReview" class="inline-flex items-center">
          <PhEye v-if="!showReview" :size="18" class="mr-2" />
          <PhEyeClosed v-else :size="18" class="mr-2" />
          {{ showReview ? 'Masquer la revue' : 'Voir la revue' }}
        </DButton>
      </div>

      <div class="flex gap-4 justify-center">
        <DButton variant="primary" size="md" @click="restartQuiz" class="min-w-[150px]"
          >Recommencer le quiz</DButton
        >
        <DButton variant="secondary" size="md" @click="backToQuizList" class="min-w-[150px]"
          >Retour à la liste</DButton
        >
      </div>

      <div v-if="showReview && canReview" class="mt-8 pt-6 border-t border-base-300">
        <h3 class="text-base-content mb-4 text-lg font-semibold text-center">
          Revue des questions
        </h3>
        <div class="flex flex-col gap-2">
          <QuizReviewCard
            v-for="result in questionResults"
            :key="result.question.id"
            :question-result="result"
            :show-feedback="true"
          />
        </div>
      </div>
    </div>

    <div v-else class="text-center pt-8 text-base-content/70">
      <p class="mb-4">Aucun résultat à afficher</p>
      <DButton variant="secondary" size="md" @click="backToQuizList">Retour à la liste</DButton>
    </div>
  </div>
</template>
