<script setup lang="ts">
import { useNotificationStore } from '../stores'
import { useQuizImportExport } from '../composables/useQuizImportExport'
import { ExportQuizCard, ImportQuizCard } from '@/components/quiz-import-export'

const notificationStore = useNotificationStore()
const { exportSingleQuiz, exportAllQuizzes, downloadQuiz, downloadAllQuizzes } =
  useQuizImportExport()

// Export handlers
const handleExportSingle = (quizId: string) => {
  downloadQuiz(quizId)
}

const handleExportAll = () => {
  downloadAllQuizzes()
}

const handleCopyToClipboard = async (quizId: string | null) => {
  try {
    const jsonData = quizId ? exportSingleQuiz(quizId) || '' : exportAllQuizzes()
    await navigator.clipboard.writeText(jsonData)
    notificationStore.addNotification('Copied to clipboard!', 'success')
  } catch {
    notificationStore.addNotification('Failed to copy to clipboard', 'error')
  }
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

      <ImportQuizCard />
    </div>
  </div>
</template>
