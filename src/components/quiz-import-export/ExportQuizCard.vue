<script setup lang="ts">
import { computed, ref } from 'vue'
import { PhDownload, PhCopy } from '@phosphor-icons/vue'
import { ItCard, ItCardBody, ItCardTitle } from '@/components/itheme'
import { ItButton, ItField, ItOption, ItSelect } from '@infinitylib/infinity-theme-vue'
import { useQuizStore } from '../../stores'

const emit = defineEmits<{
  'export-single': [quizId: string]
  'export-all': []
  copy: [quizId: string | null]
}>()

const quizStore = useQuizStore()

const quizSelection = ref('')

const quizzes = computed(() => quizStore.quizzes)
const hasQuizzes = computed(() => quizzes.value.length > 0)

const exportPreview = computed(() => {
  if (quizSelection.value) {
    const quiz = quizStore.getQuizById(quizSelection.value)
    return quiz ? JSON.stringify(quiz, null, 2) : null
  }
  return JSON.stringify(quizStore.quizzes, null, 2)
})
</script>

<template>
  <ItCard border class="export-card">
    <ItCardBody size="lg">
      <ItCardTitle as="h2">
        <PhDownload :size="24" aria-hidden="true" />
        Export
      </ItCardTitle>

      <ItField label="Quiz to export" html-for="export-quiz">
        <ItSelect id="export-quiz" v-model="quizSelection" :disabled="!hasQuizzes">
          <ItOption value="" text="All quizzes" />
          <ItOption v-for="quiz in quizzes" :key="quiz.id" :value="quiz.id" :text="quiz.title" />
        </ItSelect>
      </ItField>

      <div class="export-actions">
        <ItButton
          type="button"
          variant="primary"
          :disabled="!quizSelection"
          @click="emit('export-single', quizSelection)"
        >
          <PhDownload :size="18" aria-hidden="true" />
          Export selected
        </ItButton>

        <ItButton type="button" variant="secondary" @click="emit('export-all')">
          <PhDownload :size="18" aria-hidden="true" />
          Export all
        </ItButton>

        <ItButton
          type="button"
          variant="secondary"
          :disabled="!quizSelection && !hasQuizzes"
          @click="emit('copy', quizSelection || null)"
        >
          <PhCopy :size="18" aria-hidden="true" />
          Copy to clipboard
        </ItButton>
      </div>

      <section v-if="quizSelection" class="export-preview">
        <h3 class="export-preview-title">Preview</h3>
        <pre class="export-pre">{{ exportPreview }}</pre>
      </section>
    </ItCardBody>
  </ItCard>
</template>
