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
    state.value.successMessage = 'Copié dans le presse-papier !'
  } catch {
    state.value.error = 'Échec de la copie dans le presse-papier'
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
      state.value.error = 'JSON invalide'
    }
  } else {
    state.value.error = 'Format JSON invalide. Doit contenir id, title et questions.'
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
      <h1 class="text-base-content mb-2 text-2xl font-bold">Importer / Exporter des Quiz</h1>
      <p class="text-base-content/70 m-0">
        Partagez vos quiz avec d'autres utilisateurs ou importez des quiz existants
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
        @file-select="handleImportFromFile"
      />
    </div>
  </div>
</template>
