import { describe, it, expect } from 'bun:test'
import type { Question } from '../../types/quiz'
import {
  QuestionSchema,
  QuizSchema,
  isQuestion,
  isQuiz,
  isQuizArray,
  validateQuizJSON,
  validateQuestion,
  parseAndValidateQuizJSON,
  hasRequiredQuizFields,
  isValidQuizStructure,
  isValidQuizArrayStructure,
  validateQuizFormState,
  type ValidationResult,
  type QuestionValidationResult,
  type FormValidationResult,
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

const invalidQuizMissingQuestions = {
  id: 'quiz-1',
  title: 'Math Quiz',
  description: 'A simple math quiz',
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



const invalidQuestionShortOptions = {
  id: 'q-1',
  text: 'What is 2+2?',
  options: ['4'],
  correctAnswerIndex: 0,
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
      const result = QuestionSchema.safeParse(validQuestion)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.id).toBe('q-1')
        expect(result.data.text).toBe('What is 2+2?')
        expect(result.data.options).toEqual(['3', '4', '5'])
        expect(result.data.correctAnswerIndex).toBe(1)
      }
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

  describe('validateQuestion', () => {
    it('should return valid: true for valid question', () => {
      const result: QuestionValidationResult = validateQuestion(validQuestion)
      expect(result.valid).toBe(true)
      expect(result.errors).toEqual({})
    })

    it('should return errors for missing text', () => {
      const result: QuestionValidationResult = validateQuestion(invalidQuestionMissingText, 0)
      expect(result.valid).toBe(false)
      expect(result.errors['question-0-text']).toBeDefined()
    })

    it('should return errors for invalid options', () => {
      const result: QuestionValidationResult = validateQuestion(invalidQuestionShortOptions)
      expect(result.valid).toBe(false)
      expect(Object.keys(result.errors).length).toBeGreaterThan(0)
    })

    it('should include question index in error messages', () => {
      const result: QuestionValidationResult = validateQuestion(invalidQuestionMissingText, 0)
      expect(result.errors['question-0-text']).toContain('1')
    })

    it('should validate all options', () => {
      const questionWithEmptyOption: Partial<Question> = {
        id: 'q-1',
        text: 'Test',
        options: ['option1', '', 'option3'],
        correctAnswerIndex: 0,
      }
      const result: QuestionValidationResult = validateQuestion(questionWithEmptyOption, 0)
      expect(result.valid).toBe(false)
      expect(result.errors['question-0-options-1']).toBeDefined()
    })
  })

  describe('validateQuizJSON', () => {
    it('should return valid: true for valid single quiz JSON', () => {
      const json = JSON.stringify(validQuiz)
      const result: ValidationResult = validateQuizJSON(json)
      expect(result.valid).toBe(true)
      expect(result.errors).toEqual([])
    })

    it('should return valid: true for valid quiz array JSON', () => {
      const json = JSON.stringify([validQuiz, { ...validQuiz, id: 'quiz-2' }])
      const result: ValidationResult = validateQuizJSON(json)
      expect(result.valid).toBe(true)
      expect(result.errors).toEqual([])
    })

    it('should return valid: false for invalid JSON', () => {
      const result: ValidationResult = validateQuizJSON('not valid json')
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('JSON invalide')
    })

    it('should return valid: false for empty array', () => {
      const result: ValidationResult = validateQuizJSON('[]')
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Le tableau de quiz ne peut pas être vide')
    })

    it('should return valid: false for quiz missing required fields', () => {
      const json = JSON.stringify(invalidQuizMissingId)
      const result: ValidationResult = validateQuizJSON(json)
      expect(result.valid).toBe(false)
    })
  })

  describe('parseAndValidateQuizJSON', () => {
    it('should return parsed quiz for valid single quiz JSON', () => {
      const json = JSON.stringify(validQuiz)
      const result = parseAndValidateQuizJSON(json)
      expect(result).toEqual(validQuiz)
    })

    it('should return parsed quizzes for valid array JSON', () => {
      const quizzes = [validQuiz, { ...validQuiz, id: 'quiz-2' }]
      const json = JSON.stringify(quizzes)
      const result = parseAndValidateQuizJSON(json)
      expect(result).toEqual(quizzes)
    })

    it('should return null for invalid JSON', () => {
      const result = parseAndValidateQuizJSON('not valid json')
      expect(result).toBeNull()
    })

    it('should return null for invalid quiz structure', () => {
      const json = JSON.stringify(invalidQuizMissingId)
      const result = parseAndValidateQuizJSON(json)
      expect(result).toBeNull()
    })
  })

  describe('hasRequiredQuizFields', () => {
    it('should return true for object with required fields', () => {
      expect(hasRequiredQuizFields(validQuiz)).toBe(true)
    })

    it('should return false for null', () => {
      expect(hasRequiredQuizFields(null)).toBe(false)
    })

    it('should return false for non-object', () => {
      expect(hasRequiredQuizFields('string')).toBe(false)
    })

    it('should return false when id is missing', () => {
      expect(hasRequiredQuizFields(invalidQuizMissingId)).toBe(false)
    })

    it('should return false when title is missing', () => {
      expect(hasRequiredQuizFields(invalidQuizMissingTitle)).toBe(false)
    })

    it('should return false when questions is missing', () => {
      expect(hasRequiredQuizFields(invalidQuizMissingQuestions)).toBe(false)
    })
  })

  describe('isValidQuizStructure', () => {
    it('should return true for valid quiz', () => {
      expect(isValidQuizStructure(validQuiz)).toBe(true)
    })

    it('should return false for null', () => {
      expect(isValidQuizStructure(null)).toBe(false)
    })

    it('should return false for non-object', () => {
      expect(isValidQuizStructure('string')).toBe(false)
    })

    it('should return false when id is empty string', () => {
      expect(isValidQuizStructure({ ...validQuiz, id: '' })).toBe(false)
    })
  })

  describe('isValidQuizArrayStructure', () => {
    it('should return true for array of valid quizzes', () => {
      const quizzes = [validQuiz, { ...validQuiz, id: 'quiz-2' }]
      expect(isValidQuizArrayStructure(quizzes)).toBe(true)
    })

    it('should return false for non-array', () => {
      expect(isValidQuizArrayStructure(validQuiz)).toBe(false)
    })

    it('should return false for array with one invalid quiz', () => {
      const quizzes = [validQuiz, invalidQuizMissingId]
      expect(isValidQuizArrayStructure(quizzes)).toBe(false)
    })

    it('should return false for null', () => {
      expect(isValidQuizArrayStructure(null)).toBe(false)
    })
  })

  describe('validateQuizFormState', () => {
    it('should return valid: true for valid form state', () => {
      const formState = {
        title: 'Test Quiz',
        description: 'Test Description',
        questions: [validQuestion],
      }
      const result: FormValidationResult = validateQuizFormState(formState)
      expect(result.valid).toBe(true)
      expect(result.errors).toEqual({})
    })

    it('should return error for missing title', () => {
      const formState = {
        title: '',
        description: 'Test Description',
        questions: [validQuestion],
      }
      const result: FormValidationResult = validateQuizFormState(formState)
      expect(result.valid).toBe(false)
      expect(result.errors.title).toBe("Le titre est requis")
    })

    it('should return error for missing description', () => {
      const formState = {
        title: 'Test Quiz',
        description: '',
        questions: [validQuestion],
      }
      const result: FormValidationResult = validateQuizFormState(formState)
      expect(result.valid).toBe(false)
      expect(result.errors.description).toBe("La description est requise")
    })

    it('should return error for empty questions array', () => {
      const formState = {
        title: 'Test Quiz',
        description: 'Test Description',
        questions: [],
      }
      const result: FormValidationResult = validateQuizFormState(formState)
      expect(result.valid).toBe(false)
      expect(result.errors.questions).toBe("Au moins une question est requise")
    })

    it('should return errors for invalid questions', () => {
      const formState = {
        title: 'Test Quiz',
        description: 'Test Description',
        questions: [invalidQuestionMissingText],
      }
      const result: FormValidationResult = validateQuizFormState(formState)
      expect(result.valid).toBe(false)
      expect(Object.keys(result.errors).length).toBeGreaterThan(0)
    })
  })
})
