import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useQuizSessionStore } from './quiz-session-store'

export const useQuizVerificationStore = defineStore('quizVerification', () => {
  const sessionStore = useQuizSessionStore()

  // State
  const isAnswerVerified = ref<boolean>(false)
  const verifiedAnswerCorrect = ref<boolean | null>(null)

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

  const isCurrentQuestionVerified = computed(() => {
    const question = sessionStore.currentQuestion
    if (!question) return false
    return sessionStore.$state.verifiedQuestions?.has(question.id) ?? false
  })

  const canSkipCurrentQuestion = computed(() => {
    return sessionStore.canSkip && !isCurrentQuestionVerified.value
  })

  // Actions
  const verifyAnswer = (): boolean => {
    const question = sessionStore.currentQuestion
    if (!question) return false

    const userAnswer = sessionStore.getAnswerForCurrentQuestion()
    if (userAnswer === undefined || userAnswer === null) return false

    isAnswerVerified.value = true
    verifiedAnswerCorrect.value = userAnswer === question.correctAnswerIndex
    sessionStore.$state.verifiedQuestions?.add(question.id)
    return verifiedAnswerCorrect.value
  }

  const continueToNext = (): boolean => {
    isAnswerVerified.value = false
    verifiedAnswerCorrect.value = null

    if (!sessionStore.hasNextQuestion) {
      sessionStore.completeQuiz()
      return true
    }
    sessionStore.nextQuestion()
    return false
  }

  const updateVerificationState = () => {
    const question = sessionStore.currentQuestion
    if (!question) {
      isAnswerVerified.value = false
      verifiedAnswerCorrect.value = null
      return
    }
    const wasVerified = sessionStore.$state.verifiedQuestions?.has(question.id) ?? false
    isAnswerVerified.value = wasVerified
    if (wasVerified) {
      const userAnswer = sessionStore.getAnswerForCurrentQuestion()
      verifiedAnswerCorrect.value = userAnswer === question.correctAnswerIndex
    } else {
      verifiedAnswerCorrect.value = null
    }
  }

  const resetVerification = () => {
    isAnswerVerified.value = false
    verifiedAnswerCorrect.value = null
  }

  return {
    // State
    isAnswerVerified,
    verifiedAnswerCorrect,

    // Getters
    shouldShowFeedback,
    shouldShowVerifyButton,
    shouldShowContinueButton,
    isCurrentQuestionVerified,
    canSkipCurrentQuestion,

    // Actions
    verifyAnswer,
    continueToNext,
    updateVerificationState,
    resetVerification,
  }
})
