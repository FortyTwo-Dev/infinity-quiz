import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuizStore } from '../stores'
import type { Quiz, Question } from '../types/quiz'

export interface FormQuestion {
  id: string
  text: string
  options: string[]
  correctAnswerIndex: number
  timeLimit?: number
  shuffleAnswers?: boolean
  explanation?: string
}

export interface QuizFormState {
  title: string
  description: string
  category: string
  tags: string[]
  timeLimit?: number
  shuffleQuestions: boolean
  shuffleAnswers: boolean
  maxSkips?: number
  enableReviewMode: boolean
  feedbackEnabled: boolean
  questions: FormQuestion[]
}

export function useQuizForm(quizId?: string) {
  const router = useRouter()
  const quizStore = useQuizStore()

  // Store the current quiz ID being edited
  const currentQuizId = ref<string | undefined>(quizId)

  // Form state
  const form = ref<QuizFormState>({
    title: '',
    description: '',
    category: '',
    tags: [],
    timeLimit: undefined,
    shuffleQuestions: false,
    shuffleAnswers: false,
    maxSkips: undefined,
    enableReviewMode: false,
    feedbackEnabled: false,
    questions: [
      {
        id: `q-new-0`,
        text: '',
        options: ['', ''],
        correctAnswerIndex: 0,
      },
    ],
  })

  // Load quiz data into form
  const loadQuiz = (id: string): void => {
    const existingQuiz = quizStore.getQuizById(id)
    if (existingQuiz) {
      currentQuizId.value = id
      form.value = {
        title: existingQuiz.title || '',
        description: existingQuiz.description || '',
        category: existingQuiz.category || '',
        tags: existingQuiz.tags || [],
        timeLimit: existingQuiz.timeLimit,
        shuffleQuestions: existingQuiz.shuffleQuestions ?? false,
        shuffleAnswers: existingQuiz.shuffleAnswers ?? false,
        maxSkips: existingQuiz.maxSkips,
        enableReviewMode: existingQuiz.enableReviewMode ?? false,
        feedbackEnabled: existingQuiz.feedbackEnabled ?? false,
        questions: existingQuiz.questions.map((q: Question): FormQuestion => ({
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
  }

  // Load existing quiz if ID provided
  if (quizId) {
    loadQuiz(quizId)
  }

  // Validation
  const errors = ref<Record<string, string>>({})

  const validate = (): boolean => {
    errors.value = {}

    if (!form.value.title.trim()) {
      errors.value.title = "Le titre est requis"
    }

    if (!form.value.description.trim()) {
      errors.value.description = "La description est requise"
    }

    if (form.value.questions.length === 0) {
      errors.value.questions = "Au moins une question est requise"
    }

    form.value.questions.forEach((q: FormQuestion, index) => {
      if (!q.text.trim()) {
        errors.value[`question-${index}-text`] = `Le texte de la question ${index + 1} est requis`
      }

      if (q.options.length < 2) {
        errors.value[`question-${index}-options`] = `La question ${index + 1} doit avoir au moins 2 options`
      }

      if (q.correctAnswerIndex < 0 || q.correctAnswerIndex >= q.options.length) {
        errors.value[`question-${index}-correctAnswer`] = `L'index de la bonne réponse pour la question ${index + 1} est invalide`
      }

      q.options.forEach((option, optionIndex) => {
        if (!option.trim()) {
          errors.value[`question-${index}-option-${optionIndex}`] = `L'option ${optionIndex + 1} de la question ${index + 1} est requise`
        }
      })
    })

    return Object.keys(errors.value).length === 0
  }

  const validateQuestion = (questionIndex: number): boolean => {
    const q: FormQuestion | undefined = form.value.questions[questionIndex]
    const questionErrors: Record<string, string> = {}

    if (!q?.text.trim()) {
      questionErrors.text = "Le texte de la question est requis"
    }

    if (!q || q.options.length < 2) {
      questionErrors.options = "Au moins 2 options sont requises"
    }

    if (q && (q.correctAnswerIndex < 0 || q.correctAnswerIndex >= q.options.length)) {
      questionErrors.correctAnswerIndex = "L'index de la bonne réponse est invalide"
    }

    if (q) {
      q.options.forEach((option, optionIndex) => {
        if (!option.trim()) {
          questionErrors[`option-${optionIndex}`] = `L'option ${optionIndex + 1} est requise`
        }
      })
    }

    return Object.keys(questionErrors).length === 0
  }

  // Question management
  const addQuestion = () => {
    form.value.questions.push({
      id: `q-new-${Date.now()}`,
      text: '',
      options: ['', ''],
      correctAnswerIndex: 0,
    })
  }

  const removeQuestion = (index: number) => {
    if (form.value.questions.length > 1) {
      form.value.questions.splice(index, 1)
    }
  }

  const addOption = (questionIndex: number) => {
    const question = form.value.questions[questionIndex]
    if (question) {
      question.options.push('')
    }
  }

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const question = form.value.questions[questionIndex]
    if (question && question.options.length > 2) {
      question.options.splice(optionIndex, 1)
      // Adjust correct answer if needed
      if (question.correctAnswerIndex >= optionIndex) {
        question.correctAnswerIndex = Math.max(0, question.correctAnswerIndex - 1)
      }
    }
  }

  const addTag = (tag: string) => {
    if (tag && !form.value.tags.includes(tag)) {
      form.value.tags.push(tag)
    }
  }

  const removeTag = (tag: string) => {
    form.value.tags = form.value.tags.filter((t) => t !== tag)
  }

  // Tag suggestions from existing quizzes
  const tagSuggestions = computed(() => {
    const existingTags = new Set(quizStore.getAllTags)
    return Array.from(existingTags).filter((t) => !form.value.tags.includes(t))
  })

  // Submit
  const submit = async (): Promise<Quiz | null> => {
    if (!validate()) {
      return null
    }

    const quizData: Quiz = {
      id: currentQuizId.value || `quiz-${Date.now()}`,
      title: form.value.title,
      description: form.value.description,
      category: form.value.category || undefined,
      tags: form.value.tags.length > 0 ? form.value.tags : undefined,
      timeLimit: form.value.timeLimit,
      shuffleQuestions: form.value.shuffleQuestions,
      shuffleAnswers: form.value.shuffleAnswers,
      maxSkips: form.value.maxSkips,
      enableReviewMode: form.value.enableReviewMode,
      feedbackEnabled: form.value.feedbackEnabled,
      questions: form.value.questions.map((q) => ({
        id: q.id,
        text: q.text,
        options: q.options,
        correctAnswerIndex: q.correctAnswerIndex,
        timeLimit: q.timeLimit,
        shuffleAnswers: q.shuffleAnswers,
        explanation: q.explanation,
      })),
    }

    if (currentQuizId.value) {
      quizStore.updateQuiz(currentQuizId.value, quizData)
    } else {
      quizStore.addQuiz(quizData)
    }

    return quizData
  }

  const saveAndContinue = async (): Promise<Quiz | null> => {
    const result = await submit()
    if (result) {
      router.push({ name: 'quiz-list' })
    }
    return result
  }

  const saveAndCreateNew = async (): Promise<Quiz | null> => {
    const result = await submit()
    if (result) {
      // Reset form for new quiz
      form.value = {
        title: '',
        description: '',
        category: '',
        tags: [],
        timeLimit: undefined,
        shuffleQuestions: false,
        shuffleAnswers: false,
        maxSkips: undefined,
        enableReviewMode: false,
        feedbackEnabled: false,
        questions: [
          {
            id: `q-new-0`,
            text: '',
            options: ['', ''],
            correctAnswerIndex: 0,
          },
        ],
      }
    }
    return result
  }

  return {
    form,
    errors,
    tagSuggestions,
    validate,
    validateQuestion,
    addQuestion,
    removeQuestion,
    addOption,
    removeOption,
    addTag,
    removeTag,
    submit,
    saveAndContinue,
    saveAndCreateNew,
    loadQuiz,
  }
}
