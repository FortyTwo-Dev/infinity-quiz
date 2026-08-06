import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useQuizStore } from '../../stores/quiz/quiz-store'
import type { Quiz } from '../../types/quiz'

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
  })
})
