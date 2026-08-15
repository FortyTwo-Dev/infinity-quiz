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
        code: z.ZodIssueCode.custom,
        message: "L'index de la bonne réponse est invalide",
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

    // Map Zod error codes to custom messages with question index
    let message = issue.message ?? 'Champ invalide'
    if (index !== undefined) {
      const questionNum = index + 1
      if (path === 'text') message = `Le texte de la question ${questionNum} est requis`
      else if (path === 'options') message = `La question ${questionNum} doit avoir au moins 2 options`
      else if (path.startsWith('options-')) {
        const parts = path.split('-')
        const optionIndex = parts.length > 1 ? parseInt(parts[1] as string) : 0
        message = `L'option ${optionIndex + 1} de la question ${questionNum} est requise`
      }
      else if (path === 'correctAnswerIndex') message = `L'index de la bonne réponse pour la question ${questionNum} est invalide`
    }

    errors[key] = message
  }

  return {
    valid: Object.keys(errors).length === 0,
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
        const errors: string[] = []

        const hasEmptyArrayError = result.error.issues.some(
          (issue) => issue.code === z.ZodIssueCode.too_small && issue.origin === 'array'
        )

        if (hasEmptyArrayError) {
          errors.push('Le tableau de quiz ne peut pas être vide')
        } else {
          const invalidIndices: number[] = []
          for (const issue of result.error.issues) {
            if (issue.code === z.ZodIssueCode.invalid_type) {
              invalidIndices.push((issue.path[0] as number) + 1)
            }
          }

          if (invalidIndices.length > 0) {
            errors.push(`Quiz invalides aux positions: ${invalidIndices.join(', ')}. Chaque quiz doit avoir id, title, description et questions valides.`)
          } else {
            errors.push('Structure de quiz invalide dans le tableau')
          }
        }

        return { valid: false, errors }
      }
      return { valid: true, errors: [] }
    } else {
      const result = QuizSchema.safeParse(parsed)
      if (!result.success) {
        return {
          valid: false,
          errors: ['Quiz invalide. Doit contenir id (string), title (string), description (string) et questions (tableau de questions valides).'],
        }
      }
      return { valid: true, errors: [] }
    }
  } catch {
    return { valid: false, errors: ['JSON invalide'] }
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
      if (parsed.length === 0) return null
      const result = z.array(ImportQuizSchema).safeParse(parsed)
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
 */
export function hasRequiredQuizFields(value: unknown): boolean {
  if (!ImportQuizSchema.safeParse(value).success) return false
  const quiz = value as Record<string, unknown>
  return typeof quiz.id === 'string' && quiz.id.trim() !== ''
}

/**
 * Valide la structure de base d'un quiz (pour import rapide)
 */
export function isValidQuizStructure(value: unknown): boolean {
  if (!ImportQuizSchema.safeParse(value).success) return false
  const quiz = value as Record<string, unknown>
  return typeof quiz.id === 'string' && quiz.id.trim() !== ''
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
  const errors: Record<string, string> = {}

  if (!form.title?.trim()) {
    errors.title = "Le titre est requis"
  }

  if (!form.description?.trim()) {
    errors.description = "La description est requise"
  }

  if (!form.questions?.length) {
    errors.questions = "Au moins une question est requise"
  } else {
    form.questions.forEach((q, index) => {
      const result = validateQuestion(q, index)
      if (!result.valid) {
        Object.assign(errors, result.errors)
      }
    })
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}
