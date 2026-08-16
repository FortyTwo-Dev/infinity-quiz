import { ref } from 'vue'
import { useQuizStore } from '../stores'
import { validateQuizJSON } from '../utils/validation'

export interface ImportExportState {
  jsonData: string
  error: string | null
  successMessage: string | null
  isImporting: boolean
}

export function useQuizImportExport() {
  const quizStore = useQuizStore()

  // State
  const state = ref<ImportExportState>({
    jsonData: '',
    error: null,
    successMessage: null,
    isImporting: false,
  })

  // Export functions
  const exportSingleQuiz = (quizId: string): string | null => {
    return quizStore.exportQuiz(quizId)
  }

  const exportAllQuizzes = (): string => {
    return quizStore.exportAllQuizzes()
  }

  const downloadQuiz = (quizId: string, filename?: string): boolean => {
    const jsonData = exportSingleQuiz(quizId)
    if (!jsonData) {
      state.value.error = 'Quiz non trouvé'
      return false
    }

    const quiz = quizStore.getQuizById(quizId)
    const name = filename || quiz?.title || 'quiz'
    downloadJSON(jsonData, `${name.replace(/[^a-z0-9]/gi, '_')}.json`)
    state.value.successMessage = 'Quiz exporté avec succès'
    return true
  }

  const downloadAllQuizzes = (): void => {
    const jsonData = exportAllQuizzes()
    downloadJSON(jsonData, 'tous-les-quizzes.json')
    state.value.successMessage = 'Tous les quiz exportés avec succès'
  }

  // Import functions
  const importSingleQuiz = (jsonData: string): boolean => {
    state.value.isImporting = true
    state.value.error = null
    state.value.successMessage = null

    try {
      const success = quizStore.importQuiz(jsonData)
      if (success) {
        state.value.successMessage = 'Quiz importé avec succès'
        state.value.jsonData = ''
      } else {
        state.value.error = 'Données de quiz invalides'
      }
      return success
    } catch (err) {
      state.value.error = 'Erreur lors de l\'import: ' + (err as Error).message
      return false
    } finally {
      state.value.isImporting = false
    }
  }

  const importMultipleQuizzes = (jsonData: string): boolean => {
    state.value.isImporting = true
    state.value.error = null
    state.value.successMessage = null

    try {
      const success = quizStore.importQuizzes(jsonData)
      if (success) {
        state.value.successMessage = 'Quiz importés avec succès'
        state.value.jsonData = ''
      } else {
        state.value.error = 'Données de quiz invalides'
      }
      return success
    } catch (err) {
      state.value.error = 'Erreur lors de l\'import: ' + (err as Error).message
      return false
    } finally {
      state.value.isImporting = false
    }
  }

  const importFromFile = async (event: Event): Promise<boolean> => {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]

    if (!file) {
      state.value.error = 'Aucun fichier sélectionné'
      return false
    }

    state.value.isImporting = true
    state.value.error = null
    state.value.successMessage = null

    try {
      const text = await file.text()
      state.value.jsonData = text

      // Try to detect if it's a single quiz or multiple
      const parsed = JSON.parse(text)
      if (Array.isArray(parsed)) {
        return importMultipleQuizzes(text)
      } else {
        return importSingleQuiz(text)
      }
    } catch (err) {
      state.value.error = 'Erreur de lecture du fichier: ' + (err as Error).message
      return false
    } finally {
      state.value.isImporting = false
      // Reset file input
      if (input) input.value = ''
    }
  }

  const validateJSON = (jsonData: string): boolean => {
    const result = validateQuizJSON(jsonData)
    return result.valid
  }

  const clearMessages = () => {
    state.value.error = null
    state.value.successMessage = null
  }

  return {
    state,
    exportSingleQuiz,
    exportAllQuizzes,
    downloadQuiz,
    downloadAllQuizzes,
    importSingleQuiz,
    importMultipleQuizzes,
    importFromFile,
    validateJSON,
    clearMessages,
  }
}

// Helper function for file downloads
function downloadJSON(data: string, filename: string): void {
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
