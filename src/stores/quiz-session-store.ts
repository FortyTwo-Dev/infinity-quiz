import { defineStore } from 'pinia'
import { useQuizStore, useQuizHistoryStore } from './'

interface QuizSessionState {
  currentQuizId: string | null
  currentQuestionIndex: number
  selectedAnswers: Record<string, number | null>
  score: number
  isCompleted: boolean
  timeLeft: number | null
  timerInterval: ReturnType<typeof setInterval> | null
}

export const useQuizSessionStore = defineStore(
  'quizSession',
  {
    state: (): QuizSessionState => ({
      currentQuizId: null,
      currentQuestionIndex: 0,
      selectedAnswers: {},
      score: 0,
      isCompleted: false,
      timeLeft: null,
      timerInterval: null,
    }),

    getters: {
      currentQuiz(state) {
        const quizStore = useQuizStore()
        if (!state.currentQuizId) return null
        return quizStore.getQuizById(state.currentQuizId) ?? null
      },

      currentQuestion(state) {
        const quizStore = useQuizStore()
        if (!state.currentQuizId) return null
        const quiz = quizStore.getQuizById(state.currentQuizId)
        if (!quiz || state.currentQuestionIndex >= quiz.questions.length) return null
        return quiz.questions[state.currentQuestionIndex]
      },

      totalQuestions(state) {
        const quizStore = useQuizStore()
        if (!state.currentQuizId) return 0
        const quiz = quizStore.getQuizById(state.currentQuizId)
        return quiz?.questions.length ?? 0
      },

      progress(state) {
        const quizStore = useQuizStore()
        if (!state.currentQuizId) return 0
        const quiz = quizStore.getQuizById(state.currentQuizId)
        if (!quiz) return 0
        const total = quiz.questions.length
        if (total === 0) return 0
        return (state.currentQuestionIndex / total) * 100
      },

      hasNextQuestion(state) {
        const quizStore = useQuizStore()
        if (!state.currentQuizId) return false
        const quiz = quizStore.getQuizById(state.currentQuizId)
        if (!quiz) return false
        return state.currentQuestionIndex < quiz.questions.length - 1
      },

      hasPreviousQuestion(state) {
        return state.currentQuestionIndex > 0
      },

      hasTimer(state) {
        return state.timeLeft !== null
      },

      getCurrentQuestionTimeLimit(state): number | null {
        const quizStore = useQuizStore()
        if (!state.currentQuizId) return null
        const quiz = quizStore.getQuizById(state.currentQuizId)
        if (!quiz) return null
        const currentQuestion = quiz.questions[state.currentQuestionIndex]
        if (!currentQuestion) return null

        // Question-level time limit takes priority over quiz-level
        if (currentQuestion.timeLimit !== undefined) {
          return currentQuestion.timeLimit
        }
        return quiz.timeLimit ?? null
      },
    },

    actions: {
      clearTimer() {
        if (this.timerInterval) {
          clearInterval(this.timerInterval)
          this.timerInterval = null
        }
        this.timeLeft = null
      },

      startTimer(duration: number) {
        this.clearTimer()
        this.timeLeft = duration
        this.timerInterval = setInterval(() => {
          if (this.timeLeft === null) return
          this.timeLeft--
          if (this.timeLeft <= 0) {
            this.clearTimer()
            this.handleTimerExpiry()
          }
        }, 1000)
      },

      handleTimerExpiry() {
        // Mark current answer as empty (null = not answered = wrong)
        const currentQuestion = this.currentQuestion
        if (currentQuestion) {
          this.selectedAnswers[currentQuestion.id] = null
        }

        // Move to next question or complete quiz
        if (this.hasNextQuestion) {
          this.nextQuestion()
        } else {
          this.completeQuiz()
        }
      },

      selectQuiz(quizId: string) {
        const quizStore = useQuizStore()
        const quiz = quizStore.getQuizById(quizId)
        if (!quiz) return

        this.clearTimer()
        this.currentQuizId = quizId
        this.currentQuestionIndex = 0
        this.selectedAnswers = {}
        this.score = 0
        this.isCompleted = false

        // Start timer if quiz or first question has time limit
        const timeLimit = quiz.timeLimit ?? quiz.questions[0]?.timeLimit
        if (timeLimit !== undefined && timeLimit > 0) {
          this.startTimer(timeLimit)
        }
      },

      selectAnswer(answerIndex: number) {
        const question = this.currentQuestion
        if (!question) return
        this.selectedAnswers[question.id] = answerIndex
      },

      calculateScore() {
        if (!this.currentQuiz) return

        let newScore = 0
        for (const question of this.currentQuiz.questions) {
          const selectedIndex = this.selectedAnswers[question.id]
          if (selectedIndex !== undefined && selectedIndex !== null) {
            if (selectedIndex === question.correctAnswerIndex) {
              newScore += 1
            }
          }
          // null answers are counted as wrong (not incrementing score)
        }
        this.score = newScore
      },

      nextQuestion() {
        if (!this.hasNextQuestion) return
        this.clearTimer()
        this.currentQuestionIndex += 1

        // Start timer for new question if it has a time limit
        const timeLimit = this.getCurrentQuestionTimeLimit
        if (timeLimit !== null && timeLimit > 0) {
          this.startTimer(timeLimit)
        }
      },

      previousQuestion() {
        if (!this.hasPreviousQuestion) return
        this.clearTimer()
        this.currentQuestionIndex -= 1

        // Start timer for previous question if it has a time limit
        const timeLimit = this.getCurrentQuestionTimeLimit
        if (timeLimit !== null && timeLimit > 0) {
          this.startTimer(timeLimit)
        }
      },

      goToQuestion(index: number) {
        if (index < 0 || index >= this.totalQuestions) return
        this.clearTimer()
        this.currentQuestionIndex = index

        // Start timer for new question if it has a time limit
        const timeLimit = this.getCurrentQuestionTimeLimit
        if (timeLimit !== null && timeLimit > 0) {
          this.startTimer(timeLimit)
        }
      },

      completeQuiz() {
        this.clearTimer()
        this.calculateScore()
        this.isCompleted = true

        // Save result to history
        const historyStore = useQuizHistoryStore()
        const quiz = this.currentQuiz
        if (quiz) {
          const passed = this.score >= quiz.questions.length * 0.7 // 70% to pass
          historyStore.addResult(quiz.id, this.score, quiz.questions.length, passed)
        }
      },

      restartQuiz() {
        if (!this.currentQuizId) return

        this.clearTimer()
        this.currentQuestionIndex = 0
        this.selectedAnswers = {}
        this.score = 0
        this.isCompleted = false

        // Restart timer for first question if it has a time limit
        const timeLimit = this.getCurrentQuestionTimeLimit
        if (timeLimit !== null && timeLimit > 0) {
          this.startTimer(timeLimit)
        }
      },

      backToQuizList() {
        this.clearTimer()
        this.currentQuizId = null
        this.currentQuestionIndex = 0
        this.selectedAnswers = {}
        this.score = 0
        this.isCompleted = false
      },

      getAnswerForCurrentQuestion(): number | null {
        const question = this.currentQuestion
        if (!question) return null
        return this.selectedAnswers[question.id] ?? null
      },

      getAnswerForQuestion(questionId: string): number | null {
        return this.selectedAnswers[questionId] ?? null
      },
    },

    persist: {
      key: 'quiz-session',
      pick: ['currentQuizId', 'currentQuestionIndex', 'selectedAnswers', 'score', 'isCompleted'],
    },
  },
)
