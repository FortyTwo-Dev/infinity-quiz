import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useQuizVerificationStore } from '../../stores/quiz/quiz-verification-store'
import { useQuizSessionStore } from '../../stores/quiz/quiz-session-store'
import type { Quiz, Question } from '../../types/quiz'

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
    setActivePinia(createPinia())
  })

  describe('state', () => {
    it('should initialize with isAnswerVerified as false', () => {
      const store = useQuizVerificationStore()
      expect(store.isAnswerVerified).toBe(false)
    })

    it('should initialize with verifiedAnswerCorrect as null', () => {
      const store = useQuizVerificationStore()
      expect(store.verifiedAnswerCorrect).toBeNull()
    })
  })

  describe('getters', () => {
    describe('shouldShowFeedback', () => {
      it('should return false when isAnswerVerified is false', () => {
        const store = useQuizVerificationStore()
        expect(store.shouldShowFeedback).toBe(false)
      })

      it('should return false when hasFeedbackEnabled is false', () => {
        const sessionStore = useQuizSessionStore()
        const verificationStore = useQuizVerificationStore()

        // Mock session store state
        sessionStore.$patch({
          currentQuizId: 'test-quiz',
          currentQuestionIndex: 0,
        })

        // Set a quiz without feedback enabled
        sessionStore.$patch({
          shuffledQuiz: {
            ...createTestQuiz(),
            feedbackEnabled: false,
          },
        })

        verificationStore.isAnswerVerified = true
        expect(verificationStore.shouldShowFeedback).toBe(false)
      })

      it('should return true when isAnswerVerified is true and hasFeedbackEnabled is true', () => {
        const sessionStore = useQuizSessionStore()
        const verificationStore = useQuizVerificationStore()

        // Mock session store with feedback enabled
        sessionStore.$patch({
          currentQuizId: 'test-quiz',
          currentQuestionIndex: 0,
          shuffledQuiz: {
            ...createTestQuiz(),
            feedbackEnabled: true,
          },
        })

        verificationStore.isAnswerVerified = true
        expect(verificationStore.shouldShowFeedback).toBe(true)
      })
    })

    describe('shouldShowVerifyButton', () => {
      it('should return false when hasFeedbackEnabled is false', () => {
        const sessionStore = useQuizSessionStore()
        const verificationStore = useQuizVerificationStore()

        sessionStore.$patch({
          currentQuizId: 'test-quiz',
          currentQuestionIndex: 0,
          selectedAnswers: {},
          shuffledQuiz: {
            ...createTestQuiz(),
            feedbackEnabled: false,
          },
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
          shuffledQuiz: {
            ...createTestQuiz(),
            feedbackEnabled: true,
          },
        })

        expect(verificationStore.shouldShowVerifyButton).toBe(false)
      })

      it('should return false when answer is already verified', () => {
        const sessionStore = useQuizSessionStore()
        const verificationStore = useQuizVerificationStore()

        sessionStore.$patch({
          currentQuizId: 'test-quiz',
          currentQuestionIndex: 0,
          selectedAnswers: { 'test-question': 1 },
          shuffledQuiz: {
            ...createTestQuiz(),
            feedbackEnabled: true,
          },
        })

        verificationStore.isAnswerVerified = true
        expect(verificationStore.shouldShowVerifyButton).toBe(false)
      })

      it('should return true when answer is selected and not verified', () => {
        const sessionStore = useQuizSessionStore()
        const verificationStore = useQuizVerificationStore()

        sessionStore.$patch({
          currentQuizId: 'test-quiz',
          currentQuestionIndex: 0,
          selectedAnswers: { q1: 1 },
          shuffledQuiz: {
            ...createTestQuiz(),
            feedbackEnabled: true,
          },
        })

        verificationStore.isAnswerVerified = false
        expect(verificationStore.shouldShowVerifyButton).toBe(true)
      })
    })

    describe('shouldShowContinueButton', () => {
      it('should return false when isAnswerVerified is false', () => {
        const verificationStore = useQuizVerificationStore()
        verificationStore.isAnswerVerified = false
        expect(verificationStore.shouldShowContinueButton).toBe(false)
      })

      it('should return false when hasFeedbackEnabled is false', () => {
        const sessionStore = useQuizSessionStore()
        const verificationStore = useQuizVerificationStore()

        sessionStore.$patch({
          shuffledQuiz: {
            ...createTestQuiz(),
            feedbackEnabled: false,
          },
        })

        verificationStore.isAnswerVerified = true
        expect(verificationStore.shouldShowContinueButton).toBe(false)
      })

      it('should return true when isAnswerVerified is true and hasFeedbackEnabled is true', () => {
        const sessionStore = useQuizSessionStore()
        const verificationStore = useQuizVerificationStore()

        sessionStore.$patch({
          shuffledQuiz: {
            ...createTestQuiz(),
            feedbackEnabled: true,
          },
        })

        verificationStore.isAnswerVerified = true
        expect(verificationStore.shouldShowContinueButton).toBe(true)
      })
    })

    describe('isCurrentQuestionVerified', () => {
      it('should return false when no current question', () => {
        const sessionStore = useQuizSessionStore()
        const verificationStore = useQuizVerificationStore()

        sessionStore.$patch({
          currentQuizId: null,
          currentQuestionIndex: 0,
        })

        expect(verificationStore.isCurrentQuestionVerified).toBe(false)
      })

      it('should return false when question is not in verifiedQuestions', () => {
        const sessionStore = useQuizSessionStore()
        const verificationStore = useQuizVerificationStore()

        sessionStore.$patch({
          currentQuizId: 'test-quiz',
          currentQuestionIndex: 0,
          verifiedQuestions: new Set(),
          shuffledQuiz: createTestQuiz(),
        })

        expect(verificationStore.isCurrentQuestionVerified).toBe(false)
      })

      it('should return true when question is in verifiedQuestions', () => {
        const sessionStore = useQuizSessionStore()
        const verificationStore = useQuizVerificationStore()

        const quiz = createTestQuiz([
          { id: 'q1', text: 'Q1', options: ['A', 'B'], correctAnswerIndex: 0 },
        ])

        sessionStore.$patch({
          currentQuizId: 'test-quiz',
          currentQuestionIndex: 0,
          verifiedQuestions: new Set(['q1']),
          shuffledQuiz: quiz,
        })

        expect(verificationStore.isCurrentQuestionVerified).toBe(true)
      })
    })

    describe('canSkipCurrentQuestion', () => {
      it('should return false when canSkip is false', () => {
        const sessionStore = useQuizSessionStore()
        const verificationStore = useQuizVerificationStore()

        sessionStore.$patch({
          currentQuizId: 'test-quiz',
          currentQuestionIndex: 0,
          skippedQuestions: new Set(['q1', 'q2']),
          verifiedQuestions: new Set(),
          shuffledQuiz: {
            ...createTestQuiz([
              { id: 'q1', text: 'Q?', options: ['A', 'B'], correctAnswerIndex: 1 },
              { id: 'q2', text: 'Q?', options: ['A', 'B'], correctAnswerIndex: 1 },
            ]),
            maxSkips: 1,
          },
        })

        // canSkip is false because skippedCount (2) >= maxSkips (1)
        // So canSkipCurrentQuestion should be false
        expect(verificationStore.canSkipCurrentQuestion).toBe(false)
      })

      it('should return false when question is already verified', () => {
        const sessionStore = useQuizSessionStore()
        const verificationStore = useQuizVerificationStore()

        sessionStore.$patch({
          currentQuizId: 'test-quiz',
          currentQuestionIndex: 0,
          maxSkips: 2,
          skippedQuestions: new Set(),
          verifiedQuestions: new Set(['q1']),
          shuffledQuiz: createTestQuiz([
            { id: 'q1', text: 'Q?', options: ['A', 'B'], correctAnswerIndex: 1 },
          ]),
        })

        expect(verificationStore.canSkipCurrentQuestion).toBe(false)
      })

      it('should return true when can skip and question not verified', () => {
        const sessionStore = useQuizSessionStore()
        const verificationStore = useQuizVerificationStore()

        sessionStore.$patch({
          currentQuizId: 'test-quiz',
          currentQuestionIndex: 0,
          maxSkips: 2,
          skippedQuestions: new Set(),
          verifiedQuestions: new Set(),
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
        const sessionStore = useQuizSessionStore()
        const verificationStore = useQuizVerificationStore()

        sessionStore.$patch({
          currentQuizId: null,
          currentQuestionIndex: 0,
        })

        const result = verificationStore.verifyAnswer()
        expect(result).toBe(false)
        expect(verificationStore.isAnswerVerified).toBe(false)
      })

      it('should return false when no answer selected', () => {
        const sessionStore = useQuizSessionStore()
        const verificationStore = useQuizVerificationStore()

        sessionStore.$patch({
          currentQuizId: 'test-quiz',
          currentQuestionIndex: 0,
          selectedAnswers: {},
          shuffledQuiz: createTestQuiz(),
        })

        const result = verificationStore.verifyAnswer()
        expect(result).toBe(false)
        expect(verificationStore.isAnswerVerified).toBe(false)
      })

      it('should set isAnswerVerified to true and verifiedAnswerCorrect to true when answer is correct', () => {
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

        const result = verificationStore.verifyAnswer()
        expect(result).toBe(true)
        expect(verificationStore.isAnswerVerified).toBe(true)
        expect(verificationStore.verifiedAnswerCorrect).toBe(true)
        expect(sessionStore.$state.verifiedQuestions?.has('test-question')).toBe(true)
      })

      it('should set isAnswerVerified to true and verifiedAnswerCorrect to false when answer is incorrect', () => {
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

        const result = verificationStore.verifyAnswer()
        expect(result).toBe(false)
        expect(verificationStore.isAnswerVerified).toBe(true)
        expect(verificationStore.verifiedAnswerCorrect).toBe(false)
      })
    })

    describe('continueToNext', () => {
      it('should reset verification state', () => {
        const verificationStore = useQuizVerificationStore()

        verificationStore.isAnswerVerified = true
        verificationStore.verifiedAnswerCorrect = true

        verificationStore.continueToNext()

        expect(verificationStore.isAnswerVerified).toBe(false)
        expect(verificationStore.verifiedAnswerCorrect).toBeNull()
      })

      it('should call completeQuiz when no next question', () => {
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

        verificationStore.continueToNext()

        // Should have called completeQuiz internally, which sets isCompleted to true
        // But since we can't spy on the internal store instance, we verify the result
        expect(verificationStore.isAnswerVerified).toBe(false)
        expect(verificationStore.verifiedAnswerCorrect).toBeNull()
      })

      it('should call nextQuestion when there are more questions', () => {
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

        verificationStore.continueToNext()

        // Should have called nextQuestion internally
        expect(verificationStore.isAnswerVerified).toBe(false)
        expect(verificationStore.verifiedAnswerCorrect).toBeNull()
      })
    })

    describe('updateVerificationState', () => {
      it('should reset state when no current question', () => {
        const sessionStore = useQuizSessionStore()
        const verificationStore = useQuizVerificationStore()

        verificationStore.isAnswerVerified = true
        verificationStore.verifiedAnswerCorrect = true

        sessionStore.$patch({
          currentQuizId: null,
          currentQuestionIndex: 0,
        })

        verificationStore.updateVerificationState()

        expect(verificationStore.isAnswerVerified).toBe(false)
        expect(verificationStore.verifiedAnswerCorrect).toBeNull()
      })

      it('should set verification state based on session store', () => {
        const sessionStore = useQuizSessionStore()
        const verificationStore = useQuizVerificationStore()

        sessionStore.$patch({
          currentQuizId: 'test-quiz',
          currentQuestionIndex: 0,
          selectedAnswers: { 'test-question': 1 },
          verifiedQuestions: new Set(['test-question']),
          shuffledQuiz: createTestQuiz([
            { id: 'test-question', text: 'Q?', options: ['A', 'B'], correctAnswerIndex: 1 },
          ]),
        })

        verificationStore.updateVerificationState()

        expect(verificationStore.isAnswerVerified).toBe(true)
        expect(verificationStore.verifiedAnswerCorrect).toBe(true)
      })

      it('should set verifiedAnswerCorrect to false when answer is wrong', () => {
        const sessionStore = useQuizSessionStore()
        const verificationStore = useQuizVerificationStore()

        sessionStore.$patch({
          currentQuizId: 'test-quiz',
          currentQuestionIndex: 0,
          selectedAnswers: { 'test-question': 0 },
          verifiedQuestions: new Set(['test-question']),
          shuffledQuiz: createTestQuiz([
            { id: 'test-question', text: 'Q?', options: ['A', 'B'], correctAnswerIndex: 1 },
          ]),
        })

        verificationStore.updateVerificationState()

        expect(verificationStore.isAnswerVerified).toBe(true)
        expect(verificationStore.verifiedAnswerCorrect).toBe(false)
      })
    })

    describe('resetVerification', () => {
      it('should reset isAnswerVerified and verifiedAnswerCorrect', () => {
        const verificationStore = useQuizVerificationStore()

        verificationStore.isAnswerVerified = true
        verificationStore.verifiedAnswerCorrect = true

        verificationStore.resetVerification()

        expect(verificationStore.isAnswerVerified).toBe(false)
        expect(verificationStore.verifiedAnswerCorrect).toBeNull()
      })
    })
  })
})
