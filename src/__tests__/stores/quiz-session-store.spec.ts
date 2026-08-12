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

    it('progress should return 0 when total questions is 0', () => {
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
      expect(sessionStore.currentQuiz).not.toBeNull()
      expect(sessionStore.totalQuestions).toBe(0)
      expect(sessionStore.progress).toBe(0)
    })

    it('progress should return correct percentage when quiz has questions', () => {
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
      expect(sessionStore.progress).toBe(0)

      sessionStore.nextQuestion()
      expect(sessionStore.progress).toBe(50)
    })

    it('hasTimer should return false when timeLeft is null', () => {
      const store = useQuizSessionStore()
      expect(store.hasTimer).toBe(false)
    })

    it('skippedCount should return 0 when no questions skipped', () => {
      const store = useQuizSessionStore()
      expect(store.skippedCount).toBe(0)
    })

    it('skippedCount should return correct count when questions skipped', () => {
      const store = useQuizSessionStore()
      store.skippedQuestions = new Set(['q1', 'q2'])
      expect(store.skippedCount).toBe(2)
    })

    it('canSkip should return true when quiz has no maxSkips', () => {
      const quizStore = useQuizStore()
      const sessionStore = useQuizSessionStore()

      const quiz: Quiz = {
        id: 'test-quiz',
        title: 'Test Quiz',
        description: 'Test Description',
        questions: [{ id: 'q1', text: 'Q1', options: ['A'], correctAnswerIndex: 0 }],
      }
      quizStore.addQuiz(quiz)
      sessionStore.selectQuiz('test-quiz')
      expect(sessionStore.canSkip).toBe(true)
    })

    it('canSkip should return true when skippedCount < maxSkips', () => {
      const quizStore = useQuizStore()
      const sessionStore = useQuizSessionStore()

      const quiz: Quiz = {
        id: 'test-quiz',
        title: 'Test Quiz',
        description: 'Test Description',
        questions: [{ id: 'q1', text: 'Q1', options: ['A'], correctAnswerIndex: 0 }],
        maxSkips: 3,
      }
      quizStore.addQuiz(quiz)
      sessionStore.selectQuiz('test-quiz')
      sessionStore.skippedQuestions.add('q1')
      expect(sessionStore.canSkip).toBe(true)
    })

    it('canSkip should return false when skippedCount >= maxSkips', () => {
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
        maxSkips: 1,
      }
      quizStore.addQuiz(quiz)
      sessionStore.selectQuiz('test-quiz')
      sessionStore.skippedQuestions.add('q1')
      expect(sessionStore.canSkip).toBe(false)
    })

    it('canReview should return true when quiz has no enableReviewMode', () => {
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
      expect(sessionStore.canReview).toBe(true)
    })

    it('canReview should return true when enableReviewMode is true', () => {
      const quizStore = useQuizStore()
      const sessionStore = useQuizSessionStore()

      const quiz: Quiz = {
        id: 'test-quiz',
        title: 'Test Quiz',
        description: 'Test Description',
        questions: [],
        enableReviewMode: true,
      }
      quizStore.addQuiz(quiz)
      sessionStore.selectQuiz('test-quiz')
      expect(sessionStore.canReview).toBe(true)
    })

    it('canReview should return false when enableReviewMode is false', () => {
      const quizStore = useQuizStore()
      const sessionStore = useQuizSessionStore()

      const quiz: Quiz = {
        id: 'test-quiz',
        title: 'Test Quiz',
        description: 'Test Description',
        questions: [],
        enableReviewMode: false,
      }
      quizStore.addQuiz(quiz)
      sessionStore.selectQuiz('test-quiz')
      expect(sessionStore.canReview).toBe(false)
    })

    it('hasFeedbackEnabled should return false when quiz has no feedbackEnabled', () => {
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
      expect(sessionStore.hasFeedbackEnabled).toBe(false)
    })

    it('hasFeedbackEnabled should return true when feedbackEnabled is true', () => {
      const quizStore = useQuizStore()
      const sessionStore = useQuizSessionStore()

      const quiz: Quiz = {
        id: 'test-quiz',
        title: 'Test Quiz',
        description: 'Test Description',
        questions: [],
        feedbackEnabled: true,
      }
      quizStore.addQuiz(quiz)
      sessionStore.selectQuiz('test-quiz')
      expect(sessionStore.hasFeedbackEnabled).toBe(true)
    })

    it('isCurrentQuestionVerified should return false when no current question', () => {
      const store = useQuizSessionStore()
      expect(store.isCurrentQuestionVerified).toBe(false)
    })

    it('isCurrentQuestionVerified should return false when question not verified', () => {
      const quizStore = useQuizStore()
      const sessionStore = useQuizSessionStore()

      const quiz: Quiz = {
        id: 'test-quiz',
        title: 'Test Quiz',
        description: 'Test Description',
        questions: [{ id: 'q1', text: 'Q1', options: ['A'], correctAnswerIndex: 0 }],
      }
      quizStore.addQuiz(quiz)
      sessionStore.selectQuiz('test-quiz')
      expect(sessionStore.isCurrentQuestionVerified).toBe(false)
    })

    it('isCurrentQuestionVerified should return true when question is verified', () => {
      const quizStore = useQuizStore()
      const sessionStore = useQuizSessionStore()

      const quiz: Quiz = {
        id: 'test-quiz',
        title: 'Test Quiz',
        description: 'Test Description',
        questions: [{ id: 'q1', text: 'Q1', options: ['A'], correctAnswerIndex: 0 }],
      }
      quizStore.addQuiz(quiz)
      sessionStore.selectQuiz('test-quiz')
      sessionStore.verifiedQuestions.add('q1')
      expect(sessionStore.isCurrentQuestionVerified).toBe(true)
    })

    it('canSkipCurrentQuestion should return true when no quiz but can skip', () => {
      const store = useQuizSessionStore()
      expect(store.canSkipCurrentQuestion).toBe(true)
    })

    it('canSkipCurrentQuestion should return true when canSkip and not verified', () => {
      const quizStore = useQuizStore()
      const sessionStore = useQuizSessionStore()

      const quiz: Quiz = {
        id: 'test-quiz',
        title: 'Test Quiz',
        description: 'Test Description',
        questions: [{ id: 'q1', text: 'Q1', options: ['A'], correctAnswerIndex: 0 }],
      }
      quizStore.addQuiz(quiz)
      sessionStore.selectQuiz('test-quiz')
      expect(sessionStore.canSkipCurrentQuestion).toBe(true)
    })

    it('canSkipCurrentQuestion should return false when question is verified', () => {
      const quizStore = useQuizStore()
      const sessionStore = useQuizSessionStore()

      const quiz: Quiz = {
        id: 'test-quiz',
        title: 'Test Quiz',
        description: 'Test Description',
        questions: [{ id: 'q1', text: 'Q1', options: ['A'], correctAnswerIndex: 0 }],
      }
      quizStore.addQuiz(quiz)
      sessionStore.selectQuiz('test-quiz')
      sessionStore.verifiedQuestions.add('q1')
      expect(sessionStore.canSkipCurrentQuestion).toBe(false)
    })

    it('getQuestionResults should return empty array when no quiz', () => {
      const store = useQuizSessionStore()
      expect(store.getQuestionResults).toEqual([])
    })

    it('getQuestionResults should return results for all questions', () => {
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
      sessionStore.selectAnswer(0)
      sessionStore.nextQuestion()
      sessionStore.selectAnswer(0)

      const results = sessionStore.getQuestionResults
      expect(results).toHaveLength(2)
      expect(results[0].isCorrect).toBe(true)
      expect(results[1].isCorrect).toBe(false)
    })

    it('getCurrentQuestionTimeLimit should return null when no quiz', () => {
      const store = useQuizSessionStore()
      expect(store.getCurrentQuestionTimeLimit).toBeNull()
    })

    it('getCurrentQuestionTimeLimit should return quiz timeLimit when question has no timeLimit', () => {
      const quizStore = useQuizStore()
      const sessionStore = useQuizSessionStore()

      const quiz: Quiz = {
        id: 'test-quiz',
        title: 'Test Quiz',
        description: 'Test Description',
        questions: [{ id: 'q1', text: 'Q1', options: ['A'], correctAnswerIndex: 0 }],
        timeLimit: 60,
      }
      quizStore.addQuiz(quiz)
      sessionStore.selectQuiz('test-quiz')
      expect(sessionStore.getCurrentQuestionTimeLimit).toBe(60)
    })

    it('getCurrentQuestionTimeLimit should return question timeLimit when defined', () => {
      const quizStore = useQuizStore()
      const sessionStore = useQuizSessionStore()

      const quiz: Quiz = {
        id: 'test-quiz',
        title: 'Test Quiz',
        description: 'Test Description',
        questions: [{ id: 'q1', text: 'Q1', options: ['A'], correctAnswerIndex: 0, timeLimit: 30 }],
        timeLimit: 60,
      }
      quizStore.addQuiz(quiz)
      sessionStore.selectQuiz('test-quiz')
      expect(sessionStore.getCurrentQuestionTimeLimit).toBe(30)
    })

    it('remainingSkips should return null when quiz has no maxSkips', () => {
      const quizStore = useQuizStore()
      const sessionStore = useQuizSessionStore()

      const quiz: Quiz = {
        id: 'test-quiz',
        title: 'Test Quiz',
        description: 'Test Description',
        questions: [{ id: 'q1', text: 'Q1', options: ['A'], correctAnswerIndex: 0 }],
      }
      quizStore.addQuiz(quiz)
      sessionStore.selectQuiz('test-quiz')
      expect(sessionStore.remainingSkips).toBeNull()
    })

    it('remainingSkips should return correct count', () => {
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
        maxSkips: 3,
      }
      quizStore.addQuiz(quiz)
      sessionStore.selectQuiz('test-quiz')
      sessionStore.skippedQuestions.add('q1')
      expect(sessionStore.remainingSkips).toBe(2)
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

    it('selectQuiz should shuffle questions when quiz has shuffleQuestions enabled', () => {
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
        shuffleQuestions: true,
      }
      quizStore.addQuiz(quiz)
      sessionStore.selectQuiz('test-quiz')

      expect(sessionStore.shuffledQuiz).not.toBeNull()
      expect(sessionStore.shuffledQuiz?.questions).toHaveLength(3)
      expect(sessionStore.shuffledQuiz?.questions.map((q: { id: string }) => q.id).sort()).toEqual([
        'q1',
        'q2',
        'q3',
      ])
    })

    it('selectQuiz should not shuffle questions when quiz has shuffleQuestions disabled', () => {
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
        shuffleQuestions: false,
      }
      quizStore.addQuiz(quiz)
      sessionStore.selectQuiz('test-quiz')

      expect(sessionStore.shuffledQuiz).toBeNull()
      expect(sessionStore.currentQuiz).toEqual(quiz)
    })

    it('selectAnswer should record the answer for current question', () => {
      const quizStore = useQuizStore()
      const sessionStore = useQuizSessionStore()

      const quiz: Quiz = {
        id: 'test-quiz',
        title: 'Test Quiz',
        description: 'Test Description',
        questions: [{ id: 'q1', text: 'Q1', options: ['A', 'B'], correctAnswerIndex: 0 }],
      }
      quizStore.addQuiz(quiz)
      sessionStore.selectQuiz('test-quiz')
      sessionStore.selectAnswer(1)
      expect(sessionStore.getAnswerForQuestion('q1')).toBe(1)
    })

    it('selectAnswer should not change answer when question is verified', () => {
      const quizStore = useQuizStore()
      const sessionStore = useQuizSessionStore()

      const quiz: Quiz = {
        id: 'test-quiz',
        title: 'Test Quiz',
        description: 'Test Description',
        questions: [{ id: 'q1', text: 'Q1', options: ['A', 'B'], correctAnswerIndex: 0 }],
      }
      quizStore.addQuiz(quiz)
      sessionStore.selectQuiz('test-quiz')
      sessionStore.selectAnswer(0)
      sessionStore.verifiedQuestions.add('q1')
      sessionStore.selectAnswer(1)
      expect(sessionStore.getAnswerForQuestion('q1')).toBe(0)
    })

    it('selectAnswer should remove question from skipped set', () => {
      const quizStore = useQuizStore()
      const sessionStore = useQuizSessionStore()

      const quiz: Quiz = {
        id: 'test-quiz',
        title: 'Test Quiz',
        description: 'Test Description',
        questions: [{ id: 'q1', text: 'Q1', options: ['A', 'B'], correctAnswerIndex: 0 }],
      }
      quizStore.addQuiz(quiz)
      sessionStore.selectQuiz('test-quiz')
      sessionStore.skippedQuestions.add('q1')
      sessionStore.selectAnswer(0)
      expect(sessionStore.skippedQuestions.has('q1')).toBe(false)
    })

    it('calculateScore should set score to 0 when no answers', () => {
      const quizStore = useQuizStore()
      const sessionStore = useQuizSessionStore()

      const quiz: Quiz = {
        id: 'test-quiz',
        title: 'Test Quiz',
        description: 'Test Description',
        questions: [{ id: 'q1', text: 'Q1', options: ['A', 'B'], correctAnswerIndex: 0 }],
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
        questions: [{ id: 'q1', text: 'Q1', options: ['A'], correctAnswerIndex: 0 }],
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

    it('skipQuestion should return false when no current question', () => {
      const store = useQuizSessionStore()
      expect(store.skipQuestion()).toBe(false)
    })

    it('skipQuestion should return false when maxSkips reached', () => {
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
        maxSkips: 1,
      }
      quizStore.addQuiz(quiz)
      sessionStore.selectQuiz('test-quiz')
      sessionStore.skipQuestion() // Skip first question, uses 1 of 1 skips
      expect(sessionStore.skipQuestion()).toBe(false)
    })

    it('skipQuestion should skip question and move to next when not on last question', () => {
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
      sessionStore.selectAnswer(0)

      expect(sessionStore.currentQuestionIndex).toBe(0)
      expect(sessionStore.skippedQuestions.has('q1')).toBe(false)
      const result = sessionStore.skipQuestion()
      expect(result).toBe(false)
      expect(sessionStore.currentQuestionIndex).toBe(1)
      expect(sessionStore.skippedQuestions.has('q1')).toBe(true)
      expect(sessionStore.getAnswerForQuestion('q1')).toBeNull()
    })

    it('skipQuestion should complete quiz when on last question', () => {
      const quizStore = useQuizStore()
      const sessionStore = useQuizSessionStore()

      const quiz: Quiz = {
        id: 'test-quiz',
        title: 'Test Quiz',
        description: 'Test Description',
        questions: [{ id: 'q1', text: 'Q1', options: ['A'], correctAnswerIndex: 0 }],
      }
      quizStore.addQuiz(quiz)
      sessionStore.selectQuiz('test-quiz')

      expect(sessionStore.isCompleted).toBe(false)
      const result = sessionStore.skipQuestion()
      expect(result).toBe(true)
      expect(sessionStore.isCompleted).toBe(true)
      expect(sessionStore.skippedQuestions.has('q1')).toBe(true)
    })

    it('goToQuestion should not change index when out of bounds', () => {
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

      sessionStore.goToQuestion(-1)
      expect(sessionStore.currentQuestionIndex).toBe(0)

      sessionStore.goToQuestion(5)
      expect(sessionStore.currentQuestionIndex).toBe(0)
    })

    it('goToQuestion should change to specified index', () => {
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

      sessionStore.goToQuestion(2)
      expect(sessionStore.currentQuestionIndex).toBe(2)
    })

    it('goToQuestion should start timer for question with timeLimit', () => {
      const quizStore = useQuizStore()
      const sessionStore = useQuizSessionStore()

      const quiz: Quiz = {
        id: 'test-quiz',
        title: 'Test Quiz',
        description: 'Test Description',
        questions: [
          { id: 'q1', text: 'Q1', options: ['A'], correctAnswerIndex: 0, timeLimit: 30 },
          { id: 'q2', text: 'Q2', options: ['B'], correctAnswerIndex: 0, timeLimit: 45 },
        ],
      }
      quizStore.addQuiz(quiz)
      sessionStore.selectQuiz('test-quiz')

      sessionStore.goToQuestion(1)
      expect(sessionStore.currentQuestionIndex).toBe(1)
      expect(sessionStore.getCurrentQuestionTimeLimit).toBe(45)
    })

    it('previousQuestion should start timer for question with timeLimit', () => {
      const quizStore = useQuizStore()
      const sessionStore = useQuizSessionStore()

      const quiz: Quiz = {
        id: 'test-quiz',
        title: 'Test Quiz',
        description: 'Test Description',
        questions: [
          { id: 'q1', text: 'Q1', options: ['A'], correctAnswerIndex: 0, timeLimit: 30 },
          { id: 'q2', text: 'Q2', options: ['B'], correctAnswerIndex: 0, timeLimit: 45 },
        ],
      }
      quizStore.addQuiz(quiz)
      sessionStore.selectQuiz('test-quiz')
      sessionStore.nextQuestion()

      sessionStore.previousQuestion()
      expect(sessionStore.currentQuestionIndex).toBe(0)
      expect(sessionStore.getCurrentQuestionTimeLimit).toBe(30)
    })

    it('completeQuiz should calculate score and set isCompleted to true', () => {
      const quizStore = useQuizStore()
      const sessionStore = useQuizSessionStore()

      const quiz: Quiz = {
        id: 'test-quiz',
        title: 'Test Quiz',
        description: 'Test Description',
        questions: [{ id: 'q1', text: 'Q1', options: ['A', 'B'], correctAnswerIndex: 0 }],
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
        questions: [{ id: 'q1', text: 'Q1', options: ['A'], correctAnswerIndex: 0 }],
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

    it('restartQuiz should do nothing when no quiz selected', () => {
      const sessionStore = useQuizSessionStore()
      sessionStore.restartQuiz()
      expect(sessionStore.currentQuestionIndex).toBe(0)
    })

    it('restartQuiz should reshuffle questions when quiz has shuffleQuestions enabled', () => {
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
        shuffleQuestions: true,
      }
      quizStore.addQuiz(quiz)
      sessionStore.selectQuiz('test-quiz')

      sessionStore.restartQuiz()

      expect(sessionStore.shuffledQuiz).not.toBeNull()
      expect(sessionStore.shuffledQuiz?.questions).toHaveLength(3)
      expect(sessionStore.currentQuestionIndex).toBe(0)
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
