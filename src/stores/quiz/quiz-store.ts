import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Quiz } from '../../types/quiz'
import { SAMPLE_QUIZZES, hasInitializedQuizzes } from '../../data/sample-quizzes'
import { parseAndValidateQuizJSON } from '../../utils/validation'

export const useQuizStore = defineStore(
  'quiz',
  () => {
    // State
    const quizzes = ref<Quiz[]>([])

    // Getters
    const getQuizById = computed(() => (id: string) => {
      return quizzes.value.find((q) => q.id === id) ?? null
    })

    const getQuizzesByCategory = computed(() => (category: string) => {
      return quizzes.value.filter((q) => q.category === category)
    })

    const getAllCategories = computed(() => {
      const categories = new Set<string>()
      quizzes.value.forEach((q) => {
        if (q.category) categories.add(q.category)
      })
      return Array.from(categories).sort((a, b) => a.localeCompare(b))
    })

    const getAllTags = computed(() => {
      const tags = new Set<string>()
      quizzes.value.forEach((q) => {
        if (q.tags) q.tags.forEach((tag) => tags.add(tag))
      })
      return Array.from(tags).sort((a, b) => a.localeCompare(b))
    })

    const searchQuizzes = computed(() => (searchTerm: string) => {
      const term = searchTerm.toLowerCase()
      return quizzes.value.filter(
        (q) =>
          q.title.toLowerCase().includes(term) ||
          q.description.toLowerCase().includes(term) ||
          q.category?.toLowerCase().includes(term) ||
          q.tags?.some((tag) => tag.toLowerCase().includes(term))
      )
    })

    const filterQuizzesByTag = computed(() => (tag: string) => {
      return quizzes.value.filter((q) => q.tags?.includes(tag))
    })

    // Actions
    const initializeSampleQuizzes = () => {
      if (hasInitializedQuizzes(quizzes.value)) return
      quizzes.value = SAMPLE_QUIZZES
    }

    const addQuiz = (quiz: Quiz) => {
      quizzes.value.push(quiz)
    }

    const updateQuiz = (id: string, updatedQuiz: Partial<Quiz>) => {
      const index = quizzes.value.findIndex((q) => q.id === id)
      if (index !== -1) {
        quizzes.value[index] = { ...quizzes.value[index], ...updatedQuiz } as Quiz
      }
    }

    const deleteQuiz = (id: string) => {
      quizzes.value = quizzes.value.filter((q) => q.id !== id)
    }

    const duplicateQuiz = (id: string): Quiz | null => {
      const originalQuiz = getQuizById.value(id)
      if (!originalQuiz) return null

      const duplicatedQuiz: Quiz = {
        ...originalQuiz,
        id: `${originalQuiz.id}-copy-${Date.now()}`,
        title: `${originalQuiz.title} (Copie)`,
      }

      // Deep copy questions with new IDs
      duplicatedQuiz.questions = originalQuiz.questions.map((q) => ({
        ...q,
        id: `${q.id}-copy-${Date.now()}`,
      }))

      quizzes.value.push(duplicatedQuiz)
      return duplicatedQuiz
    }

    const exportQuiz = (id: string): string | null => {
      const quiz = getQuizById.value(id)
      if (!quiz) return null
      return JSON.stringify(quiz, null, 2)
    }

    const exportAllQuizzes = (): string => {
      return JSON.stringify(quizzes.value, null, 2)
    }

    const importQuiz = (quizData: string): boolean => {
      const parsedQuiz = parseAndValidateQuizJSON(quizData)
      if (parsedQuiz === null) {
        return false
      }
      if (Array.isArray(parsedQuiz)) {
        return false
      }
      addQuiz(parsedQuiz)
      return true
    }

    const importQuizzes = (quizzesData: string): boolean => {
      const parsedQuizzes = parseAndValidateQuizJSON(quizzesData)
      if (parsedQuizzes === null) {
        return false
      }
      if (!Array.isArray(parsedQuizzes)) {
        return false
      }
      quizzes.value.push(...parsedQuizzes)
      return true
    }

    return {
      // State
      quizzes,

      // Getters
      getQuizById,
      getQuizzesByCategory,
      getAllCategories,
      getAllTags,
      searchQuizzes,
      filterQuizzesByTag,

      // Actions
      initializeSampleQuizzes,
      addQuiz,
      updateQuiz,
      deleteQuiz,
      duplicateQuiz,
      exportQuiz,
      exportAllQuizzes,
      importQuiz,
      importQuizzes,
    }
  },
  {
    persist: {
      key: 'infinity-quiz-quizzes',
      pick: ['quizzes'],
    },
  },
)
