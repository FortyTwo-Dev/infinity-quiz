<script setup lang="ts">
import { ref, computed } from 'vue'
import { DCard, DCardBody } from '@/components/daisy-ui/card'
import { DButton, DCardActions, DCardTitle, DLabel, DSelect, DSelectOption } from '@/components/daisy-ui'
import { useQuizStore } from '../../stores'
import { PhDownload, PhCopy } from '@phosphor-icons/vue'

interface Emits {
  (e: 'export-single', quizId: string): void
  (e: 'export-all'): void
  (e: 'copy', quizId: string | null): void
}

const emit = defineEmits<Emits>()

const quizStore = useQuizStore()

const selectedQuizId = ref<string | null>(null)

const quizzes = computed(() => quizStore.quizzes)
const hasQuizzes = computed(() => quizzes.value.length > 0)

const getExportPreview = computed(() => {
  if (selectedQuizId.value) {
    const quiz = quizStore.getQuizById(selectedQuizId.value)
    return quiz ? JSON.stringify(quiz, null, 2) : null
  }
  return JSON.stringify(quizStore.quizzes, null, 2)
})

const handleExportSingle = () => {
  if (selectedQuizId.value) {
    emit('export-single', selectedQuizId.value)
  }
}

const handleExportAll = () => {
  emit('export-all')
}

const handleCopyToClipboard = () => {
  emit('copy', selectedQuizId.value)
}
</script>

<template>
  <DCard border class="bg-base-100">
    <DCardBody>
      <DCardTitle tag="h2" size="xl">
        <PhDownload :size="24" />
        Export
      </DCardTitle>

      <DCard>
        <DCardBody>
          <DCardTitle tag="h3" size="lg">Select a quiz to export</DCardTitle>
          <DLabel variant="select" text="Export" class="w-full">
            <DSelect
              v-model="selectedQuizId"
              :disabled="!hasQuizzes"
              class="w-full"
            >
              <DSelectOption value="">All quizzes</DSelectOption>
              <DSelectOption v-for="quiz in quizzes" :key="quiz.id" :value="quiz.id">
                {{ quiz.title }}
              </DSelectOption>
            </DSelect>
          </DLabel>
          <DCardActions justify="start">
            <DButton
              type="button"
              variant="primary"
              @click="handleExportSingle"
              :disabled="!selectedQuizId"
            >
              <PhDownload :size="18" />
              Export Selected Quiz
            </DButton>

            <DButton type="button" variant="primary" @click="handleExportAll">
              <PhDownload :size="18" />
              Export All Quizzes
            </DButton>

            <DButton
              type="button"
              variant="secondary"
              @click="handleCopyToClipboard"
              :disabled="!selectedQuizId && !hasQuizzes"
            >
              <PhCopy :size="18" />
              Copy to clipboard
            </DButton>
          </DCardActions>
        </DCardBody>
      </DCard>

      <DCard v-if="selectedQuizId" class="">
        <DCardBody>
          <DCardTitle tag="h3" size="lg">Preview</DCardTitle>
          <pre
            class="bg-base-200 font-mono text-md overflow-x-auto whitespace-pre-wrap wrap-break-word max-h-96 overflow-y-auto"
            >{{ getExportPreview }}</pre>
        </DCardBody>
      </DCard>

    </DCardBody>
  </DCard>
</template>
