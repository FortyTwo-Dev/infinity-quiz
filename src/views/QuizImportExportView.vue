<script setup lang="ts">
import { useNotificationStore } from '../stores'
import { useQuizImportExport } from '../composables/useQuizImportExport'
import { ExportQuizCard, ImportQuizCard } from '@/components/quiz-import-export'

const notificationStore = useNotificationStore()
const { exportSingleQuiz, exportAllQuizzes, downloadQuiz, downloadAllQuizzes } =
  useQuizImportExport()

function handleExportSingle(quizId: string) {
  downloadQuiz(quizId)
}

function handleExportAll() {
  downloadAllQuizzes()
}

async function handleCopyToClipboard(quizId: string | null) {
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
  <section class="import-export-view">
    <header class="quiz-page-header">
      <div>
        <h1 class="quiz-page-title">Import / Export</h1>
        <p class="quiz-page-subtitle">Share your quizzes, or bring someone else's in</p>
      </div>
    </header>

    <ExportQuizCard
      @export-single="handleExportSingle"
      @export-all="handleExportAll"
      @copy="handleCopyToClipboard"
    />

    <ImportQuizCard />
  </section>
</template>
