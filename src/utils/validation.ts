import { z } from 'zod'
import type { Quiz, Question } from '../types/quiz'

// ============================================================================
// Schemas Zod
// ============================================================================

export const QuestionSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  options: z.array(z.string().min(1)).min(2),
  correctAnswerIndex: z.number().int().nonnegative(),
  timeLimit: z.number().optional(),
  shuffleAnswers: z.boolean().optional(),
  explanation: z.string().optional(),
})
  .superRefine((q, ctx) => {
    if (q.correctAnswerIndex >= q.options.length) {
      ctx.addIssue({
        code: "custom",
        message: "correctAnswerIndex must be less than options length",
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
})

/**
 * Schema pour l'import qui accepte les quiz avec questions vide pour compatibilité
 */
export const ImportQuizSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  questions: z.array(z.any()),
  timeLimit: z.number().optional(),
  shuffleQuestions: z.boolean().optional(),
  shuffleAnswers: z.boolean().optional(),
  maxSkips: z.number().optional(),
  enableReviewMode: z.boolean().optional(),
  feedbackEnabled: z.boolean().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

// ============================================================================
// Types inférés (pour l'autocomplétion)
// ============================================================================

export type ZodQuestion = z.infer<typeof QuestionSchema>
export type ZodQuiz = z.infer<typeof QuizSchema>

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Type guard pour Question
 */
export function isQuestion(value: unknown): value is Question {
  return QuestionSchema.safeParse(value).success
}

/**
 * Type guard pour Quiz
 */
export function isQuiz(value: unknown): value is Quiz {
  return QuizSchema.safeParse(value).success
}

/**
 * Type guard pour Quiz[]
 */
export function isQuizArray(value: unknown): value is Quiz[] {
  return z.array(QuizSchema).min(1).safeParse(value).success
}

// ============================================================================
// Validation avec résultats détaillés
// ============================================================================

export interface ValidationResult {
  valid: boolean
  errors: string[]
}

export interface QuestionValidationResult {
  valid: boolean
  errors: Record<string, string>
}

/**
 * Valide une question et retourne les erreurs
 */
export function validateQuestion(
  question: Partial<Question>,
  index?: number
): QuestionValidationResult {
  const result = QuestionSchema.safeParse(question)

  if (result.success) {
    return { valid: true, errors: {} }
  }

  const errors: Record<string, string> = {}
  const prefix = index !== undefined ? `question-${index}-` : ''

  for (const issue of result.error.issues) {
    const path = issue.path.join('-')
    const key = prefix + path
    errors[key] = issue.message
  }

  return {
    valid: false,
    errors,
  }
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
        const errors: string[] = result.error.issues.map(issue => issue.message)
        return { valid: false, errors }
      }
      return { valid: true, errors: [] }
    } else {
      const result = QuizSchema.safeParse(parsed)
      if (!result.success) {
        const errors: string[] = result.error.issues.map(issue => issue.message)
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
      const result = z.array(ImportQuizSchema).min(1).safeParse(parsed)
      return result.success ? result.data as unknown as Quiz[] : null
    } else {
      const result = ImportQuizSchema.safeParse(parsed)
      return result.success ? result.data as unknown as Quiz : null
    }
  } catch {
    return null
  }
}

/**
 * Vérifie la structure de base pour l'import
 * Utilise ImportQuizSchema qui vérifie déjà que id est une string non vide
 */
export function hasRequiredQuizFields(value: unknown): boolean {
  return ImportQuizSchema.safeParse(value).success
}

/**
 * Valide la structure de base d'un quiz (pour import rapide)
 * Utilise ImportQuizSchema qui vérifie déjà que id est une string non vide
 */
export function isValidQuizStructure(value: unknown): boolean {
  return ImportQuizSchema.safeParse(value).success
}

/**
 * Valide un tableau de quiz pour la structure de base
 */
export function isValidQuizArrayStructure(value: unknown): boolean {
  return z.array(ImportQuizSchema).safeParse(value).success
}

/**
 * Valide l'état d'un formulaire de quiz
 */
/**
 * Schema Zod pour une question partielle (sans validation de correctAnswerIndex)
 * Utilisé pour les formulaires où les questions peuvent être incomplètes
 */
export const PartialQuestionSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  options: z.array(z.string().min(1)).min(2),
  correctAnswerIndex: z.number().int().nonnegative(),
  timeLimit: z.number().optional(),
  shuffleAnswers: z.boolean().optional(),
  explanation: z.string().optional(),
}).partial()

/**
 * Schema Zod pour la validation de l'état du formulaire de quiz
 * Utilise les messages par défaut de Zod
 */
export const QuizFormStateSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  questions: z.array(PartialQuestionSchema).min(1),
  timeLimit: z.number().optional(),
  shuffleQuestions: z.boolean().optional(),
  shuffleAnswers: z.boolean().optional(),
  maxSkips: z.number().optional(),
  enableReviewMode: z.boolean().optional(),
  feedbackEnabled: z.boolean().optional(),
})

export interface QuizFormState {
  title: string
  description: string
  category?: string
  tags?: string[]
  questions: Partial<Question>[]
}

export interface FormValidationResult {
  valid: boolean
  errors: Record<string, string>
}

export function validateQuizFormState(form: QuizFormState): FormValidationResult {
  const result = QuizFormStateSchema.safeParse(form)

  if (result.success) {
    // Si le formulaire est valide, on valide aussi chaque question individuellement
    // car QuestionSchema.partial() permet des questions incomplètes
    const errors: Record<string, string> = {}
    form.questions.forEach((q, index) => {
      const qResult = QuestionSchema.safeParse(q)
      if (!qResult.success) {
        for (const issue of qResult.error.issues) {
          const path = `question-${index}-${issue.path.join('-')}`
          errors[path] = issue.message
        }
      }
    })
    return {
      valid: Object.keys(errors).length === 0,
      errors,
    }
  }

  // Conversion des erreurs Zod en Record<string, string>
  const errors: Record<string, string> = {}
  for (const issue of result.error.issues) {
    const path = issue.path.join('-')
    errors[path] = issue.message
  }

  return {
    valid: false,
    errors,
  }
}
