import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useQuizSessionStore } from '../../stores/quiz/quiz-session-store'
import { useQuizStore } from '../../stores/quiz/quiz-store'
import type { Quiz } from '../../types/quiz'

describe('useQuizSessionStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('state', () => {
    it('should initialize with null currentQuizId', () => {
      const store = useQuizSessionStore()
      expect(store.currentQuizId).toBeNull()
    })

    it('should initialize with currentQuestionIndex at 0', () => {
      const store = useQuizSessionStore()
      expect(store.currentQuestionIndex).toBe(0)
    })

    it('should initialize with empty selectedAnswers', () => {
      const store = useQuizSessionStore()
      expect(store.selectedAnswers).toEqual({})
    })

    it('should initialize with score at 0', () => {
      const store = useQuizSessionStore()
      expect(store.score).toBe(0)
    })

    it('should initialize with isCompleted as false', () => {
      const store = useQuizSessionStore()
      expect(store.isCompleted).toBe(false)
    })
  })

  describe('getters', () => {
    it('currentQuiz should return null when currentQuizId is null', () => {
      const store = useQuizSessionStore()
      expect(store.currentQuiz).toBeNull()
    })

    it('currentQuiz should return the quiz when currentQuizId is set', () => {
      const quizStore = useQuizStore()
      const sessionStore = useQuizSessionStore()

      const quiz: Quiz = {
        id: 'test-quiz',
        title: 'Test Quiz',
        description: 'Test Description',
        questions: [
          {
            id: 'q1',
            text: 'Question 1',
            options: ['A', 'B', 'C'],
            correctAnswerIndex: 0,
          },
        ],
      }
      quizStore.addQuiz(quiz)
      sessionStore.selectQuiz('test-quiz')
      expect(sessionStore.currentQuiz).toEqual(quiz)
    })

    it('currentQuestion should return null when no quiz selected', () => {
      const store = useQuizSessionStore()
      expect(store.currentQuestion).toBeNull()
    })

    it('currentQuestion should return the first question when quiz selected', () => {
      const quizStore = useQuizStore()
      const sessionStore = useQuizSessionStore()

      const quiz: Quiz = {
        id: 'test-quiz',
        title: 'Test Quiz',
        description: 'Test Description',
        questions: [
          {
            id: 'q1',
            text: 'Question 1',
            options: ['A', 'B', 'C'],
            correctAnswerIndex: 0,
          },
        ],
      }
      quizStore.addQuiz(quiz)
      sessionStore.selectQuiz('test-quiz')
      expect(sessionStore.currentQuestion?.id).toBe('q1')
    })

    it('totalQuestions should return 0 when no quiz selected', () => {
      const store = useQuizSessionStore()
      expect(store.totalQuestions).toBe(0)
    })

    it('totalQuestions should return the number of questions in current quiz', () => {
      const quizStore = useQuizStore()
      const sessionStore = useQuizSessionStore()

      const quiz: Quiz = {
        id: 'test-quiz',
        title: 'Test Quiz',
        description: 'Test Description',
        questions: [
          { id: 'q1', text: 'Q1', options: ['A'], correctAnswerIndex: 0 },
          { id: 'q2', text: 'Q2', options: ['B'], correctAnswerIndex: 0 },
          { id: 'q3', text: 'Q3', options: ['C'], correctAnswerIndex: 0 },
        ],
      }
      quizStore.addQuiz(quiz)
      sessionStore.selectQuiz('test-quiz')
      expect(sessionStore.totalQuestions).toBe(3)
    })

    it('progress should return 0 when no questions', () => {
      const store = useQuizSessionStore()
      expect(store.progress).toBe(0)
    })

    it('hasNextQuestion should return false when no quiz selected', () => {
      const store = useQuizSessionStore()
      expect(store.hasNextQuestion).toBe(false)
    })

    it('hasNextQuestion should return true when not on last question', () => {
      const quizStore = useQuizStore()
      const sessionStore = useQuizSessionStore()

      const quiz: Quiz = {
        id: 'test-quiz',
        title: 'Test Quiz',
        description: 'Test Description',
        questions: [
          { id: 'q1', text: 'Q1', options: ['A'], correctAnswerIndex: 0 },
          { id: 'q2', text: 'Q2', options: ['B'], correctAnswerIndex: 0 },
        ],
      }
      quizStore.addQuiz(quiz)
      sessionStore.selectQuiz('test-quiz')
      expect(sessionStore.hasNextQuestion).toBe(true)
    })

    it('hasNextQuestion should return false when on last question', () => {
      const quizStore = useQuizStore()
      const sessionStore = useQuizSessionStore()

      const quiz: Quiz = {
        id: 'test-quiz',
        title: 'Test Quiz',
        description: 'Test Description',
        questions: [
          { id: 'q1', text: 'Q1', options: ['A'], correctAnswerIndex: 0 },
          { id: 'q2', text: 'Q2', options: ['B'], correctAnswerIndex: 0 },
        ],
      }
      quizStore.addQuiz(quiz)
      sessionStore.selectQuiz('test-quiz')
      sessionStore.currentQuestionIndex = 1
      expect(sessionStore.hasNextQuestion).toBe(false)
    })

    it('hasPreviousQuestion should return false when on first question', () => {
      const store = useQuizSessionStore()
      expect(store.hasPreviousQuestion).toBe(false)
    })

    it('hasPreviousQuestion should return true when not on first question', () => {
      const quizStore = useQuizStore()
      const sessionStore = useQuizSessionStore()

      const quiz: Quiz = {
        id: 'test-quiz',
        title: 'Test Quiz',
        description: 'Test Description',
        questions: [
          { id: 'q1', text: 'Q1', options: ['A'], correctAnswerIndex: 0 },
          { id: 'q2', text: 'Q2', options: ['B'], correctAnswerIndex: 0 },
        ],
      }
      quizStore.addQuiz(quiz)
      sessionStore.selectQuiz('test-quiz')
      sessionStore.nextQuestion()
      expect(sessionStore.hasPreviousQuestion).toBe(true)
    })
  })

  describe('actions', () => {
    it('selectQuiz should set currentQuizId and reset state', () => {
      const quizStore = useQuizStore()
      const sessionStore = useQuizSessionStore()

      const quiz: Quiz = {
        id: 'test-quiz',
        title: 'Test Quiz',
        description: 'Test Description',
        questions: [],
      }
      quizStore.addQuiz(quiz)

      sessionStore.selectQuiz('test-quiz')

      expect(sessionStore.currentQuizId).toBe('test-quiz')
      expect(sessionStore.currentQuestionIndex).toBe(0)
      expect(sessionStore.selectedAnswers).toEqual({})
      expect(sessionStore.score).toBe(0)
      expect(sessionStore.isCompleted).toBe(false)
    })

    it('selectQuiz should do nothing when quiz not found', () => {
      const sessionStore = useQuizSessionStore()
      sessionStore.selectQuiz('non-existent')
      expect(sessionStore.currentQuizId).toBeNull()
    })

    it('selectAnswer should record the answer for current question', () => {
      const quizStore = useQuizStore()
      const sessionStore = useQuizSessionStore()

      const quiz: Quiz = {
        id: 'test-quiz',
        title: 'Test Quiz',
        description: 'Test Description',
        questions: [
          { id: 'q1', text: 'Q1', options: ['A', 'B'], correctAnswerIndex: 0 },
        ],
      }
      quizStore.addQuiz(quiz)
      sessionStore.selectQuiz('test-quiz')
      sessionStore.selectAnswer(1)
      expect(sessionStore.getAnswerForQuestion('q1')).toBe(1)
    })

    it('calculateScore should set score to 0 when no answers', () => {
      const quizStore = useQuizStore()
      const sessionStore = useQuizSessionStore()

      const quiz: Quiz = {
        id: 'test-quiz',
        title: 'Test Quiz',
        description: 'Test Description',
        questions: [
          { id: 'q1', text: 'Q1', options: ['A', 'B'], correctAnswerIndex: 0 },
        ],
      }
      quizStore.addQuiz(quiz)
      sessionStore.selectQuiz('test-quiz')
      sessionStore.calculateScore()
      expect(sessionStore.score).toBe(0)
    })

    it('calculateScore should count correct answers', () => {
      const quizStore = useQuizStore()
      const sessionStore = useQuizSessionStore()

      const quiz: Quiz = {
        id: 'test-quiz',
        title: 'Test Quiz',
        description: 'Test Description',
        questions: [
          { id: 'q1', text: 'Q1', options: ['A', 'B'], correctAnswerIndex: 0 },
          { id: 'q2', text: 'Q2', options: ['C', 'D'], correctAnswerIndex: 1 },
        ],
      }
      quizStore.addQuiz(quiz)
      sessionStore.selectQuiz('test-quiz')

      // Select correct answer for q1, wrong for q2
      sessionStore.selectAnswer(0) // correct
      sessionStore.nextQuestion()
      sessionStore.selectAnswer(0) // wrong (correct is 1)

      sessionStore.calculateScore()
      expect(sessionStore.score).toBe(1)
    })

    it('nextQuestion should increment currentQuestionIndex', () => {
      const quizStore = useQuizStore()
      const sessionStore = useQuizSessionStore()

      const quiz: Quiz = {
        id: 'test-quiz',
        title: 'Test Quiz',
        description: 'Test Description',
        questions: [
          { id: 'q1', text: 'Q1', options: ['A'], correctAnswerIndex: 0 },
          { id: 'q2', text: 'Q2', options: ['B'], correctAnswerIndex: 0 },
        ],
      }
      quizStore.addQuiz(quiz)
      sessionStore.selectQuiz('test-quiz')

      expect(sessionStore.currentQuestionIndex).toBe(0)
      sessionStore.nextQuestion()
      expect(sessionStore.currentQuestionIndex).toBe(1)
    })

    it('nextQuestion should not increment when on last question', () => {
      const quizStore = useQuizStore()
      const sessionStore = useQuizSessionStore()

      const quiz: Quiz = {
        id: 'test-quiz',
        title: 'Test Quiz',
        description: 'Test Description',
        questions: [
          { id: 'q1', text: 'Q1', options: ['A'], correctAnswerIndex: 0 },
        ],
      }
      quizStore.addQuiz(quiz)
      sessionStore.selectQuiz('test-quiz')
      sessionStore.currentQuestionIndex = 0

      sessionStore.nextQuestion()
      expect(sessionStore.currentQuestionIndex).toBe(0)
    })

    it('previousQuestion should decrement currentQuestionIndex', () => {
      const quizStore = useQuizStore()
      const sessionStore = useQuizSessionStore()

      const quiz: Quiz = {
        id: 'test-quiz',
        title: 'Test Quiz',
        description: 'Test Description',
        questions: [
          { id: 'q1', text: 'Q1', options: ['A'], correctAnswerIndex: 0 },
          { id: 'q2', text: 'Q2', options: ['B'], correctAnswerIndex: 0 },
        ],
      }
      quizStore.addQuiz(quiz)
      sessionStore.selectQuiz('test-quiz')
      sessionStore.nextQuestion()

      expect(sessionStore.currentQuestionIndex).toBe(1)
      sessionStore.previousQuestion()
      expect(sessionStore.currentQuestionIndex).toBe(0)
    })

    it('previousQuestion should not decrement when on first question', () => {
      const store = useQuizSessionStore()
      store.previousQuestion()
      expect(store.currentQuestionIndex).toBe(0)
    })

    it('completeQuiz should calculate score and set isCompleted to true', () => {
      const quizStore = useQuizStore()
      const sessionStore = useQuizSessionStore()

      const quiz: Quiz = {
        id: 'test-quiz',
        title: 'Test Quiz',
        description: 'Test Description',
        questions: [
          { id: 'q1', text: 'Q1', options: ['A', 'B'], correctAnswerIndex: 0 },
        ],
      }
      quizStore.addQuiz(quiz)
      sessionStore.selectQuiz('test-quiz')
      sessionStore.selectAnswer(0) // correct

      expect(sessionStore.isCompleted).toBe(false)
      sessionStore.completeQuiz()
      expect(sessionStore.isCompleted).toBe(true)
      expect(sessionStore.score).toBe(1)
    })

    it('restartQuiz should reset session state', () => {
      const quizStore = useQuizStore()
      const sessionStore = useQuizSessionStore()

      const quiz: Quiz = {
        id: 'test-quiz',
        title: 'Test Quiz',
        description: 'Test Description',
        questions: [
          { id: 'q1', text: 'Q1', options: ['A'], correctAnswerIndex: 0 },
        ],
      }
      quizStore.addQuiz(quiz)
      sessionStore.selectQuiz('test-quiz')
      sessionStore.selectAnswer(0)
      sessionStore.nextQuestion()

      sessionStore.restartQuiz()

      expect(sessionStore.currentQuestionIndex).toBe(0)
      expect(sessionStore.selectedAnswers).toEqual({})
      expect(sessionStore.score).toBe(0)
      expect(sessionStore.isCompleted).toBe(false)
    })

    it('backToQuizList should reset all state', () => {
      const quizStore = useQuizStore()
      const sessionStore = useQuizSessionStore()

      const quiz: Quiz = {
        id: 'test-quiz',
        title: 'Test Quiz',
        description: 'Test Description',
        questions: [],
      }
      quizStore.addQuiz(quiz)
      sessionStore.selectQuiz('test-quiz')
      sessionStore.selectAnswer(0)

      sessionStore.backToQuizList()

      expect(sessionStore.currentQuizId).toBeNull()
      expect(sessionStore.currentQuestionIndex).toBe(0)
      expect(sessionStore.selectedAnswers).toEqual({})
      expect(sessionStore.score).toBe(0)
      expect(sessionStore.isCompleted).toBe(false)
    })

    it('handleTimerExpiry should move to next question when not on last question', () => {
      const quizStore = useQuizStore()
      const sessionStore = useQuizSessionStore()

      const quiz: Quiz = {
        id: 'test-quiz',
        title: 'Test Quiz',
        description: 'Test Description',
        questions: [
          { id: 'q1', text: 'Q1', options: ['A'], correctAnswerIndex: 0 },
          { id: 'q2', text: 'Q2', options: ['B'], correctAnswerIndex: 0 },
        ],
      }
      quizStore.addQuiz(quiz)
      sessionStore.selectQuiz('test-quiz')

      expect(sessionStore.currentQuestionIndex).toBe(0)
      const result = sessionStore.handleTimerExpiry()
      expect(result).toBe(false)
      expect(sessionStore.currentQuestionIndex).toBe(1)
    })

    it('handleTimerExpiry should complete quiz when on last question', () => {
      const quizStore = useQuizStore()
      const sessionStore = useQuizSessionStore()

      const quiz: Quiz = {
        id: 'test-quiz',
        title: 'Test Quiz',
        description: 'Test Description',
        questions: [
          { id: 'q1', text: 'Q1', options: ['A'], correctAnswerIndex: 0 },
          { id: 'q2', text: 'Q2', options: ['B'], correctAnswerIndex: 0 },
        ],
      }
      quizStore.addQuiz(quiz)
      sessionStore.selectQuiz('test-quiz')
      sessionStore.currentQuestionIndex = 1 // Go to last question

      expect(sessionStore.isCompleted).toBe(false)
      const result = sessionStore.handleTimerExpiry()
      expect(result).toBe(true)
      expect(sessionStore.isCompleted).toBe(true)
      expect(sessionStore.currentQuestionIndex).toBe(1)
    })

    it('handleTimerExpiry should nullify current question answer', () => {
      const quizStore = useQuizStore()
      const sessionStore = useQuizSessionStore()

      const quiz: Quiz = {
        id: 'test-quiz',
        title: 'Test Quiz',
        description: 'Test Description',
        questions: [
          { id: 'q1', text: 'Q1', options: ['A', 'B'], correctAnswerIndex: 0 },
          { id: 'q2', text: 'Q2', options: ['C', 'D'], correctAnswerIndex: 0 },
        ],
      }
      quizStore.addQuiz(quiz)
      sessionStore.selectQuiz('test-quiz')
      sessionStore.selectAnswer(0) // Select answer for q1

      expect(sessionStore.getAnswerForQuestion('q1')).toBe(0)
      sessionStore.handleTimerExpiry()
      expect(sessionStore.getAnswerForQuestion('q1')).toBeNull()
    })
  })
})
