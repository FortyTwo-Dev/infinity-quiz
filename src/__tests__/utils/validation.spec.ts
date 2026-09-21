import { describe, it, expect } from 'vitest'
import {
  QuestionSchema,
  QuizSchema,
  FormQuestionSchema,
  QuizFormSchema,
  isQuestion,
  isQuiz,
  isQuizArray,
  validateQuizJSON,
  parseAndValidateQuizJSON,
  type ValidationResult,
} from '../../utils/validation'

const validQuestion = {
  id: 'q-1',
  text: 'What is 2+2?',
  options: ['3', '4', '5'],
  correctAnswerIndex: 1,
}

const validQuiz = {
  id: 'quiz-1',
  title: 'Math Quiz',
  description: 'A simple math quiz',
  questions: [validQuestion],
}

const invalidQuizMissingId = {
  title: 'Math Quiz',
  description: 'A simple math quiz',
  questions: [validQuestion],
}

const invalidQuizMissingTitle = {
  id: 'quiz-1',
  description: 'A simple math quiz',
  questions: [validQuestion],
}

const invalidQuizMissingDescription = {
  id: 'quiz-1',
  title: 'Math Quiz',
  questions: [validQuestion],
}

const invalidQuizEmptyQuestions = {
  id: 'quiz-1',
  title: 'Math Quiz',
  description: 'A simple math quiz',
  questions: [],
}

const invalidQuestionMissingId = {
  text: 'What is 2+2?',
  options: ['3', '4'],
  correctAnswerIndex: 1,
}

const invalidQuestionMissingText = {
  id: 'q-1',
  options: ['3', '4'],
  correctAnswerIndex: 1,
}

const invalidQuestionInvalidCorrectAnswer = {
  id: 'q-1',
  text: 'What is 2+2?',
  options: ['3', '4', '5'],
  correctAnswerIndex: 5,
}

describe('Zod validation utils', () => {
  describe('Schemas', () => {
    it('QuestionSchema should validate correct question', () => {
      const data = QuestionSchema.parse(validQuestion)
      expect(data.id).toBe('q-1')
      expect(data.text).toBe('What is 2+2?')
      expect(data.options).toEqual(['3', '4', '5'])
      expect(data.correctAnswerIndex).toBe(1)
    })

    it('QuestionSchema should reject missing id', () => {
      const result = QuestionSchema.safeParse(invalidQuestionMissingId)
      expect(result.success).toBe(false)
    })

    it('QuestionSchema should reject missing text', () => {
      const result = QuestionSchema.safeParse(invalidQuestionMissingText)
      expect(result.success).toBe(false)
    })

    it('QuestionSchema should reject invalid correctAnswerIndex', () => {
      const result = QuestionSchema.safeParse(invalidQuestionInvalidCorrectAnswer)
      expect(result.success).toBe(false)
    })

    it('QuizSchema should validate correct quiz', () => {
      const result = QuizSchema.safeParse(validQuiz)
      expect(result.success).toBe(true)
    })

    it('QuizSchema should reject missing id', () => {
      const result = QuizSchema.safeParse(invalidQuizMissingId)
      expect(result.success).toBe(false)
    })

    it('QuizSchema should reject missing title', () => {
      const result = QuizSchema.safeParse(invalidQuizMissingTitle)
      expect(result.success).toBe(false)
    })

    it('QuizSchema should reject missing description', () => {
      const result = QuizSchema.safeParse(invalidQuizMissingDescription)
      expect(result.success).toBe(false)
    })

    it('QuizSchema should reject empty questions', () => {
      const result = QuizSchema.safeParse(invalidQuizEmptyQuestions)
      expect(result.success).toBe(false)
    })
  })

  describe('Type guards', () => {
    it('isQuestion should return true for valid question', () => {
      expect(isQuestion(validQuestion)).toBe(true)
    })

    it('isQuestion should return false for null', () => {
      expect(isQuestion(null)).toBe(false)
    })

    it('isQuestion should return false for invalid question', () => {
      expect(isQuestion(invalidQuestionMissingId)).toBe(false)
    })

    it('isQuiz should return true for valid quiz', () => {
      expect(isQuiz(validQuiz)).toBe(true)
    })

    it('isQuiz should return false for null', () => {
      expect(isQuiz(null)).toBe(false)
    })

    it('isQuiz should return false for invalid quiz', () => {
      expect(isQuiz(invalidQuizMissingId)).toBe(false)
    })

    it('isQuizArray should return true for array of valid quizzes', () => {
      expect(isQuizArray([validQuiz, { ...validQuiz, id: 'quiz-2' }])).toBe(true)
    })

    it('isQuizArray should return false for non-array', () => {
      expect(isQuizArray(validQuiz)).toBe(false)
    })

    it('isQuizArray should return false for empty array', () => {
      expect(isQuizArray([])).toBe(false)
    })

    it('isQuizArray should return false for array with invalid quiz', () => {
      expect(isQuizArray([validQuiz, invalidQuizMissingId])).toBe(false)
    })
  })

  describe('validateQuizJSON', () => {
    it('should return valid: true for a valid single quiz', () => {
      const result: ValidationResult = validateQuizJSON(JSON.stringify(validQuiz))
      expect(result.valid).toBe(true)
      expect(result.errors).toEqual([])
    })

    it('should return valid: true for a valid quiz array', () => {
      const json = JSON.stringify([validQuiz, { ...validQuiz, id: 'quiz-2' }])
      expect(validateQuizJSON(json).valid).toBe(true)
    })

    it('should return valid: false for invalid JSON', () => {
      const result = validateQuizJSON('not valid json')
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Invalid JSON')
    })

    it('should return valid: false for an empty array', () => {
      expect(validateQuizJSON('[]').valid).toBe(false)
    })

    it('should return valid: false for a quiz missing required fields', () => {
      expect(validateQuizJSON(JSON.stringify(invalidQuizMissingId)).valid).toBe(false)
    })
  })

  describe('parseAndValidateQuizJSON', () => {
    it('should return the parsed quiz for a valid single quiz', () => {
      expect(parseAndValidateQuizJSON(JSON.stringify(validQuiz))).toEqual(validQuiz)
    })

    it('should return the parsed quizzes for a valid array', () => {
      const quizzes = [validQuiz, { ...validQuiz, id: 'quiz-2' }]
      expect(parseAndValidateQuizJSON(JSON.stringify(quizzes))).toEqual(quizzes)
    })

    it('should return null for invalid JSON', () => {
      expect(parseAndValidateQuizJSON('not valid json')).toBeNull()
    })

    it('should return null for an invalid quiz structure', () => {
      expect(parseAndValidateQuizJSON(JSON.stringify(invalidQuizMissingId))).toBeNull()
    })

    it('should return null when a quiz has no questions', () => {
      expect(parseAndValidateQuizJSON(JSON.stringify(invalidQuizEmptyQuestions))).toBeNull()
    })

    it('should return null when a quiz is missing a description', () => {
      expect(parseAndValidateQuizJSON(JSON.stringify(invalidQuizMissingDescription))).toBeNull()
    })

    it('should return null when a question is malformed', () => {
      const json = JSON.stringify({
        ...validQuiz,
        questions: [{ id: 'q-1', text: 'Q?', options: 'not-an-array', correctAnswerIndex: 0 }],
      })
      expect(parseAndValidateQuizJSON(json)).toBeNull()
    })

    it('should return null when a question correctAnswerIndex is out of range', () => {
      const json = JSON.stringify({ ...validQuiz, questions: [invalidQuestionInvalidCorrectAnswer] })
      expect(parseAndValidateQuizJSON(json)).toBeNull()
    })

    it('should return null when one quiz of an array is invalid', () => {
      expect(
        parseAndValidateQuizJSON(JSON.stringify([validQuiz, invalidQuizMissingId])),
      ).toBeNull()
    })
  })

  describe('FormQuestionSchema', () => {
    it('should accept a valid form question', () => {
      const result = FormQuestionSchema.safeParse({
        text: 'Q?',
        options: ['A', 'B'],
        correctAnswerIndex: 1,
      })
      expect(result.success).toBe(true)
    })

    it('should reject an empty question text', () => {
      const result = FormQuestionSchema.safeParse({
        text: '',
        options: ['A', 'B'],
        correctAnswerIndex: 0,
      })
      expect(result.success).toBe(false)
    })

    it('should reject fewer than two options', () => {
      const result = FormQuestionSchema.safeParse({
        text: 'Q?',
        options: ['A'],
        correctAnswerIndex: 0,
      })
      expect(result.success).toBe(false)
    })

    it('should reject a correctAnswerIndex out of range', () => {
      const result = FormQuestionSchema.safeParse({
        text: 'Q?',
        options: ['A', 'B'],
        correctAnswerIndex: 5,
      })
      expect(result.success).toBe(false)
    })
  })

  describe('QuizFormSchema', () => {
    const validForm = {
      title: 'Title',
      description: 'Description',
      tags: [],
      shuffleQuestions: false,
      shuffleAnswers: false,
      enableReviewMode: false,
      feedbackEnabled: false,
      questions: [{ text: 'Q?', options: ['A', 'B'], correctAnswerIndex: 0 }],
    }

    it('should accept a valid form', () => {
      expect(QuizFormSchema.safeParse(validForm).success).toBe(true)
    })

    it('should reject an empty title', () => {
      expect(QuizFormSchema.safeParse({ ...validForm, title: '' }).success).toBe(false)
    })

    it('should reject an empty description', () => {
      expect(QuizFormSchema.safeParse({ ...validForm, description: '' }).success).toBe(false)
    })

    it('should reject no questions', () => {
      expect(QuizFormSchema.safeParse({ ...validForm, questions: [] }).success).toBe(false)
    })

    it('should reject a negative maxSkips', () => {
      expect(QuizFormSchema.safeParse({ ...validForm, maxSkips: -1 }).success).toBe(false)
    })

    it('should reject a non-positive timeLimit', () => {
      expect(QuizFormSchema.safeParse({ ...validForm, timeLimit: 0 }).success).toBe(false)
    })
  })
})
