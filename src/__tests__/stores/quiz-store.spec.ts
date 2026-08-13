import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useQuizStore } from '../../stores/quiz/quiz-store'
import type { Quiz, Question } from '../../types/quiz'

describe('useQuizStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('state', () => {
    it('should initialize with empty quizzes array', () => {
      const store = useQuizStore()
      expect(store.quizzes).toEqual([])
    })
  })

  describe('getters', () => {
    it('getQuizById should return null when quiz not found', () => {
      const store = useQuizStore()
      expect(store.getQuizById('non-existent')).toBeNull()
    })

    it('getQuizById should return the quiz when found', () => {
      const store = useQuizStore()
      const quiz: Quiz = {
        id: 'test-quiz',
        title: 'Test Quiz',
        description: 'Test Description',
        questions: [],
      }
      store.quizzes.push(quiz)
      expect(store.getQuizById('test-quiz')).toEqual(quiz)
    })

    it('getQuizzesByCategory should return quizzes with matching category', () => {
      const store = useQuizStore()
      const quiz1: Quiz = {
        id: 'quiz-1',
        title: 'Quiz 1',
        description: 'Description 1',
        category: 'Science',
        questions: [],
      }
      const quiz2: Quiz = {
        id: 'quiz-2',
        title: 'Quiz 2',
        description: 'Description 2',
        category: 'History',
        questions: [],
      }
      const quiz3: Quiz = {
        id: 'quiz-3',
        title: 'Quiz 3',
        description: 'Description 3',
        category: 'Science',
        questions: [],
      }
      store.addQuiz(quiz1)
      store.addQuiz(quiz2)
      store.addQuiz(quiz3)

      expect(store.getQuizzesByCategory('Science')).toHaveLength(2)
      expect(store.getQuizzesByCategory('Science')).toEqual([quiz1, quiz3])
    })

    it('getAllCategories should return unique sorted categories', () => {
      const store = useQuizStore()
      const quiz1: Quiz = {
        id: 'quiz-1',
        title: 'Quiz 1',
        description: 'Description 1',
        category: 'Science',
        questions: [],
      }
      const quiz2: Quiz = {
        id: 'quiz-2',
        title: 'Quiz 2',
        description: 'Description 2',
        category: 'History',
        questions: [],
      }
      const quiz3: Quiz = {
        id: 'quiz-3',
        title: 'Quiz 3',
        description: 'Description 3',
        category: 'Science',
        questions: [],
      }
      store.addQuiz(quiz1)
      store.addQuiz(quiz2)
      store.addQuiz(quiz3)

      expect(store.getAllCategories).toEqual(['History', 'Science'])
    })

    it('getAllTags should return unique sorted tags', () => {
      const store = useQuizStore()
      const quiz1: Quiz = {
        id: 'quiz-1',
        title: 'Quiz 1',
        description: 'Description 1',
        tags: ['easy', 'beginner'],
        questions: [],
      }
      const quiz2: Quiz = {
        id: 'quiz-2',
        title: 'Quiz 2',
        description: 'Description 2',
        tags: ['hard', 'advanced'],
        questions: [],
      }
      const quiz3: Quiz = {
        id: 'quiz-3',
        title: 'Quiz 3',
        description: 'Description 3',
        tags: ['easy', 'beginner'],
        questions: [],
      }
      store.addQuiz(quiz1)
      store.addQuiz(quiz2)
      store.addQuiz(quiz3)

      expect(store.getAllTags).toEqual(['advanced', 'beginner', 'easy', 'hard'])
    })

    it('searchQuizzes should return quizzes matching search term in title', () => {
      const store = useQuizStore()
      const quiz1: Quiz = {
        id: 'quiz-1',
        title: 'Science Quiz',
        description: 'Description 1',
        questions: [],
      }
      const quiz2: Quiz = {
        id: 'quiz-2',
        title: 'History Quiz',
        description: 'Description 2',
        questions: [],
      }
      store.addQuiz(quiz1)
      store.addQuiz(quiz2)

      expect(store.searchQuizzes('Science')).toHaveLength(1)
      expect(store.searchQuizzes('Science')[0].title).toBe('Science Quiz')
    })

    it('searchQuizzes should return quizzes matching search term in description', () => {
      const store = useQuizStore()
      const quiz1: Quiz = {
        id: 'quiz-1',
        title: 'Quiz 1',
        description: 'A quiz about science',
        questions: [],
      }
      const quiz2: Quiz = {
        id: 'quiz-2',
        title: 'Quiz 2',
        description: 'A quiz about history',
        questions: [],
      }
      store.addQuiz(quiz1)
      store.addQuiz(quiz2)

      expect(store.searchQuizzes('science')).toHaveLength(1)
      expect(store.searchQuizzes('science')[0].description).toBe('A quiz about science')
    })

    it('filterQuizzesByTag should return quizzes with matching tag', () => {
      const store = useQuizStore()
      const quiz1: Quiz = {
        id: 'quiz-1',
        title: 'Quiz 1',
        description: 'Description 1',
        tags: ['easy', 'beginner'],
        questions: [],
      }
      const quiz2: Quiz = {
        id: 'quiz-2',
        title: 'Quiz 2',
        description: 'Description 2',
        tags: ['hard', 'advanced'],
        questions: [],
      }
      store.addQuiz(quiz1)
      store.addQuiz(quiz2)

      expect(store.filterQuizzesByTag('easy')).toHaveLength(1)
      expect(store.filterQuizzesByTag('easy')[0].id).toBe('quiz-1')
    })
  })

  describe('actions', () => {
    it('initializeSampleQuizzes should populate quizzes when empty', () => {
      const store = useQuizStore()
      expect(store.quizzes).toHaveLength(0)
      store.initializeSampleQuizzes()
      expect(store.quizzes.length).toBeGreaterThan(0)
    })

    it('initializeSampleQuizzes should not duplicate quizzes', () => {
      const store = useQuizStore()
      store.initializeSampleQuizzes()
      const initialCount = store.quizzes.length
      store.initializeSampleQuizzes()
      expect(store.quizzes).toHaveLength(initialCount)
    })

    it('addQuiz should add a new quiz', () => {
      const store = useQuizStore()
      const newQuiz: Quiz = {
        id: 'new-quiz',
        title: 'New Quiz',
        description: 'New Description',
        questions: [],
      }
      store.addQuiz(newQuiz)
      expect(store.quizzes).toContainEqual(newQuiz)
      expect(store.quizzes).toHaveLength(1)
    })

    it('updateQuiz should update an existing quiz', () => {
      const store = useQuizStore()
      const quiz: Quiz = {
        id: 'test-quiz',
        title: 'Test Quiz',
        description: 'Test Description',
        questions: [],
      }
      store.addQuiz(quiz)
      store.updateQuiz('test-quiz', { title: 'Updated Quiz' })
      expect(store.quizzes[0].title).toBe('Updated Quiz')
    })

    it('updateQuiz should do nothing when quiz not found', () => {
      const store = useQuizStore()
      store.updateQuiz('non-existent', { title: 'Updated Quiz' })
      expect(store.quizzes).toHaveLength(0)
    })

    it('deleteQuiz should remove a quiz', () => {
      const store = useQuizStore()
      const quiz: Quiz = {
        id: 'test-quiz',
        title: 'Test Quiz',
        description: 'Test Description',
        questions: [],
      }
      store.addQuiz(quiz)
      expect(store.quizzes).toHaveLength(1)
      store.deleteQuiz('test-quiz')
      expect(store.quizzes).toHaveLength(0)
    })

    it('deleteQuiz should do nothing when quiz not found', () => {
      const store = useQuizStore()
      store.deleteQuiz('non-existent')
      expect(store.quizzes).toHaveLength(0)
    })

    it('duplicateQuiz should create a copy of the quiz with new ID and title', () => {
      const store = useQuizStore()
      const question: Question = {
        id: 'q1',
        text: 'Test question',
        options: ['Option 1', 'Option 2'],
        correctAnswerIndex: 0,
      }
      const originalQuiz: Quiz = {
        id: 'original-quiz',
        title: 'Original Quiz',
        description: 'Original Description',
        category: 'Test',
        tags: ['test'],
        questions: [question],
      }
      store.addQuiz(originalQuiz)

      const duplicatedQuiz = store.duplicateQuiz('original-quiz')

      expect(duplicatedQuiz).not.toBeNull()
      expect(duplicatedQuiz!.id).not.toBe('original-quiz')
      expect(duplicatedQuiz!.id).toContain('copy')
      expect(duplicatedQuiz!.title).toBe('Original Quiz (Copie)')
      expect(duplicatedQuiz!.description).toBe('Original Description')
      expect(duplicatedQuiz!.category).toBe('Test')
      expect(duplicatedQuiz!.tags).toEqual(['test'])
      expect(duplicatedQuiz!.questions).toHaveLength(1)
      expect(duplicatedQuiz!.questions[0].id).not.toBe('q1')
      expect(duplicatedQuiz!.questions[0].id).toContain('copy')
      expect(store.quizzes).toHaveLength(2)
    })

    it('duplicateQuiz should return null when quiz not found', () => {
      const store = useQuizStore()
      expect(store.duplicateQuiz('non-existent')).toBeNull()
    })

    it('exportQuiz should return JSON string of the quiz', () => {
      const store = useQuizStore()
      const quiz: Quiz = {
        id: 'test-quiz',
        title: 'Test Quiz',
        description: 'Test Description',
        questions: [],
      }
      store.addQuiz(quiz)

      const exported = store.exportQuiz('test-quiz')
      expect(exported).not.toBeNull()
      const parsed = JSON.parse(exported!)
      expect(parsed.id).toBe('test-quiz')
      expect(parsed.title).toBe('Test Quiz')
    })

    it('exportQuiz should return null when quiz not found', () => {
      const store = useQuizStore()
      expect(store.exportQuiz('non-existent')).toBeNull()
    })

    it('exportAllQuizzes should return JSON string of all quizzes', () => {
      const store = useQuizStore()
      const quiz1: Quiz = {
        id: 'quiz-1',
        title: 'Quiz 1',
        description: 'Description 1',
        questions: [],
      }
      const quiz2: Quiz = {
        id: 'quiz-2',
        title: 'Quiz 2',
        description: 'Description 2',
        questions: [],
      }
      store.addQuiz(quiz1)
      store.addQuiz(quiz2)

      const exported = store.exportAllQuizzes()
      const parsed = JSON.parse(exported)
      expect(parsed).toHaveLength(2)
      expect(parsed[0].id).toBe('quiz-1')
      expect(parsed[1].id).toBe('quiz-2')
    })

    it('importQuiz should add a valid quiz from JSON string', () => {
      const store = useQuizStore()
      const jsonData = JSON.stringify({
        id: 'imported-quiz',
        title: 'Imported Quiz',
        description: 'Imported Description',
        questions: [],
      })

      const success = store.importQuiz(jsonData)
      expect(success).toBe(true)
      expect(store.quizzes).toHaveLength(1)
      expect(store.quizzes[0].id).toBe('imported-quiz')
    })

    it('importQuiz should return false for invalid JSON', () => {
      const store = useQuizStore()
      const invalidJson = JSON.stringify({
        id: 'invalid-quiz',
        title: 'Invalid Quiz',
        // Missing questions
      })

      const success = store.importQuiz(invalidJson)
      expect(success).toBe(false)
      expect(store.quizzes).toHaveLength(0)
    })

    it('importQuiz should return false for malformed JSON', () => {
      const store = useQuizStore()
      const malformedJson = 'not valid json'

      const success = store.importQuiz(malformedJson)
      expect(success).toBe(false)
      expect(store.quizzes).toHaveLength(0)
    })

    it('importQuizzes should add multiple quizzes from JSON array', () => {
      const store = useQuizStore()
      const jsonData = JSON.stringify([
        {
          id: 'quiz-1',
          title: 'Quiz 1',
          description: 'Description 1',
          questions: [],
        },
        {
          id: 'quiz-2',
          title: 'Quiz 2',
          description: 'Description 2',
          questions: [],
        },
      ])

      const success = store.importQuizzes(jsonData)
      expect(success).toBe(true)
      expect(store.quizzes).toHaveLength(2)
    })

    it('importQuizzes should return false for invalid quiz in array', () => {
      const store = useQuizStore()
      const jsonData = JSON.stringify([
        {
          id: 'quiz-1',
          title: 'Quiz 1',
          description: 'Description 1',
          questions: [],
        },
        {
          // Missing required fields
          title: 'Quiz 2',
        },
      ])

      const success = store.importQuizzes(jsonData)
      expect(success).toBe(false)
      expect(store.quizzes).toHaveLength(0)
    })
  })
})
