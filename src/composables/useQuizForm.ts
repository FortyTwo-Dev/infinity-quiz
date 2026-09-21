import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useForm, useFieldArray, type Path } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useQuizStore } from '../stores'
import { QuizFormSchema, type QuizFormValues, type FormQuestion } from '../utils/validation'
import type { Quiz } from '../types/quiz'

/** Steps of the multi-step quiz form, in display order. */
export const QUIZ_FORM_STEPS = ['general', 'questions', 'settings', 'review'] as const
export type QuizFormStep = (typeof QUIZ_FORM_STEPS)[number]

/** Static field paths validated when leaving each step. */
const STEP_FIELDS: Record<QuizFormStep, Path<QuizFormValues>[]> = {
  general: ['title', 'description', 'category', 'tags'],
  questions: [],
  settings: [],
  review: [],
}

function createEmptyQuestion(): FormQuestion {
  return {
    text: '',
    options: ['', ''],
    correctAnswerIndex: 0,
  }
}

function createEmptyValues(): QuizFormValues {
  return {
    title: '',
    description: '',
    category: undefined,
    tags: [],
    timeLimit: undefined,
    shuffleQuestions: false,
    shuffleAnswers: false,
    maxSkips: undefined,
    enableReviewMode: false,
    feedbackEnabled: false,
    questions: [createEmptyQuestion()],
  }
}

function quizToFormValues(quiz: Quiz): QuizFormValues {
  return {
    title: quiz.title,
    description: quiz.description,
    category: quiz.category,
    tags: quiz.tags ?? [],
    timeLimit: quiz.timeLimit,
    shuffleQuestions: quiz.shuffleQuestions ?? false,
    shuffleAnswers: quiz.shuffleAnswers ?? false,
    maxSkips: quiz.maxSkips,
    enableReviewMode: quiz.enableReviewMode ?? false,
    feedbackEnabled: quiz.feedbackEnabled ?? false,
    questions: quiz.questions.map((q) => ({
      id: q.id,
      text: q.text,
      options: [...q.options],
      correctAnswerIndex: q.correctAnswerIndex,
      timeLimit: q.timeLimit,
      shuffleAnswers: q.shuffleAnswers,
      explanation: q.explanation,
    })),
  }
}

function formValuesToQuiz(values: QuizFormValues, quizId: string): Quiz {
  return {
    id: quizId,
    title: values.title,
    description: values.description,
    category: values.category || undefined,
    tags: values.tags.length > 0 ? values.tags : undefined,
    timeLimit: values.timeLimit,
    shuffleQuestions: values.shuffleQuestions,
    shuffleAnswers: values.shuffleAnswers,
    maxSkips: values.maxSkips,
    enableReviewMode: values.enableReviewMode,
    feedbackEnabled: values.feedbackEnabled,
    questions: values.questions.map((q, index) => ({
      // Reuse the existing id when editing; assign one for new questions.
      id: q.id ?? `q-${Date.now()}-${index}`,
      text: q.text,
      options: q.options,
      correctAnswerIndex: q.correctAnswerIndex,
      timeLimit: q.timeLimit,
      shuffleAnswers: q.shuffleAnswers,
      explanation: q.explanation,
    })),
  }
}

/**
 * Multi-step quiz creation/editing form backed by VeeValidate + Zod.
 *
 * @param quizId - when provided, the form loads and updates that quiz.
 */
export function useQuizForm(quizId?: string) {
  const router = useRouter()
  const quizStore = useQuizStore()

  const existingQuiz = quizId ? quizStore.getQuizById(quizId) : null
  const editingQuizId = ref<string | null>(existingQuiz?.id ?? null)
  const isEditing = computed(() => editingQuizId.value !== null)

  const initialValues = existingQuiz ? quizToFormValues(existingQuiz) : createEmptyValues()

  const { handleSubmit, errors, values, setFieldValue, validateField, resetForm } =
    useForm<QuizFormValues>({
      validationSchema: toTypedSchema(QuizFormSchema),
      initialValues,
    })

  const {
    fields: questionFields,
    push: pushQuestion,
    remove: removeQuestion,
    replace: replaceQuestions,
  } = useFieldArray<FormQuestion>('questions')

  // Step navigation
  const currentStepIndex = ref(0)
  const currentStep = computed<QuizFormStep>(
    () => QUIZ_FORM_STEPS[currentStepIndex.value] ?? 'general',
  )
  const isFirstStep = computed(() => currentStepIndex.value === 0)
  const isLastStep = computed(() => currentStepIndex.value === QUIZ_FORM_STEPS.length - 1)
  const stepCount = QUIZ_FORM_STEPS.length

  /**
   * Validate the current step. VeeValidate's `validateField` returns a false
   * positive for array paths (e.g. `questions`), so question fields are
   * validated explicitly, per index.
   */
  async function stepFieldPaths(): Promise<Path<QuizFormValues>[]> {
    const paths = [...STEP_FIELDS[currentStep.value]]

    if (currentStep.value === 'questions') {
      values.questions.forEach((_, index) => {
        paths.push(
          `questions[${index}].text` as Path<QuizFormValues>,
          `questions[${index}].options` as Path<QuizFormValues>,
          `questions[${index}].correctAnswerIndex` as Path<QuizFormValues>,
        )
      })
    }

    return paths
  }

  async function goToNextStep(): Promise<boolean> {
    const paths = await stepFieldPaths()
    if (paths.length > 0) {
      const results = await Promise.all(paths.map((path) => validateField(path)))
      if (results.some((r) => !r.valid)) return false
    }
    if (!isLastStep.value) currentStepIndex.value += 1
    return true
  }

  function goToPreviousStep(): void {
    if (!isFirstStep.value) currentStepIndex.value -= 1
  }

  function goToStep(index: number): void {
    if (index >= 0 && index < stepCount) currentStepIndex.value = index
  }

  // Question management
  function addQuestion(): void {
    pushQuestion(createEmptyQuestion())
  }

  function removeQuestionAt(index: number): void {
    if (questionFields.value.length > 1) {
      removeQuestion(index)
    }
  }

  // Tags
  const tagSuggestions = computed(() =>
    quizStore.getAllTags.filter((tag) => !values.tags.includes(tag)),
  )

  function addTag(tag: string): void {
    const trimmed = tag.trim()
    if (trimmed && !values.tags.includes(trimmed)) {
      setFieldValue('tags', [...values.tags, trimmed])
    }
  }

  function removeTag(tag: string): void {
    setFieldValue(
      'tags',
      values.tags.filter((t) => t !== tag),
    )
  }

  // Submission
  const submit = handleSubmit((formValues) => {
    const id = editingQuizId.value ?? `quiz-${Date.now()}`
    const quiz = formValuesToQuiz(formValues, id)

    if (editingQuizId.value) {
      quizStore.updateQuiz(id, quiz)
    } else {
      quizStore.addQuiz(quiz)
    }

    router.push({ name: 'quiz-management' })
  })

  function reloadQuizFromStore(id: string): void {
    const quiz = quizStore.getQuizById(id)
    if (!quiz) return
    editingQuizId.value = quiz.id
    const nextValues = quizToFormValues(quiz)
    resetForm({ values: nextValues })
    replaceQuestions(nextValues.questions)
    currentStepIndex.value = 0
  }

  return {
    // Form state
    errors,
    values,
    setFieldValue,

    // Steps
    currentStep,
    currentStepIndex,
    stepCount,
    isFirstStep,
    isLastStep,
    goToNextStep,
    goToPreviousStep,
    goToStep,

    // Questions
    questionFields,
    addQuestion,
    removeQuestionAt,

    // Tags
    tagSuggestions,
    addTag,
    removeTag,

    // Submit
    submit,
    isEditing,
    reloadQuizFromStore,
  }
}
