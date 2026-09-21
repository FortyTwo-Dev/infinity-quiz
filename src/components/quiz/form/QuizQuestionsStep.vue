<script setup lang="ts">
import { DButton } from '@/components/daisy-ui'
import { PhPlus } from '@phosphor-icons/vue'
import QuizQuestionFields from './QuizQuestionFields.vue'

interface Props {
  questionCount: number
}

defineProps<Props>()

interface Emits {
  (e: 'add'): void
  (e: 'remove', index: number): void
}

const emit = defineEmits<Emits>()
</script>

<template>
  <div class="flex flex-col gap-4 w-full">
    <QuizQuestionFields
      v-for="index in questionCount"
      :key="index - 1"
      :question-index="index - 1"
      :total-questions="questionCount"
      :can-remove="questionCount > 1"
      @remove="emit('remove', index - 1)"
    />

    <DButton type="button" variant="primary" size="md" soft @click="emit('add')">
      <PhPlus :size="18" />
      Add question
    </DButton>
  </div>
</template>
