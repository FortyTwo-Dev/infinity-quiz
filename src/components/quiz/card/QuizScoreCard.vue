<script setup lang="ts">
import { ItBadge, ItCard, ItCardBody, ItProgress } from '@/components/itheme'

interface Props {
  score: number
  totalQuestions: number
  percentage: number
  passed: boolean
}

const props = defineProps<Props>()
</script>

<template>
  <ItCard border class="quiz-score-card">
    <ItCardBody size="lg">
      <p class="quiz-score-value" :class="passed ? 'quiz-score-passed' : 'quiz-score-failed'">
        {{ score }}<span class="quiz-score-total">/{{ totalQuestions }}</span>
      </p>

      <ItProgress
        :value="score"
        :max="totalQuestions"
        :variant="props.passed ? 'success' : 'danger'"
        label="Correct answers"
      />

      <p class="quiz-score-percentage">{{ percentage }}%</p>

      <dl class="quiz-score-stats">
        <div>
          <dt>Accuracy</dt>
          <dd>{{ percentage }}%</dd>
        </div>
        <div>
          <dt>Result</dt>
          <dd :class="passed ? 'quiz-score-passed' : 'quiz-score-failed'">
            {{ passed ? 'Passed' : 'Failed' }}
          </dd>
        </div>
      </dl>

      <ItBadge :variant="passed ? 'success' : 'danger'">
        <slot v-if="passed" name="success-message">Congratulations!</slot>
        <slot v-else name="failure-message">Try again</slot>
      </ItBadge>
    </ItCardBody>
  </ItCard>
</template>
