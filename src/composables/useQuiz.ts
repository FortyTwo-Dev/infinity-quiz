import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuizSessionStore } from '../stores'
import { shuffle } from '../utils/array-utils'

export interface QuestionOption {
  option: string
  originalIndex: number
}

export function useQuiz() {
  const route = useRoute()
  const router = useRouter()
  const sessionStore = useQuizSessionStore()

  const quizId = computed(() => route.params.quizId as string | undefined)

  const currentQuiz = computed(() => sessionStore.currentQuiz)
  const currentQuestion = computed(() => sessionStore.currentQuestion)
  const totalQuestions = computed(() => sessionStore.totalQuestions)
  const currentQuestionIndex = computed(() => sessionStore.currentQuestionIndex)
  const score = computed(() => sessionStore.score)
  const progress = computed(() => sessionStore.progress)
  const hasNextQuestion = computed(() => sessionStore.hasNextQuestion)
  const hasPreviousQuestion = computed(() => sessionStore.hasPreviousQuestion)
  const isCompleted = computed(() => sessionStore.isCompleted)
  const timeLeft = computed(() => sessionStore.timeLeft)
  const hasTimer = computed(() => sessionStore.hasTimer)
  const canSkip = computed(() => sessionStore.canSkip)
  const remainingSkips = computed(() => sessionStore.remainingSkips)
  const hasFeedbackEnabled = computed(() => sessionStore.hasFeedbackEnabled)
  const isAnswerVerified = computed(() => sessionStore.isAnswerVerified)
  const verifiedAnswerCorrect = computed(() => sessionStore.verifiedAnswerCorrect)
  const shouldShowFeedback = computed(() => sessionStore.shouldShowFeedback)
  const canSkipCurrentQuestion = computed(() => sessionStore.canSkipCurrentQuestion)
  const isCurrentQuestionVerified = computed(() => sessionStore.isCurrentQuestionVerified)

  const currentQuestionOptions = computed<QuestionOption[]>(() => {
    const question = currentQuestion.value
    if (!question) return []

    const options = [...question.options]
    const quiz = currentQuiz.value
    const shouldShuffle = question.shuffleAnswers ?? quiz?.shuffleAnswers ?? false

    if (shouldShuffle) {
      return shuffle(options).map((option) => ({
        option,
        originalIndex: question.options.indexOf(option),
      }))
    }

    return options.map((option, index) => ({
      option,
      originalIndex: index,
    }))
  })

  function initializeQuiz() {
    if (quizId.value && quizId.value !== sessionStore.currentQuizId) {
      sessionStore.selectQuiz(quizId.value)
    }
  }

  function selectAnswer(answerIndex: number) {
    sessionStore.selectAnswer(answerIndex)
  }

  function skipQuestion() {
    const quizCompleted = sessionStore.skipQuestion()
    if (quizCompleted) {
      router.push({ name: 'results' })
    }
  }

  function handleTimerExpiry() {
    const quizCompleted = sessionStore.handleTimerExpiry()
    if (quizCompleted) {
      router.push({ name: 'results' })
    }
  }

  function submitAndNext() {
    if (sessionStore.hasNextQuestion) {
      sessionStore.nextQuestion()
    } else {
      sessionStore.completeQuiz()
      router.push({ name: 'results' })
    }
  }

  function verifyAnswer() {
    return sessionStore.verifyAnswer()
  }

  function continueToNext() {
    const quizCompleted = sessionStore.continueToNext()
    if (quizCompleted) {
      router.push({ name: 'results' })
    }
  }

  function goToPrevious() {
    sessionStore.previousQuestion()
  }

  function restartQuiz() {
    sessionStore.restartQuiz()
    if (sessionStore.currentQuizId) {
      router.push({ name: 'quiz', params: { quizId: sessionStore.currentQuizId } })
    }
  }

  function backToQuizList() {
    sessionStore.backToQuizList()
    router.push({ name: 'quiz-list' })
  }

  function getCurrentAnswer(): number | null {
    return sessionStore.getAnswerForCurrentQuestion()
  }

  watch(() => quizId.value, initializeQuiz, { immediate: true })

  // Handle timer expiry navigation
  watch(timeLeft, (newTimeLeft) => {
    if (newTimeLeft === 0) {
      handleTimerExpiry()
    }
  })

  return {
    quizId,
    currentQuiz,
    currentQuestion,
    currentQuestionOptions,
    totalQuestions,
    currentQuestionIndex,
    score,
    progress,
    hasNextQuestion,
    hasPreviousQuestion,
    isCompleted,
    timeLeft,
    hasTimer,
    canSkip,
    remainingSkips,
    hasFeedbackEnabled,
    isAnswerVerified,
    verifiedAnswerCorrect,
    shouldShowFeedback,
    canSkipCurrentQuestion,
    isCurrentQuestionVerified,
    initializeQuiz,
    selectAnswer,
    skipQuestion,
    handleTimerExpiry,
    verifyAnswer,
    continueToNext,
    submitAndNext,
    goToPrevious,
    restartQuiz,
    backToQuizList,
    getCurrentAnswer,
  }
}
