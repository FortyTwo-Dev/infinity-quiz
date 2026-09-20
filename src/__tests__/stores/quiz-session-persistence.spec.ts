import { describe, it, expect, beforeEach, vi } from 'vitest'
import { nextTick } from 'vue'
import { useQuizSessionStore } from '../../stores/quiz/quiz-session-store'
import { useQuizStore } from '../../stores/quiz/quiz-store'
import type { Quiz } from '../../types/quiz'
import { installTestPinia, readStorage, setupTestPinia } from './setup'

function createQuiz(overrides: Partial<Quiz> = {}): Quiz {
  return {
    id: 'test-quiz',
    title: 'Test Quiz',
    description: 'Test Description',
    feedbackEnabled: true,
    questions: [
      { id: 'q1', text: 'Q1', options: ['A', 'B'], correctAnswerIndex: 0 },
      { id: 'q2', text: 'Q2', options: ['C', 'D'], correctAnswerIndex: 1 },
    ],
    ...overrides,
  }
}

describe('Quiz session persistence', () => {
  beforeEach(() => {
    vi.useRealTimers()
    setupTestPinia()
  })

  it('persists skipped/verified questions as plain JSON (no Set)', async () => {
    const quizStore = useQuizStore()
    const sessionStore = useQuizSessionStore()

    quizStore.addQuiz(createQuiz())
    sessionStore.selectQuiz('test-quiz')
    sessionStore.skipQuestion()
    sessionStore.verifiedQuestions['q2'] = true
    await nextTick()

    const raw = readStorage('infinity-quiz-session')
    expect(raw).not.toBeNull()

    const parsed = JSON.parse(raw as string)
    expect(parsed.skippedQuestions).toEqual({ q1: true })
    expect(parsed.verifiedQuestions).toEqual({ q2: true })
    expect(Array.isArray(parsed.skippedQuestions)).toBe(false)
  })

  it('rehydrates skipped and verified questions after a reload', async () => {
    const quizStore = useQuizStore()
    const sessionStore = useQuizSessionStore()

    quizStore.addQuiz(createQuiz())
    sessionStore.selectQuiz('test-quiz')
    sessionStore.skipQuestion()
    sessionStore.verifiedQuestions['q1'] = true
    await nextTick()

    // Simulate a page reload: new Pinia instance, same storage
    installTestPinia()

    const reloadedQuizStore = useQuizStore()
    const reloadedSessionStore = useQuizSessionStore()
    reloadedQuizStore.addQuiz(createQuiz())

    expect(reloadedSessionStore.currentQuizId).toBe('test-quiz')
    expect(reloadedSessionStore.skippedQuestions).toEqual({ q1: true })
    expect(reloadedSessionStore.verifiedQuestions).toEqual({ q1: true })
    expect(reloadedSessionStore.skippedCount).toBe(1)
    expect(reloadedSessionStore.verifiedQuestions['q1']).toBe(true)
  })

  it('resumes a per-question timer with the remaining time after reload', async () => {
    vi.useFakeTimers()
    const quizStore = useQuizStore()
    const sessionStore = useQuizSessionStore()

    const timedQuiz = createQuiz({
      questions: [
        { id: 'q1', text: 'Q1', options: ['A', 'B'], correctAnswerIndex: 0, timeLimit: 30 },
      ],
    })

    quizStore.addQuiz(timedQuiz)
    sessionStore.selectQuiz('test-quiz')
    expect(sessionStore.timeLeft).toBe(30)

    vi.advanceTimersByTime(10_000)
    await nextTick()
    expect(sessionStore.timeLeft).toBe(20)

    // Simulate reload
    installTestPinia()
    const reloadedQuizStore = useQuizStore()
    const reloadedSessionStore = useQuizSessionStore()
    reloadedQuizStore.addQuiz(timedQuiz)

    expect(reloadedSessionStore.timeLeft).toBe(20)

    reloadedSessionStore.resumeTimer()

    vi.advanceTimersByTime(1_000)
    expect(reloadedSessionStore.timeLeft).toBe(19)
  })

  it('does not resume the timer when the quiz is already completed', async () => {
    vi.useFakeTimers()
    const quizStore = useQuizStore()
    const sessionStore = useQuizSessionStore()

    quizStore.addQuiz(
      createQuiz({
        questions: [
          { id: 'q1', text: 'Q1', options: ['A', 'B'], correctAnswerIndex: 0, timeLimit: 30 },
        ],
      }),
    )
    sessionStore.selectQuiz('test-quiz')
    sessionStore.completeQuiz()
    await nextTick()

    installTestPinia()
    const reloadedQuizStore = useQuizStore()
    const reloadedSessionStore = useQuizSessionStore()
    reloadedQuizStore.addQuiz(createQuiz())

    expect(reloadedSessionStore.isCompleted).toBe(true)
    reloadedSessionStore.resumeTimer()
    expect(reloadedSessionStore.timeLeft).toBeNull()
  })
})
