import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useQuizList } from '../../composables/useQuizList'
import { useQuizStore } from '../../stores'
import type { Quiz } from '../../types/quiz'

// Mock useRouter
const mockRouter = {
  push: vi.fn<() => void>(),
}

vi.mock('vue-router', () => ({
  useRouter: () => mockRouter,
}))

describe('useQuizList', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('should return quizzes from store', () => {
    const quizStore = useQuizStore()
    const { quizzes } = useQuizList()

    expect(quizzes).toBe(quizStore.quizzes)
  })

  it('startQuiz should call selectQuiz and navigate', () => {
    const quizStore = useQuizStore()
    const { startQuiz } = useQuizList()

    const quiz: Quiz = {
      id: 'test-quiz',
      title: 'Test Quiz',
      description: 'Test Description',
      questions: [],
    }
    quizStore.addQuiz(quiz)

    startQuiz('test-quiz')

    // Check that router.push was called
    expect(mockRouter.push).toHaveBeenCalledWith({
      name: 'quiz',
      params: { quizId: 'test-quiz' },
    })
  })
})
