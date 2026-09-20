import { describe, it, expect, beforeEach } from 'vitest'
import { useQuizImportExport } from '../../composables/useQuizImportExport'
import { useQuizStore } from '../../stores'
import { setupTestPinia } from '../stores/setup'

const validQuestion = {
  id: 'q1',
  text: 'Q1',
  options: ['A', 'B'],
  correctAnswerIndex: 0,
}

const validQuiz = {
  id: 'quiz-1',
  title: 'Quiz 1',
  description: 'Description 1',
  questions: [validQuestion],
}

describe('useQuizImportExport', () => {
  beforeEach(() => {
    setupTestPinia()
  })

  describe('importFromJson', () => {
    it('should import a single quiz', () => {
      const { importFromJson, state } = useQuizImportExport()
      const quizStore = useQuizStore()

      const success = importFromJson(JSON.stringify(validQuiz))

      expect(success).toBe(true)
      expect(quizStore.quizzes).toHaveLength(1)
      expect(state.value.error).toBeNull()
      expect(state.value.successMessage).toBe('Quiz imported successfully')
    })

    it('should import an array of quizzes', () => {
      const { importFromJson } = useQuizImportExport()
      const quizStore = useQuizStore()

      const success = importFromJson(
        JSON.stringify([validQuiz, { ...validQuiz, id: 'quiz-2' }]),
      )

      expect(success).toBe(true)
      expect(quizStore.quizzes).toHaveLength(2)
    })

    it('should set an error for malformed JSON', () => {
      const { importFromJson, state } = useQuizImportExport()
      const quizStore = useQuizStore()

      const success = importFromJson('not valid json')

      expect(success).toBe(false)
      expect(quizStore.quizzes).toHaveLength(0)
      expect(state.value.error).toBe('Invalid JSON')
    })

    it('should reject a quiz with malformed questions', () => {
      const { importFromJson, state } = useQuizImportExport()
      const quizStore = useQuizStore()

      const success = importFromJson(
        JSON.stringify({
          ...validQuiz,
          questions: [{ ...validQuestion, options: 'not-an-array' }],
        }),
      )

      expect(success).toBe(false)
      expect(quizStore.quizzes).toHaveLength(0)
      expect(state.value.error).toBe('Invalid quiz data')
    })

    it('should clear previous messages before importing', () => {
      const { importFromJson, state } = useQuizImportExport()

      state.value.error = 'stale error'
      importFromJson(JSON.stringify(validQuiz))

      expect(state.value.error).toBeNull()
    })
  })
})
