import { describe, it, expect, beforeEach } from 'vitest'
import { useQuizVerificationStore } from '../../stores/quiz/quiz-verification-store'
import { useQuizSessionStore } from '../../stores/quiz/quiz-session-store'
import type { Quiz, Question } from '../../types/quiz'
import { setupTestPinia } from './setup'

// Helper to create a test quiz
function createTestQuiz(questions: Question[] = []): Quiz {
  return {
    id: 'test-quiz',
    title: 'Test Quiz',
    description: 'Test Description',
    questions:
      questions.length > 0
        ? questions
        : [
            {
              id: 'q1',
              text: 'Test question?',
              options: ['Option 1', 'Option 2', 'Option 3'],
              correctAnswerIndex: 1,
            },
          ],
  }
}

describe('useQuizVerificationStore', () => {
  beforeEach(() => {
    setupTestPinia()
  })

  describe('derived state', () => {
    it('should report no current question as not verified', () => {
      const store = useQuizVerificationStore()
      expect(store.isAnswerVerified).toBe(false)
      expect(store.verifiedAnswerCorrect).toBeNull()
    })

    it('should expose verified state from the session store', () => {
      const sessionStore = useQuizSessionStore()
      const verificationStore = useQuizVerificationStore()

      sessionStore.$patch({
        currentQuizId: 'test-quiz',
        currentQuestionIndex: 0,
        selectedAnswers: { q1: 1 },
        verifiedQuestions: { q1: true },
        shuffledQuiz: createTestQuiz(),
      })

      expect(verificationStore.isAnswerVerified).toBe(true)
      expect(verificationStore.verifiedAnswerCorrect).toBe(true)
    })

    it('should keep states in sync when navigating between questions', () => {
      const sessionStore = useQuizSessionStore()
      const verificationStore = useQuizVerificationStore()

      sessionStore.$patch({
        currentQuizId: 'test-quiz',
        currentQuestionIndex: 0,
        selectedAnswers: { q1: 1, q2: 0 },
        verifiedQuestions: { q1: true },
        shuffledQuiz: createTestQuiz([
          { id: 'q1', text: 'Q1', options: ['A', 'B'], correctAnswerIndex: 1 },
          { id: 'q2', text: 'Q2', options: ['A', 'B'], correctAnswerIndex: 1 },
        ]),
      })

      expect(verificationStore.isAnswerVerified).toBe(true)

      sessionStore.currentQuestionIndex = 1
      expect(verificationStore.isAnswerVerified).toBe(false)
      expect(verificationStore.verifiedAnswerCorrect).toBeNull()

      sessionStore.currentQuestionIndex = 0
      expect(verificationStore.isAnswerVerified).toBe(true)
    })
  })

  describe('getters', () => {
    describe('shouldShowFeedback', () => {
      it('should return false when no answer is verified', () => {
        const store = useQuizVerificationStore()
        expect(store.shouldShowFeedback).toBe(false)
      })

      it('should return false when feedback is disabled', () => {
        const sessionStore = useQuizSessionStore()
        const verificationStore = useQuizVerificationStore()

        sessionStore.$patch({
          currentQuizId: 'test-quiz',
          currentQuestionIndex: 0,
          selectedAnswers: { q1: 1 },
          verifiedQuestions: { q1: true },
          shuffledQuiz: { ...createTestQuiz(), feedbackEnabled: false },
        })

        expect(verificationStore.shouldShowFeedback).toBe(false)
      })

      it('should return true when verified and feedback is enabled', () => {
        const sessionStore = useQuizSessionStore()
        const verificationStore = useQuizVerificationStore()

        sessionStore.$patch({
          currentQuizId: 'test-quiz',
          currentQuestionIndex: 0,
          selectedAnswers: { q1: 1 },
          verifiedQuestions: { q1: true },
          shuffledQuiz: { ...createTestQuiz(), feedbackEnabled: true },
        })

        expect(verificationStore.shouldShowFeedback).toBe(true)
      })
    })

    describe('shouldShowVerifyButton', () => {
      it('should return false when feedback is disabled', () => {
        const sessionStore = useQuizSessionStore()
        const verificationStore = useQuizVerificationStore()

        sessionStore.$patch({
          currentQuizId: 'test-quiz',
          currentQuestionIndex: 0,
          selectedAnswers: {},
          shuffledQuiz: { ...createTestQuiz(), feedbackEnabled: false },
        })

        expect(verificationStore.shouldShowVerifyButton).toBe(false)
      })

      it('should return false when no answer is selected', () => {
        const sessionStore = useQuizSessionStore()
        const verificationStore = useQuizVerificationStore()

        sessionStore.$patch({
          currentQuizId: 'test-quiz',
          currentQuestionIndex: 0,
          selectedAnswers: {},
          shuffledQuiz: { ...createTestQuiz(), feedbackEnabled: true },
        })

        expect(verificationStore.shouldShowVerifyButton).toBe(false)
      })

      it('should return true when an answer is selected and not verified', () => {
        const sessionStore = useQuizSessionStore()
        const verificationStore = useQuizVerificationStore()

        sessionStore.$patch({
          currentQuizId: 'test-quiz',
          currentQuestionIndex: 0,
          selectedAnswers: { q1: 1 },
          shuffledQuiz: { ...createTestQuiz(), feedbackEnabled: true },
        })

        expect(verificationStore.shouldShowVerifyButton).toBe(true)
      })

      it('should return false when the answer is already verified', () => {
        const sessionStore = useQuizSessionStore()
        const verificationStore = useQuizVerificationStore()

        sessionStore.$patch({
          currentQuizId: 'test-quiz',
          currentQuestionIndex: 0,
          selectedAnswers: { q1: 1 },
          verifiedQuestions: { q1: true },
          shuffledQuiz: { ...createTestQuiz(), feedbackEnabled: true },
        })

        expect(verificationStore.shouldShowVerifyButton).toBe(false)
      })
    })

    describe('shouldShowContinueButton', () => {
      it('should return false when not verified', () => {
        const store = useQuizVerificationStore()
        expect(store.shouldShowContinueButton).toBe(false)
      })

      it('should return true when verified and feedback is enabled', () => {
        const sessionStore = useQuizSessionStore()
        const verificationStore = useQuizVerificationStore()

        sessionStore.$patch({
          currentQuizId: 'test-quiz',
          currentQuestionIndex: 0,
          selectedAnswers: { q1: 1 },
          verifiedQuestions: { q1: true },
          shuffledQuiz: { ...createTestQuiz(), feedbackEnabled: true },
        })

        expect(verificationStore.shouldShowContinueButton).toBe(true)
      })
    })

    describe('isCurrentQuestionVerified', () => {
      it('should return false when no current question', () => {
        const store = useQuizVerificationStore()
        expect(store.isCurrentQuestionVerified).toBe(false)
      })

      it('should return false when the question is not verified', () => {
        const sessionStore = useQuizSessionStore()
        const verificationStore = useQuizVerificationStore()

        sessionStore.$patch({
          currentQuizId: 'test-quiz',
          currentQuestionIndex: 0,
          verifiedQuestions: {},
          shuffledQuiz: createTestQuiz(),
        })

        expect(verificationStore.isCurrentQuestionVerified).toBe(false)
      })

      it('should return true when the question is verified', () => {
        const sessionStore = useQuizSessionStore()
        const verificationStore = useQuizVerificationStore()

        sessionStore.$patch({
          currentQuizId: 'test-quiz',
          currentQuestionIndex: 0,
          verifiedQuestions: { q1: true },
          shuffledQuiz: createTestQuiz(),
        })

        expect(verificationStore.isCurrentQuestionVerified).toBe(true)
      })
    })

    describe('canSkipCurrentQuestion', () => {
      it('should return false when the skip limit is reached', () => {
        const sessionStore = useQuizSessionStore()
        const verificationStore = useQuizVerificationStore()

        sessionStore.$patch({
          currentQuizId: 'test-quiz',
          currentQuestionIndex: 0,
          skippedQuestions: { q1: true, q2: true },
          verifiedQuestions: {},
          shuffledQuiz: {
            ...createTestQuiz([
              { id: 'q1', text: 'Q?', options: ['A', 'B'], correctAnswerIndex: 1 },
              { id: 'q2', text: 'Q?', options: ['A', 'B'], correctAnswerIndex: 1 },
            ]),
            maxSkips: 1,
          },
        })

        expect(verificationStore.canSkipCurrentQuestion).toBe(false)
      })

      it('should return false when the question is already verified', () => {
        const sessionStore = useQuizSessionStore()
        const verificationStore = useQuizVerificationStore()

        sessionStore.$patch({
          currentQuizId: 'test-quiz',
          currentQuestionIndex: 0,
          skippedQuestions: {},
          verifiedQuestions: { q1: true },
          shuffledQuiz: createTestQuiz([
            { id: 'q1', text: 'Q?', options: ['A', 'B'], correctAnswerIndex: 1 },
          ]),
        })

        expect(verificationStore.canSkipCurrentQuestion).toBe(false)
      })

      it('should return true when skippable and not verified', () => {
        const sessionStore = useQuizSessionStore()
        const verificationStore = useQuizVerificationStore()

        sessionStore.$patch({
          currentQuizId: 'test-quiz',
          currentQuestionIndex: 0,
          skippedQuestions: {},
          verifiedQuestions: {},
          shuffledQuiz: createTestQuiz([
            { id: 'q1', text: 'Q?', options: ['A', 'B'], correctAnswerIndex: 1 },
          ]),
        })

        expect(verificationStore.canSkipCurrentQuestion).toBe(true)
      })
    })
  })

  describe('actions', () => {
    describe('verifyAnswer', () => {
      it('should return false when no current question', () => {
        const store = useQuizVerificationStore()
        expect(store.verifyAnswer()).toBe(false)
      })

      it('should return false when no answer is selected', () => {
        const sessionStore = useQuizSessionStore()
        const verificationStore = useQuizVerificationStore()

        sessionStore.$patch({
          currentQuizId: 'test-quiz',
          currentQuestionIndex: 0,
          selectedAnswers: {},
          shuffledQuiz: createTestQuiz(),
        })

        expect(verificationStore.verifyAnswer()).toBe(false)
        expect(verificationStore.isAnswerVerified).toBe(false)
      })

      it('should mark the question verified and report a correct answer', () => {
        const sessionStore = useQuizSessionStore()
        const verificationStore = useQuizVerificationStore()

        sessionStore.$patch({
          currentQuizId: 'test-quiz',
          currentQuestionIndex: 0,
          selectedAnswers: { 'test-question': 1 },
          shuffledQuiz: createTestQuiz([
            { id: 'test-question', text: 'Q?', options: ['A', 'B'], correctAnswerIndex: 1 },
          ]),
        })

        expect(verificationStore.verifyAnswer()).toBe(true)
        expect(verificationStore.isAnswerVerified).toBe(true)
        expect(verificationStore.verifiedAnswerCorrect).toBe(true)
        expect(sessionStore.verifiedQuestions['test-question']).toBe(true)
      })

      it('should report an incorrect answer', () => {
        const sessionStore = useQuizSessionStore()
        const verificationStore = useQuizVerificationStore()

        sessionStore.$patch({
          currentQuizId: 'test-quiz',
          currentQuestionIndex: 0,
          selectedAnswers: { 'test-question': 0 },
          shuffledQuiz: createTestQuiz([
            { id: 'test-question', text: 'Q?', options: ['A', 'B'], correctAnswerIndex: 1 },
          ]),
        })

        expect(verificationStore.verifyAnswer()).toBe(false)
        expect(verificationStore.isAnswerVerified).toBe(true)
        expect(verificationStore.verifiedAnswerCorrect).toBe(false)
      })
    })

    describe('continueToNext', () => {
      it('should complete the quiz when there is no next question', () => {
        const sessionStore = useQuizSessionStore()
        const verificationStore = useQuizVerificationStore()

        sessionStore.$patch({
          currentQuizId: 'test-quiz',
          currentQuestionIndex: 0,
          isCompleted: false,
          shuffledQuiz: createTestQuiz([
            { id: 'q1', text: 'Q1', options: ['A'], correctAnswerIndex: 0 },
          ]),
        })

        expect(verificationStore.continueToNext()).toBe(true)
        expect(sessionStore.isCompleted).toBe(true)
      })

      it('should move to the next question when there is one', () => {
        const sessionStore = useQuizSessionStore()
        const verificationStore = useQuizVerificationStore()

        sessionStore.$patch({
          currentQuizId: 'test-quiz',
          currentQuestionIndex: 0,
          shuffledQuiz: createTestQuiz([
            { id: 'q1', text: 'Q1', options: ['A'], correctAnswerIndex: 0 },
            { id: 'q2', text: 'Q2', options: ['B'], correctAnswerIndex: 0 },
          ]),
        })

        expect(verificationStore.continueToNext()).toBe(false)
        expect(sessionStore.currentQuestionIndex).toBe(1)
      })
    })
  })
})
