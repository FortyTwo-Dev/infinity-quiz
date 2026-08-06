import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useQuizSessionStore } from '../../stores/quiz/quiz-session-store'
import { useQuizStore } from '../../stores/quiz/quiz-store'
import { useQuizTimerStore } from '../../stores/quiz/quiz-timer-store'
import type { Quiz } from '../../types/quiz'

describe('Quiz Timer Integration', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    setActivePinia(createPinia())
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('timer expiry with session', () => {
    it('should move to next question when timer expires and there are more questions', () => {
      const quizStore = useQuizStore()
      const sessionStore = useQuizSessionStore()
      const timerStore = useQuizTimerStore()

      const quiz: Quiz = {
        id: 'test-quiz',
        title: 'Test Quiz',
        description: 'Test',
        questions: [
          { id: 'q1', text: 'Q1', options: ['A'], correctAnswerIndex: 0 },
          { id: 'q2', text: 'Q2', options: ['B'], correctAnswerIndex: 0 },
          { id: 'q3', text: 'Q3', options: ['C'], correctAnswerIndex: 0 },
        ],
      }

      quizStore.addQuiz(quiz)
      sessionStore.selectQuiz('test-quiz')

      expect(sessionStore.currentQuestionIndex).toBe(0)

      // Start timer for 1 second
      sessionStore.startTimer(1)

      // Advance time
      vi.advanceTimersByTime(1000)

      // Should have moved to next question
      expect(sessionStore.currentQuestionIndex).toBe(1)
    })

    it('should complete quiz when timer expires on last question', () => {
      const quizStore = useQuizStore()
      const sessionStore = useQuizSessionStore()

      const quiz: Quiz = {
        id: 'test-quiz',
        title: 'Test Quiz',
        description: 'Test',
        questions: [
          { id: 'q1', text: 'Q1', options: ['A'], correctAnswerIndex: 0 },
          { id: 'q2', text: 'Q2', options: ['B'], correctAnswerIndex: 0 },
        ],
      }

      quizStore.addQuiz(quiz)
      sessionStore.selectQuiz('test-quiz')
      sessionStore.currentQuestionIndex = 1 // Go to last question

      expect(sessionStore.isCompleted).toBe(false)

      // Start timer for 1 second
      sessionStore.startTimer(1)

      // Advance time
      vi.advanceTimersByTime(1000)

      // Should have completed the quiz
      expect(sessionStore.isCompleted).toBe(true)
    })

    it('should nullify answer when timer expires', () => {
      const quizStore = useQuizStore()
      const sessionStore = useQuizSessionStore()

      const quiz: Quiz = {
        id: 'test-quiz',
        title: 'Test Quiz',
        description: 'Test',
        questions: [
          { id: 'q1', text: 'Q1', options: ['A', 'B'], correctAnswerIndex: 0 },
          { id: 'q2', text: 'Q2', options: ['C'], correctAnswerIndex: 0 },
        ],
      }

      quizStore.addQuiz(quiz)
      sessionStore.selectQuiz('test-quiz')
      sessionStore.selectAnswer(0) // Select answer for q1

      expect(sessionStore.getAnswerForQuestion('q1')).toBe(0)

      // Start timer for 1 second
      sessionStore.startTimer(1)

      // Advance time
      vi.advanceTimersByTime(1000)

      // Answer should be nullified
      expect(sessionStore.getAnswerForQuestion('q1')).toBeNull()
      // Should have moved to next question
      expect(sessionStore.currentQuestionIndex).toBe(1)
    })

    it('should continue timer on next question if it has a time limit', () => {
      const quizStore = useQuizStore()
      const sessionStore = useQuizSessionStore()

      const quiz: Quiz = {
        id: 'test-quiz',
        title: 'Test Quiz',
        description: 'Test',
        timeLimit: 10, // Global time limit
        questions: [
          { id: 'q1', text: 'Q1', options: ['A'], correctAnswerIndex: 0 },
          { id: 'q2', text: 'Q2', options: ['B'], correctAnswerIndex: 0 },
        ],
      }

      quizStore.addQuiz(quiz)
      sessionStore.selectQuiz('test-quiz')

      expect(sessionStore.currentQuestionIndex).toBe(0)

      // Start timer (should use global timeLimit of 10)
      sessionStore.startTimer(1)

      // Advance time to trigger expiry
      vi.advanceTimersByTime(1000)

      // Should have moved to next question
      expect(sessionStore.currentQuestionIndex).toBe(1)

      // Timer should have been restarted for the next question
      // (we can't easily check if a new interval was created, but we can check timeLeft)
      expect(sessionStore.timeLeft).toBeGreaterThan(0)
    })
  })
})
