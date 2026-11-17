import { z } from 'zod'
import type { Quiz } from '../types/quiz'
import { normalizeQuizTheme } from './theme'
import { THEME_ACCENTS, THEME_MODES } from '../constants/themes'

// ============================================================================
// Schemas Zod
// ============================================================================

export const ThemeSelectionSchema = z.object({
  mode: z.enum(THEME_MODES),
  accent: z.enum(THEME_ACCENTS),
})

/**
 * The optional Markdown context of a question. A blank string counts as absent:
 * an empty block would leave dead space in the card.
 */
export const QuestionContextSchema = z.preprocess(
  (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
  z.string().optional(),
)

export const QuestionSchema = z
  .object({
    id: z.string().min(1),
    text: z.string().min(1),
    context: QuestionContextSchema,
    options: z.array(z.string().min(1)).min(2),
    correctAnswerIndex: z.number().int().nonnegative(),
    timeLimit: z.number().optional(),
    shuffleAnswers: z.boolean().optional(),
    explanation: z.string().optional(),
  })
  .superRefine((q, ctx) => {
    if (q.correctAnswerIndex >= q.options.length) {
      ctx.addIssue({
        code: 'custom',
        message: 'correctAnswerIndex must be less than options length',
        path: ['correctAnswerIndex'],
      })
    }
  })

export const QuizSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  questions: z.array(QuestionSchema).min(1),
  timeLimit: z.number().optional(),
  shuffleQuestions: z.boolean().optional(),
  shuffleAnswers: z.boolean().optional(),
  maxSkips: z.number().optional(),
  enableReviewMode: z.boolean().optional(),
  feedbackEnabled: z.boolean().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  // Storage and imports carry names written by the daisyUI build; an
  // unrecognised value resets the theme instead of rejecting the quiz.
  theme: z.preprocess(normalizeQuizTheme, ThemeSelectionSchema.optional()),
})

// ============================================================================
// Quiz form schema (VeeValidate)
// ============================================================================

/**
 * Question as edited in the form. `id` is optional: absent for new questions,
 * preserved for existing ones so answers stay linked across edits.
 */
export const FormQuestionSchema = z
  .object({
    id: z.string().optional(),
    text: z.string().min(1, 'Question text is required'),
    context: QuestionContextSchema,
    options: z
      .array(z.string().min(1, 'Option cannot be empty'))
      .min(2, 'At least 2 options are required'),
    correctAnswerIndex: z.number().int().nonnegative(),
    timeLimit: z.number().positive('Time limit must be positive').optional(),
    shuffleAnswers: z.boolean().optional(),
    explanation: z.string().optional(),
  })
  .superRefine((q, ctx) => {
    if (q.correctAnswerIndex >= q.options.length) {
      ctx.addIssue({
        code: 'custom',
        message: 'Select one of the available options',
        path: ['correctAnswerIndex'],
      })
    }
  })

/**
 * Full quiz form schema. Booleans are required because the form initializes
 * them explicitly; optional quiz fields stay optional.
 */
export const QuizFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().optional(),
  tags: z.array(z.string()),
  timeLimit: z.number().positive('Time limit must be positive').optional(),
  shuffleQuestions: z.boolean(),
  shuffleAnswers: z.boolean(),
  maxSkips: z.number().int().nonnegative('Must be 0 or more').optional(),
  enableReviewMode: z.boolean(),
  feedbackEnabled: z.boolean(),
  questions: z.array(FormQuestionSchema).min(1, 'At least one question is required'),
  // A `<mode>-<accent>` option value, or empty for the default theme.
  theme: z.string().optional(),
})

export type FormQuestion = z.infer<typeof FormQuestionSchema>
export type QuizFormValues = z.infer<typeof QuizFormSchema>

// ============================================================================
// Validation avec résultats détaillés
// ============================================================================

export interface ValidationResult {
  valid: boolean
  errors: string[]
}

/**
 * Valide un JSON de quiz
 */
export function validateQuizJSON(jsonData: string): ValidationResult {
  try {
    const parsed = JSON.parse(jsonData)

    if (Array.isArray(parsed)) {
      const result = z.array(QuizSchema).min(1).safeParse(parsed)
      if (!result.success) {
        const errors: string[] = result.error.issues.map((issue) => issue.message)
        return { valid: false, errors }
      }
      return { valid: true, errors: [] }
    } else {
      const result = QuizSchema.safeParse(parsed)
      if (!result.success) {
        const errors: string[] = result.error.issues.map((issue) => issue.message)
        return { valid: false, errors }
      }
      return { valid: true, errors: [] }
    }
  } catch {
    return { valid: false, errors: ['Invalid JSON'] }
  }
}

/**
 * Parse et valide un JSON de quiz
 * Retourne Quiz/Quiz[]/null
 */
export function parseAndValidateQuizJSON(jsonData: string): Quiz | Quiz[] | null {
  try {
    const parsed = JSON.parse(jsonData)

    if (Array.isArray(parsed)) {
      const result = z.array(QuizSchema).min(1).safeParse(parsed)
      return result.success ? result.data : null
    } else {
      const result = QuizSchema.safeParse(parsed)
      return result.success ? result.data : null
    }
  } catch {
    return null
  }
}
