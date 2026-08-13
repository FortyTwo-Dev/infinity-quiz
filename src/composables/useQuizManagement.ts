import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuizStore } from '../stores'
import type { Quiz, Question } from '../types/quiz'

export interface QuizFormData {
  title: string
  description: string
  category: string
  tags: string[]
  timeLimit?: number
  shuffleQuestions?: boolean
  shuffleAnswers?: boolean
  maxSkips?: number
  enableReviewMode?: boolean
  feedbackEnabled?: boolean
  questions: Partial<Question>[]
}

export interface NewQuestion {
  text: string
  options: string[]
  correctAnswerIndex: number
  timeLimit?: number
  shuffleAnswers?: boolean
  explanation?: string
}

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
  function createQuiz(quizData: QuizFormData): Quiz {
    const newQuiz: Quiz = {
      id: `quiz-${Date.now()}`,
      title: quizData.title,
      description: quizData.description,
      category: quizData.category || undefined,
      tags: quizData.tags.length > 0 ? quizData.tags : undefined,
      timeLimit: quizData.timeLimit,
      shuffleQuestions: quizData.shuffleQuestions,
      shuffleAnswers: quizData.shuffleAnswers,
      maxSkips: quizData.maxSkips,
      enableReviewMode: quizData.enableReviewMode,
      feedbackEnabled: quizData.feedbackEnabled,
      questions: quizData.questions.map((q, index) => ({
        id: `q-${Date.now()}-${index}`,
        text: q.text || '',
        options: q.options || [],
        correctAnswerIndex: q.correctAnswerIndex ?? 0,
        timeLimit: q.timeLimit,
        shuffleAnswers: q.shuffleAnswers,
        explanation: q.explanation,
      })),
    }

    quizStore.addQuiz(newQuiz)
    return newQuiz
  }

  function updateQuiz(id: string, quizData: Partial<QuizFormData>): boolean {
    const updatePayload: Partial<Quiz> = {
      title: quizData.title,
      description: quizData.description,
      category: quizData.category,
      tags: quizData.tags && quizData.tags.length > 0 ? quizData.tags : undefined,
      timeLimit: quizData.timeLimit,
      shuffleQuestions: quizData.shuffleQuestions,
      shuffleAnswers: quizData.shuffleAnswers,
      maxSkips: quizData.maxSkips,
      enableReviewMode: quizData.enableReviewMode,
      feedbackEnabled: quizData.feedbackEnabled,
    }

    // Handle questions update if provided
    if (quizData.questions) {
      updatePayload.questions = quizData.questions.map((q, index) => ({
        id: q.id || `q-${Date.now()}-${index}`,
        text: q.text || '',
        options: q.options || [],
        correctAnswerIndex: q.correctAnswerIndex ?? 0,
        timeLimit: q.timeLimit,
        shuffleAnswers: q.shuffleAnswers,
        explanation: q.explanation,
      }))
    }

    quizStore.updateQuiz(id, updatePayload)
    return true
  }

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
    createQuiz,
    updateQuiz,
    deleteQuiz,
    duplicateQuiz,
    navigateToEdit,
    navigateToCreate,
    navigateToImportExport,
    clearFilters,
  }
}
