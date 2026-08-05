import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useQuizStore, useQuizHistoryStore } from './'
import { shuffle } from '../utils/array-utils'
import type { Quiz } from '@/types'

export const useQuizSessionStore = defineStore('quizSession', () => {
  // State
  const currentQuizId = ref<string | null>(null)
  const currentQuestionIndex = ref<number>(0)
  const selectedAnswers = ref<Record<string, number | null>>({})
  const skippedQuestions = ref<Set<string>>(new Set())
  const score = ref<number>(0)
  const isCompleted = ref<boolean>(false)
  const timeLeft = ref<number | null>(null)
  const timerInterval = ref<ReturnType<typeof setInterval> | null>(null)
  const shuffledQuiz = ref<Quiz | null>(null)

  // Getters
  const currentQuiz = computed(() => {
    if (shuffledQuiz.value) return shuffledQuiz.value
    const quizStore = useQuizStore()
    if (!currentQuizId.value) return null
    return quizStore.getQuizById(currentQuizId.value) ?? null
  })

  const currentQuestion = computed(() => {
    const quiz = currentQuiz.value
    if (!quiz || currentQuestionIndex.value >= quiz.questions.length) return null
    const question = quiz.questions[currentQuestionIndex.value]
    if (!question) return null
    return question
  })

  const totalQuestions = computed(() => {
    const quiz = currentQuiz.value
    if (!quiz) return 0
    return quiz.questions.length
  })

  const progress = computed(() => {
    const quiz = currentQuiz.value
    if (!quiz) return 0
    const total = quiz.questions.length
    if (total === 0) return 0
    return (currentQuestionIndex.value / total) * 100
  })

  const hasNextQuestion = computed(() => {
    const quiz = currentQuiz.value
    if (!quiz) return false
    return currentQuestionIndex.value < quiz.questions.length - 1
  })

  const hasPreviousQuestion = computed(() => {
    return currentQuestionIndex.value > 0
  })

  const hasTimer = computed(() => {
    return timeLeft.value !== null
  })

  const skippedCount = computed(() => {
    return skippedQuestions.value.size
  })

  const canSkip = computed(() => {
    const quiz = currentQuiz.value
    if (!quiz?.maxSkips) return true
    return skippedCount.value < quiz.maxSkips
  })

  const remainingSkips = computed(() => {
    const quiz = currentQuiz.value
    if (!quiz?.maxSkips) return null
    return quiz.maxSkips - skippedCount.value
  })

  const getCurrentQuestionTimeLimit = computed(() => {
    const quiz = currentQuiz.value
    if (!quiz) return null
    const currentQuestion = quiz.questions[currentQuestionIndex.value]
    if (!currentQuestion) return null

    if (currentQuestion.timeLimit !== undefined) {
      return currentQuestion.timeLimit
    }
    return quiz.timeLimit ?? null
  })

  // Helper functions
  const clearTimer = () => {
    if (timerInterval.value) {
      clearInterval(timerInterval.value)
      timerInterval.value = null
    }
    timeLeft.value = null
  }

  const startTimer = (duration: number) => {
    clearTimer()
    timeLeft.value = duration
    timerInterval.value = setInterval(() => {
      if (timeLeft.value === null) return
      timeLeft.value--
      if (timeLeft.value <= 0) {
        clearTimer()
        handleTimerExpiry()
      }
    }, 1000)
  }

  const handleTimerExpiry = (): boolean => {
    const question = currentQuestion.value
    if (question) {
      selectedAnswers.value[question.id] = null
    }

    if (hasNextQuestion.value) {
      nextQuestion()
      return false
    } else {
      completeQuiz()
      return true
    }
  }

  // Actions
  const selectQuiz = (quizId: string) => {
    const quizStore = useQuizStore()
    const originalQuiz = quizStore.getQuizById(quizId)
    if (!originalQuiz) return

    clearTimer()
    currentQuizId.value = quizId
    currentQuestionIndex.value = 0
    selectedAnswers.value = {}
    skippedQuestions.value = new Set()
    score.value = 0
    isCompleted.value = false

    if (originalQuiz.shuffleQuestions) {
      shuffledQuiz.value = {
        ...originalQuiz,
        questions: shuffle([...originalQuiz.questions]),
      }
    } else {
      shuffledQuiz.value = null
    }

    const quiz = shuffledQuiz.value ?? originalQuiz
    const timeLimit = quiz.timeLimit ?? quiz.questions[0]?.timeLimit
    if (timeLimit !== undefined && timeLimit > 0) {
      startTimer(timeLimit)
    }
  }

  const selectAnswer = (answerIndex: number) => {
    const question = currentQuestion.value
    if (!question) return
    selectedAnswers.value[question.id] = answerIndex
    skippedQuestions.value.delete(question.id)
  }

  const skipQuestion = (): boolean => {
    const question = currentQuestion.value
    if (!question) return false
    if (!canSkip.value) return false

    selectedAnswers.value[question.id] = null
    skippedQuestions.value.add(question.id)

    if (hasNextQuestion.value) {
      nextQuestion()
      return false
    } else {
      completeQuiz()
      return true
    }
  }

  const calculateScore = () => {
    const quiz = currentQuiz.value
    if (!quiz) return

    let newScore = 0
    for (const question of quiz.questions) {
      const selectedIndex = selectedAnswers.value[question.id]
      if (selectedIndex !== undefined && selectedIndex !== null) {
        if (selectedIndex === question.correctAnswerIndex) {
          newScore += 1
        }
      }
    }
    score.value = newScore
  }

  const nextQuestion = () => {
    if (!hasNextQuestion.value) return
    clearTimer()
    currentQuestionIndex.value += 1

    const timeLimit = getCurrentQuestionTimeLimit.value
    if (timeLimit !== null && timeLimit > 0) {
      startTimer(timeLimit)
    }
  }

  const previousQuestion = () => {
    if (!hasPreviousQuestion.value) return
    clearTimer()
    currentQuestionIndex.value -= 1

    const timeLimit = getCurrentQuestionTimeLimit.value
    if (timeLimit !== null && timeLimit > 0) {
      startTimer(timeLimit)
    }
  }

  const goToQuestion = (index: number) => {
    if (index < 0 || index >= totalQuestions.value) return
    clearTimer()
    currentQuestionIndex.value = index

    const timeLimit = getCurrentQuestionTimeLimit.value
    if (timeLimit !== null && timeLimit > 0) {
      startTimer(timeLimit)
    }
  }

  const completeQuiz = () => {
    clearTimer()
    calculateScore()
    isCompleted.value = true

    const historyStore = useQuizHistoryStore()
    const quiz = currentQuiz.value
    if (quiz) {
      const passed = score.value >= quiz.questions.length * 0.7
      historyStore.addResult(quiz.id, score.value, quiz.questions.length, passed)
    }
  }

  const restartQuiz = () => {
    if (!currentQuizId.value) return

    clearTimer()
    currentQuestionIndex.value = 0
    selectedAnswers.value = {}
    skippedQuestions.value = new Set()
    score.value = 0
    isCompleted.value = false

    const quizStore = useQuizStore()
    const originalQuiz = quizStore.getQuizById(currentQuizId.value)
    if (originalQuiz?.shuffleQuestions) {
      shuffledQuiz.value = {
        ...originalQuiz,
        questions: shuffle([...originalQuiz.questions]),
      }
    }

    const timeLimit = getCurrentQuestionTimeLimit.value
    if (timeLimit !== null && timeLimit > 0) {
      startTimer(timeLimit)
    }
  }

  const backToQuizList = () => {
    clearTimer()
    currentQuizId.value = null
    currentQuestionIndex.value = 0
    selectedAnswers.value = {}
    skippedQuestions.value = new Set()
    score.value = 0
    isCompleted.value = false
    shuffledQuiz.value = null
  }

  const getAnswerForCurrentQuestion = (): number | null => {
    const question = currentQuestion.value
    if (!question) return null
    return selectedAnswers.value[question.id] ?? null
  }

  const getAnswerForQuestion = (questionId: string): number | null => {
    return selectedAnswers.value[questionId] ?? null
  }

  return {
    // State
    currentQuizId,
    currentQuestionIndex,
    selectedAnswers,
    skippedQuestions,
    score,
    isCompleted,
    timeLeft,

    // Getters
    currentQuiz,
    currentQuestion,
    totalQuestions,
    progress,
    hasNextQuestion,
    hasPreviousQuestion,
    hasTimer,
    getCurrentQuestionTimeLimit,
    skippedCount,
    canSkip,
    remainingSkips,

    // Actions
    clearTimer,
    startTimer,
    selectQuiz,
    selectAnswer,
    skipQuestion,
    handleTimerExpiry,
    calculateScore,
    nextQuestion,
    previousQuestion,
    goToQuestion,
    completeQuiz,
    restartQuiz,
    backToQuizList,
    getAnswerForCurrentQuestion,
    getAnswerForQuestion,
  }
})
