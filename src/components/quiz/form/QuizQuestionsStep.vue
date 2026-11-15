<script setup lang="ts">
import { PhPlus } from '@phosphor-icons/vue'
import { ItButton } from '@infinitylib/infinity-theme-vue'
import QuizQuestionFields from './QuizQuestionFields.vue'

defineProps<{ questionCount: number }>()

const emit = defineEmits<{ add: []; remove: [index: number] }>()
</script>

<template>
  <div class="quiz-questions-step">
    <QuizQuestionFields
      v-for="index in questionCount"
      :key="index - 1"
      :question-index="index - 1"
      :total-questions="questionCount"
      :can-remove="questionCount > 1"
      @remove="emit('remove', index - 1)"
    />

    <ItButton type="button" variant="secondary" @click="emit('add')">
      <PhPlus :size="18" />
      Add question
    </ItButton>
  </div>
</template>
