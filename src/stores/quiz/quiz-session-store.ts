import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useQuizStore } from './quiz-store'
import { useQuizHistoryStore } from './quiz-history-store'
import { isPassed } from '../../composables/useScore'
import { shuffle } from '../../utils/array-utils'
import { STORAGE_KEYS } from '../../constants'
import type { Quiz, QuestionResult } from '../../types/quiz'

export const useQuizSessionStore = defineStore(
  'quizSession',
  () => {
    // Timer state
    const timeLeft = ref<number | null>(null)
    const timerInterval = ref<ReturnType<typeof setInterval> | null>(null)
    const onExpiryCallback = ref<(() => boolean) | null>(null)

    // State
    const currentQuizId = ref<string | null>(null)
    const currentQuestionIndex = ref<number>(0)
    const selectedAnswers = ref<Record<string, number | null>>({})
    const skippedQuestions = ref<Record<string, true>>({})
    const verifiedQuestions = ref<Record<string, true>>({})
    const score = ref<number>(0)
    const isCompleted = ref<boolean>(false)
    const shuffledQuiz = ref<Quiz | null>(null)
    const quizSeed = ref<string | null>(null)

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
      // Progress reflects the question currently shown, so the bar reaches
      // 100% on the last question instead of capping below it.
      return ((currentQuestionIndex.value + 1) / total) * 100
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
      return Object.keys(skippedQuestions.value).length
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

    const canReview = computed(() => {
      const quiz = currentQuiz.value
      if (!quiz) return false
      return quiz.enableReviewMode === true
    })

    const hasFeedbackEnabled = computed(() => {
      const quiz = currentQuiz.value
      if (!quiz) return false
      return quiz.feedbackEnabled === true
    })

    const isCurrentQuestionVerified = computed(() => {
      const question = currentQuestion.value
      if (!question) return false
      return verifiedQuestions.value[question.id] === true
    })

    const canSkipCurrentQuestion = computed(() => {
      return canSkip.value && !isCurrentQuestionVerified.value
    })

    const getQuestionResults = computed(() => {
      const quiz = currentQuiz.value
      if (!quiz) return [] as QuestionResult[]
      return quiz.questions.map((question): QuestionResult => {
        const userAnswer = selectedAnswers.value[question.id] ?? null
        const isSkipped = skippedQuestions.value[question.id] === true
        return {
          question,
          userAnswer,
          isCorrect: userAnswer === question.correctAnswerIndex,
          isSkipped,
        }
      })
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

    // Timer expiry handler for quiz session
    const handleTimerExpiry = (): boolean => {
      const question = currentQuestion.value
      const quiz = currentQuiz.value

      if (question) {
        selectedAnswers.value[question.id] = null
      }

      // Determine timer type:
      // - Per-question timer: question has timeLimit defined
      // - Global timer: quiz has timeLimit defined and current question doesn't have its own
      // - No timer: neither quiz nor question has timeLimit (shouldn't happen, but handle gracefully)
      if (quiz?.timeLimit !== undefined && question?.timeLimit === undefined) {
        // Global timer: complete the quiz
        completeQuiz()
        return true
      }

      // Per-question timer or no timer: check if there's a next question
      if (hasNextQuestion.value) {
        nextQuestion()
        return false
      }
      completeQuiz()
      return true
    }

    // Timer actions
    const clearTimer = () => {
      if (timerInterval.value) {
        clearInterval(timerInterval.value)
        timerInterval.value = null
      }
      timeLeft.value = null
    }

    const runTimer = (initialDuration: number | null) => {
      clearTimer()
      timeLeft.value = initialDuration

      const interval = setInterval(() => {
        if (timeLeft.value === null) return
        timeLeft.value--
        if (timeLeft.value <= 0) {
          const callback = onExpiryCallback.value
          clearTimer()
          onExpiryCallback.value = null
          if (callback) {
            callback()
          }
        }
      }, 1000)

      onExpiryCallback.value = handleTimerExpiry
      timerInterval.value = interval
    }

    const startTimer = (duration: number) => {
      runTimer(duration)
    }

    /**
     * Resume a persisted timer without resetting the remaining time.
     * No-op when there is no time left or the quiz is already completed.
     */
    const resumeTimer = () => {
      if (isCompleted.value || timeLeft.value === null || timeLeft.value <= 0) return
      runTimer(timeLeft.value)
    }

    // Actions
    const selectQuiz = (quizId: string, seed?: string) => {
      const quizStore = useQuizStore()
      const originalQuiz = quizStore.getQuizById(quizId)
      if (!originalQuiz) return

      clearTimer()
      currentQuizId.value = quizId
      currentQuestionIndex.value = 0
      selectedAnswers.value = {}
      skippedQuestions.value = {}
      verifiedQuestions.value = {}
      score.value = 0
      isCompleted.value = false
      quizSeed.value = seed ?? null

      if (originalQuiz.shuffleQuestions) {
        shuffledQuiz.value = {
          ...originalQuiz,
          questions: shuffle([...originalQuiz.questions], seed),
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

      // Prevent changing answer if question is already verified
      if (verifiedQuestions.value[question.id] === true) {
        return
      }

      selectedAnswers.value[question.id] = answerIndex
      delete skippedQuestions.value[question.id]
    }

    const skipQuestion = (): boolean => {
      const question = currentQuestion.value
      if (!question) return false
      if (!canSkipCurrentQuestion.value) return false

      selectedAnswers.value[question.id] = null
      skippedQuestions.value[question.id] = true

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

      const quiz = currentQuiz.value
      // Get current question before changing index
      const currentQuestionIndexVal = currentQuestionIndex.value
      const quizQuestions = quiz?.questions
      const currentQuestion = quizQuestions?.[currentQuestionIndexVal]

      // Check if we have a global timer (quiz has timeLimit, current question doesn't)
      const hasGlobalTimer = quiz?.timeLimit !== undefined && currentQuestion?.timeLimit === undefined

      // For global timer: just change question, timer keeps running independently
      // For per-question timer: need to clear and restart timer
      if (hasGlobalTimer) {
        // Global timer: just change question, timer continues running
        currentQuestionIndex.value += 1
      } else {
        // Per-question timer: clear and restart with fresh time limit
        clearTimer()
        currentQuestionIndex.value += 1

        const timeLimit = getCurrentQuestionTimeLimit.value
        if (timeLimit !== null && timeLimit > 0) {
          startTimer(timeLimit)
        }
      }
    }

    const previousQuestion = () => {
      if (!hasPreviousQuestion.value) return

      const quiz = currentQuiz.value
      // Get current question before changing index
      const currentQuestionIndexVal = currentQuestionIndex.value
      const quizQuestions = quiz?.questions
      const currentQuestion = quizQuestions?.[currentQuestionIndexVal]

      // Check if we have a global timer (quiz has timeLimit, current question doesn't)
      const hasGlobalTimer = quiz?.timeLimit !== undefined && currentQuestion?.timeLimit === undefined

      // For global timer: just change question, timer keeps running independently
      // For per-question timer: need to clear and restart timer
      if (hasGlobalTimer) {
        // Global timer: just change question, timer continues running
        currentQuestionIndex.value -= 1
      } else {
        // Per-question timer: clear and restart with fresh time limit
        clearTimer()
        currentQuestionIndex.value -= 1

        const timeLimit = getCurrentQuestionTimeLimit.value
        if (timeLimit !== null && timeLimit > 0) {
          startTimer(timeLimit)
        }
      }
    }

    const goToQuestion = (index: number) => {
      if (index < 0 || index >= totalQuestions.value) return

      const quiz = currentQuiz.value
      // Get current question before changing index
      const currentQuestionIndexVal = currentQuestionIndex.value
      const quizQuestions = quiz?.questions
      const currentQuestion = quizQuestions?.[currentQuestionIndexVal]

      // Check if we have a global timer (quiz has timeLimit, current question doesn't)
      const hasGlobalTimer = quiz?.timeLimit !== undefined && currentQuestion?.timeLimit === undefined

      // For global timer: just change question, timer keeps running independently
      // For per-question timer: need to clear and restart timer
      if (hasGlobalTimer) {
        // Global timer: just change question, timer continues running
        currentQuestionIndex.value = index
      } else {
        // Per-question timer: clear and restart with fresh time limit
        clearTimer()
        currentQuestionIndex.value = index

        const timeLimit = getCurrentQuestionTimeLimit.value
        if (timeLimit !== null && timeLimit > 0) {
          startTimer(timeLimit)
        }
      }
    }

    const completeQuiz = () => {
      clearTimer()
      calculateScore()
      isCompleted.value = true

      const historyStore = useQuizHistoryStore()
      const quiz = currentQuiz.value
      if (quiz) {
        const passed = isPassed(score.value, quiz.questions.length)
        historyStore.addResult(quiz.id, score.value, quiz.questions.length, passed)
      }
    }

    const restartQuiz = () => {
      if (!currentQuizId.value) return

      clearTimer()
      currentQuestionIndex.value = 0
      selectedAnswers.value = {}
      skippedQuestions.value = {}
      verifiedQuestions.value = {}
      score.value = 0
      isCompleted.value = false

      const quizStore = useQuizStore()
      const originalQuiz = quizStore.getQuizById(currentQuizId.value)
      if (originalQuiz?.shuffleQuestions) {
        shuffledQuiz.value = {
          ...originalQuiz,
          questions: shuffle([...originalQuiz.questions], quizSeed.value ?? undefined),
        }
      }

      const quiz = shuffledQuiz.value ?? originalQuiz
      const firstQuestion = quiz?.questions[0]

      // Start timer: prefer per-question timer, fall back to global timer
      if (firstQuestion?.timeLimit !== undefined && firstQuestion.timeLimit > 0) {
        startTimer(firstQuestion.timeLimit)
      } else if (quiz?.timeLimit !== undefined && quiz.timeLimit > 0) {
        startTimer(quiz.timeLimit)
      }
    }

    const backToQuizList = () => {
      clearTimer()
      currentQuizId.value = null
      currentQuestionIndex.value = 0
      selectedAnswers.value = {}
      skippedQuestions.value = {}
      verifiedQuestions.value = {}
      score.value = 0
      isCompleted.value = false
      shuffledQuiz.value = null
      quizSeed.value = null
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
      verifiedQuestions,
      score,
      isCompleted,
      timeLeft,
      shuffledQuiz,
      quizSeed,

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
      canSkipCurrentQuestion,
      remainingSkips,
      canReview,
      hasFeedbackEnabled,
      isCurrentQuestionVerified,
      getQuestionResults,

      // Actions
      clearTimer,
      startTimer,
      resumeTimer,
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
  },
  {
    persist: {
      key: STORAGE_KEYS.session,
      pick: [
        'currentQuizId',
        'currentQuestionIndex',
        'selectedAnswers',
        'skippedQuestions',
        'verifiedQuestions',
        'score',
        'isCompleted',
        'shuffledQuiz',
        'quizSeed',
        'timeLeft',
      ],
    },
  },
)
