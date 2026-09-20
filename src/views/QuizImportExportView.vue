<script setup lang="ts">
import { onMounted } from 'vue'
import { useQuizStore } from '../stores'
import { useQuizImportExport } from '../composables/useQuizImportExport'
import { ExportQuizCard, ImportQuizCard } from '@/components/quiz-import-export'

const quizStore = useQuizStore()
const {
  state,
  exportSingleQuiz,
  exportAllQuizzes,
  downloadQuiz,
  downloadAllQuizzes,
  importFromFile,
  importSingleQuiz,
  importMultipleQuizzes,
  validateJSON,
  clearMessages,
} = useQuizImportExport()

// Initialize
onMounted(() => {
  quizStore.initializeSampleQuizzes()
})

// Export handlers
const handleExportSingle = (quizId: string) => {
  downloadQuiz(quizId)
}

const handleExportAll = () => {
  downloadAllQuizzes()
}

const handleCopyToClipboard = (quizId: string | null) => {
  try {
    const jsonData = quizId ? exportSingleQuiz(quizId) || '' : exportAllQuizzes()
    navigator.clipboard.writeText(jsonData)
    state.value.successMessage = 'Copied to clipboard!'
  } catch {
    state.value.error = 'Failed to copy to clipboard'
  }
}

// Import handlers
const handleImportFromFile = async (event: Event) => {
  await importFromFile(event)
}

const handleImportFromText = () => {
  clearMessages()
  if (validateJSON(state.value.jsonData)) {
    try {
      const parsed = JSON.parse(state.value.jsonData)
      if (Array.isArray(parsed)) {
        importMultipleQuizzes(state.value.jsonData)
      } else {
        importSingleQuiz(state.value.jsonData)
      }
    } catch {
      state.value.error = 'Invalid JSON'
    }
  } else {
    state.value.error = 'Invalid JSON format. Must contain id, title and questions.'
  }
}

const handleClearText = () => {
  state.value.jsonData = ''
  clearMessages()
}
</script>

<template>
  <div class="max-w-7xl mx-auto p-4">
    <div class="mb-8">
      <h1 class="text-base-content mb-2 text-3xl font-bold">Import / Export Quizzes</h1>
      <p class="text-base-content/70 m-0">
        Share your quizzes with other users or import existing ones
      </p>
    </div>

    <div class="grid gap-6">
      <ExportQuizCard
        @export-single="handleExportSingle"
        @export-all="handleExportAll"
        @copy="handleCopyToClipboard"
      />

      <ImportQuizCard
        @import="handleImportFromText"
        @clear="handleClearText"
      />
    </div>
  </div>
</template>
