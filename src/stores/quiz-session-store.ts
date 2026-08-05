import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useQuizStore, useQuizHistoryStore } from './'
import { shuffle } from '../utils/array-utils'
import type { Quiz, Question } from '../types/quiz'

export const useQuizSessionStore = defineStore('quizSession', () => {
  // State
  const currentQuizId = ref<string | null>(null)
  const currentQuestionIndex = ref<number>(0)
  const selectedAnswers = ref<Record<string, number | null>>({})
  const score = ref<number>(0)
  const isCompleted = ref<boolean>(false)
  const timeLeft = ref<number | null>(null)
  const timerInterval = ref<ReturnType<typeof setInterval> | null>(null)
  const shuffledQuiz = ref<Quiz | null>(null)
  const shuffledQuestions = ref<Map<string, Question>>(new Map())

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
    return shuffleQuestionAnswers(question)
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

  const getCurrentQuestionTimeLimit = computed(() => {
    const quiz = currentQuiz.value
    if (!quiz) return null
    const currentQuestion = quiz.questions[currentQuestionIndex.value]
    if (!currentQuestion) return null

    // Question-level time limit takes priority over quiz-level
    if (currentQuestion.timeLimit !== undefined) {
      return currentQuestion.timeLimit
    }
    return quiz.timeLimit ?? null
  })

  // Helper functions
  const shuffleQuestionAnswers = (question: Question): Question => {
    // Check if we already have a shuffled version of this question
    const cached = shuffledQuestions.value.get(question.id)
    if (cached) return cached

    // Check if this question should have its answers shuffled
    const quiz = currentQuiz.value
    const shouldShuffle = question.shuffleAnswers ?? quiz?.shuffleAnswers ?? false

    if (!shouldShuffle) {
      shuffledQuestions.value.set(question.id, question)
      return question
    }

    // Shuffle options and recalculate correctAnswerIndex
    const shuffledOptions = shuffle([...question.options])
    const originalCorrectIndex = question.correctAnswerIndex
    const correctOption = question.options[originalCorrectIndex]
    const newCorrectIndex = shuffledOptions.findIndex(opt => opt === correctOption)

    const shuffledQuestion = {
      ...question,
      options: shuffledOptions,
      correctAnswerIndex: newCorrectIndex,
    }

    shuffledQuestions.value.set(question.id, shuffledQuestion)
    return shuffledQuestion
  }

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

  const handleTimerExpiry = () => {
    // Mark current answer as empty (null = not answered = wrong)
    const question = currentQuestion.value
    if (question) {
      selectedAnswers.value[question.id] = null
    }

    // Move to next question or complete quiz
    if (hasNextQuestion.value) {
      nextQuestion()
    } else {
      completeQuiz()
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
    score.value = 0
    isCompleted.value = false
    shuffledQuestions.value = new Map()

    // Shuffle questions if enabled
    if (originalQuiz.shuffleQuestions) {
      shuffledQuiz.value = {
        ...originalQuiz,
        questions: shuffle([...originalQuiz.questions]),
      }
    } else {
      shuffledQuiz.value = null
    }

    // Start timer if quiz or first question has time limit
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
      // null answers are counted as wrong (not incrementing score)
    }
    score.value = newScore
  }

  const nextQuestion = () => {
    if (!hasNextQuestion.value) return
    clearTimer()
    currentQuestionIndex.value += 1

    // Start timer for new question if it has a time limit
    const timeLimit = getCurrentQuestionTimeLimit.value
    if (timeLimit !== null && timeLimit > 0) {
      startTimer(timeLimit)
    }
  }

  const previousQuestion = () => {
    if (!hasPreviousQuestion.value) return
    clearTimer()
    currentQuestionIndex.value -= 1

    // Start timer for previous question if it has a time limit
    const timeLimit = getCurrentQuestionTimeLimit.value
    if (timeLimit !== null && timeLimit > 0) {
      startTimer(timeLimit)
    }
  }

  const goToQuestion = (index: number) => {
    if (index < 0 || index >= totalQuestions.value) return
    clearTimer()
    currentQuestionIndex.value = index

    // Start timer for new question if it has a time limit
    const timeLimit = getCurrentQuestionTimeLimit.value
    if (timeLimit !== null && timeLimit > 0) {
      startTimer(timeLimit)
    }
  }

  const completeQuiz = () => {
    clearTimer()
    calculateScore()
    isCompleted.value = true

    // Save result to history
    const historyStore = useQuizHistoryStore()
    const quiz = currentQuiz.value
    if (quiz) {
      const passed = score.value >= quiz.questions.length * 0.7 // 70% to pass
      historyStore.addResult(quiz.id, score.value, quiz.questions.length, passed)
    }
  }

  const restartQuiz = () => {
    if (!currentQuizId.value) return

    clearTimer()
    currentQuestionIndex.value = 0
    selectedAnswers.value = {}
    score.value = 0
    isCompleted.value = false
    shuffledQuestions.value = new Map()

    // Re-shuffle questions on restart
    const quizStore = useQuizStore()
    const originalQuiz = quizStore.getQuizById(currentQuizId.value)
    if (originalQuiz?.shuffleQuestions) {
      shuffledQuiz.value = {
        ...originalQuiz,
        questions: shuffle([...originalQuiz.questions]),
      }
    }

    // Restart timer for first question if it has a time limit
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
    score.value = 0
    isCompleted.value = false
    shuffledQuiz.value = null
    shuffledQuestions.value = new Map()
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

    // Actions
    clearTimer,
    startTimer,
    selectQuiz,
    selectAnswer,
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
