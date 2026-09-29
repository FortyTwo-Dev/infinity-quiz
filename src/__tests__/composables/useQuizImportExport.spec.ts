import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
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

  describe('exportSingleQuiz', () => {
    it('should return the JSON of an existing quiz', () => {
      const quizStore = useQuizStore()
      const { exportSingleQuiz } = useQuizImportExport()

      quizStore.addQuiz(validQuiz)

      expect(JSON.parse(exportSingleQuiz('quiz-1') as string)).toEqual(validQuiz)
    })

    it('should return null for a missing quiz', () => {
      const { exportSingleQuiz } = useQuizImportExport()
      expect(exportSingleQuiz('missing')).toBeNull()
    })
  })

  describe('exportAllQuizzes', () => {
    it('should return the JSON of all quizzes', () => {
      const quizStore = useQuizStore()
      const { exportAllQuizzes } = useQuizImportExport()

      quizStore.addQuiz(validQuiz)
      quizStore.addQuiz({ ...validQuiz, id: 'quiz-2' })

      expect(JSON.parse(exportAllQuizzes())).toHaveLength(2)
    })
  })

  describe('downloadQuiz', () => {
    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should download a single quiz and report success', () => {
      const quizStore = useQuizStore()
      const { downloadQuiz, state } = useQuizImportExport()
      const createElementSpy = vi.spyOn(document, 'createElement')

      quizStore.addQuiz(validQuiz)

      const success = downloadQuiz('quiz-1')

      expect(success).toBe(true)
      expect(state.value.successMessage).toBe('Quiz exported successfully')
      expect(createElementSpy).toHaveBeenCalledWith('a')
    })

    it('should set an error when the quiz is missing', () => {
      const { downloadQuiz, state } = useQuizImportExport()

      expect(downloadQuiz('missing')).toBe(false)
      expect(state.value.error).toBe('Quiz not found')
    })

    it('should sanitize the title into a safe filename', () => {
      const quizStore = useQuizStore()
      const { downloadQuiz } = useQuizImportExport()
      const createElementSpy = vi.spyOn(document, 'createElement')

      quizStore.addQuiz({ ...validQuiz, title: 'My Quiz/Title!' })

      downloadQuiz('quiz-1')

      const anchor = createElementSpy.mock.results[0].value as HTMLAnchorElement
      expect(anchor.download).toBe('My_Quiz_Title_.json')
    })
  })

  describe('downloadAllQuizzes', () => {
    it('should download all quizzes and report success', () => {
      const quizStore = useQuizStore()
      const { downloadAllQuizzes, state } = useQuizImportExport()
      const createElementSpy = vi.spyOn(document, 'createElement')

      quizStore.addQuiz(validQuiz)

      downloadAllQuizzes()

      expect(state.value.successMessage).toBe('All quizzes exported successfully')
      expect(createElementSpy).toHaveBeenCalledWith('a')
    })
  })

  describe('importSingleQuiz', () => {
    it('should import a valid quiz and clear the input', () => {
      const quizStore = useQuizStore()
      const { importSingleQuiz, state } = useQuizImportExport()

      state.value.jsonData = 'stale'
      const success = importSingleQuiz(JSON.stringify(validQuiz))

      expect(success).toBe(true)
      expect(quizStore.quizzes).toHaveLength(1)
      expect(state.value.successMessage).toBe('Quiz imported successfully')
      expect(state.value.jsonData).toBe('')
      expect(state.value.isImporting).toBe(false)
    })

    it('should set an error for invalid quiz data', () => {
      const { importSingleQuiz, state } = useQuizImportExport()

      const success = importSingleQuiz(JSON.stringify({ id: 'x' }))

      expect(success).toBe(false)
      expect(state.value.error).toBe('Invalid quiz data')
      expect(state.value.isImporting).toBe(false)
    })
  })

  describe('importMultipleQuizzes', () => {
    it('should import an array of quizzes', () => {
      const quizStore = useQuizStore()
      const { importMultipleQuizzes, state } = useQuizImportExport()

      const success = importMultipleQuizzes(
        JSON.stringify([validQuiz, { ...validQuiz, id: 'quiz-2' }]),
      )

      expect(success).toBe(true)
      expect(quizStore.quizzes).toHaveLength(2)
      expect(state.value.successMessage).toBe('Quizzes imported successfully')
    })

    it('should set an error when given a single object', () => {
      const { importMultipleQuizzes, state } = useQuizImportExport()

      expect(importMultipleQuizzes(JSON.stringify(validQuiz))).toBe(false)
      expect(state.value.error).toBe('Invalid quiz data')
    })
  })

  describe('importFromFile', () => {
    it('should set an error when no file is selected', async () => {
      const { importFromFile, state } = useQuizImportExport()

      const event = { target: { files: [] } } as unknown as Event
      const success = await importFromFile(event)

      expect(success).toBe(false)
      expect(state.value.error).toBe('No file selected')
    })

    it('should import the file content', async () => {
      const quizStore = useQuizStore()
      const { importFromFile, state } = useQuizImportExport()

      const file = new File([JSON.stringify(validQuiz)], 'quiz.json', {
        type: 'application/json',
      })
      const event = { target: { files: [file], value: 'quiz.json' } } as unknown as Event

      const success = await importFromFile(event)

      expect(success).toBe(true)
      expect(quizStore.quizzes).toHaveLength(1)
      expect(state.value.successMessage).toBe('Quiz imported successfully')
    })

    it('should reset the file input after import', async () => {
      const { importFromFile } = useQuizImportExport()

      const file = new File([JSON.stringify(validQuiz)], 'quiz.json', {
        type: 'application/json',
      })
      const input = { files: [file], value: 'quiz.json' }
      const event = { target: input } as unknown as Event

      await importFromFile(event)

      expect(input.value).toBe('')
    })
  })

  describe('validateJSON', () => {
    it('should return true for a valid quiz', () => {
      const { validateJSON } = useQuizImportExport()
      expect(validateJSON(JSON.stringify(validQuiz))).toBe(true)
    })

    it('should return false for malformed JSON', () => {
      const { validateJSON } = useQuizImportExport()
      expect(validateJSON('not json')).toBe(false)
    })
  })

  describe('clearMessages', () => {
    it('should reset error and success message', () => {
      const { clearMessages, state } = useQuizImportExport()

      state.value.error = 'err'
      state.value.successMessage = 'ok'
      clearMessages()

      expect(state.value.error).toBeNull()
      expect(state.value.successMessage).toBeNull()
    })
  })
})
