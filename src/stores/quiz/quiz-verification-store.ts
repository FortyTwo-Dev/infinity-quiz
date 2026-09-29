import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useQuizSessionStore } from './quiz-session-store'

export const useQuizVerificationStore = defineStore('quizVerification', () => {
  const sessionStore = useQuizSessionStore()

  // The session store owns the verification state (`verifiedQuestions`) and the
  // `isCurrentQuestionVerified` / `canSkipCurrentQuestion` getters. This store
  // delegates to them instead of reimplementing the logic, so it can never
  // drift out of sync with the session when navigating between questions.
  const isAnswerVerified = computed(() => sessionStore.isCurrentQuestionVerified)

  const verifiedAnswerCorrect = computed<boolean | null>(() => {
    const question = sessionStore.currentQuestion
    if (!question || !isAnswerVerified.value) return null
    const userAnswer = sessionStore.getAnswerForQuestion(question.id)
    return userAnswer === question.correctAnswerIndex
  })

  // Getters
  const shouldShowFeedback = computed(() => {
    return isAnswerVerified.value && sessionStore.hasFeedbackEnabled
  })

  const shouldShowVerifyButton = computed(() => {
    const answer = sessionStore.getAnswerForCurrentQuestion()
    return sessionStore.hasFeedbackEnabled && answer !== null && !isAnswerVerified.value
  })

  const shouldShowContinueButton = computed(() => {
    return isAnswerVerified.value && sessionStore.hasFeedbackEnabled
  })

  const isCurrentQuestionVerified = computed(() => isAnswerVerified.value)

  const canSkipCurrentQuestion = computed(() => sessionStore.canSkipCurrentQuestion)

  // Actions
  const verifyAnswer = (): boolean => {
    const question = sessionStore.currentQuestion
    if (!question) return false

    const userAnswer = sessionStore.getAnswerForCurrentQuestion()
    if (userAnswer === undefined || userAnswer === null) return false

    sessionStore.verifiedQuestions[question.id] = true
    return userAnswer === question.correctAnswerIndex
  }

  const continueToNext = (): boolean => {
    if (!sessionStore.hasNextQuestion) {
      sessionStore.completeQuiz()
      return true
    }
    sessionStore.nextQuestion()
    return false
  }

  return {
    // Getters
    isAnswerVerified,
    verifiedAnswerCorrect,
    shouldShowFeedback,
    shouldShowVerifyButton,
    shouldShowContinueButton,
    isCurrentQuestionVerified,
    canSkipCurrentQuestion,

    // Actions
    verifyAnswer,
    continueToNext,
  }
})
