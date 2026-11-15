import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuizStore } from '../stores'
import type { Quiz } from '../types/quiz'

export function useQuizManagement() {
  const router = useRouter()
  const quizStore = useQuizStore()

  // State
  const searchTerm = ref('')
  const selectedCategory = ref<string | null>(null)
  const selectedTag = ref<string | null>(null)

  // Getters
  const allCategories = quizStore.getAllCategories
  const allTags = quizStore.getAllTags

  const filteredQuizzes = computed(() => {
    let result = quizStore.quizzes

    // Filter by search term
    if (searchTerm.value) {
      result = quizStore.searchQuizzes(searchTerm.value)
    }

    // Filter by category
    if (selectedCategory.value) {
      result = result.filter((q) => q.category === selectedCategory.value)
    }

    // Filter by tag
    if (selectedTag.value) {
      result = result.filter((q) => q.tags?.includes(selectedTag.value!))
    }

    return result
  })

  // Actions
  function deleteQuiz(id: string): void {
    quizStore.deleteQuiz(id)
  }

  function duplicateQuiz(id: string): Quiz | null {
    return quizStore.duplicateQuiz(id)
  }

  function navigateToEdit(quizId: string): void {
    router.push({ name: 'quiz-edit', params: { quizId } })
  }

  function navigateToCreate(): void {
    router.push({ name: 'quiz-create' })
  }

  function navigateToImportExport(): void {
    router.push({ name: 'quiz-import-export' })
  }

  function clearFilters(): void {
    searchTerm.value = ''
    selectedCategory.value = null
    selectedTag.value = null
  }

  return {
    // State
    searchTerm,
    selectedCategory,
    selectedTag,

    // Getters
    allCategories,
    allTags,
    filteredQuizzes,

    // Actions
    deleteQuiz,
    duplicateQuiz,
    navigateToEdit,
    navigateToCreate,
    navigateToImportExport,
    clearFilters,
  }
}
