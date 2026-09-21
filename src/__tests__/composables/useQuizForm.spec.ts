import { describe, it, expect, beforeEach, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { useQuizStore } from '../../stores'
import type { Quiz } from '../../types/quiz'
import { setupTestPinia } from '../stores/setup'

const push = vi.fn<() => void>()
vi.mock('vue-router', () => ({
  useRouter: () => ({ push }),
}))

import { useQuizForm } from '../../composables/useQuizForm'

type FormApi = ReturnType<typeof useQuizForm>

/**
 * VeeValidate requires a component instance, so expose the composable through
 * a throwaway component and capture its return value.
 */
function withForm(quizId?: string) {
  let api!: FormApi
  const Comp = defineComponent({
    setup() {
      api = useQuizForm(quizId)
      return () => h('div')
    },
  })
  const wrapper = mount(Comp)
  return { wrapper, api }
}

async function fillValidForm(api: FormApi) {
  api.setFieldValue('title', 'My quiz')
  api.setFieldValue('description', 'A description')
  api.setFieldValue('questions[0].text', 'Q1?')
  api.setFieldValue('questions[0].options', ['A', 'B'])
  api.setFieldValue('questions[0].correctAnswerIndex', 0)
  await nextTick()
}

describe('useQuizForm', () => {
  beforeEach(() => {
    setupTestPinia()
    vi.clearAllMocks()
  })

  it('should start on the first step with one empty question', () => {
    const { api } = withForm()
    expect(api.currentStep.value).toBe('general')
    expect(api.questionFields.value).toHaveLength(1)
    expect(api.values.title).toBe('')
  })

  it('should block next step when general info is invalid', async () => {
    const { api } = withForm()

    const advanced = await api.goToNextStep()

    expect(advanced).toBe(false)
    expect(api.currentStep.value).toBe('general')
    expect(api.errors.value.title).toBeDefined()
  })

  it('should advance when the current step is valid', async () => {
    const { api } = withForm()
    api.setFieldValue('title', 'My quiz')
    api.setFieldValue('description', 'A description')
    await nextTick()

    const advanced = await api.goToNextStep()

    expect(advanced).toBe(true)
    expect(api.currentStep.value).toBe('questions')
  })

  it('should validate the questions step before advancing', async () => {
    const { api } = withForm()
    api.setFieldValue('title', 'My quiz')
    api.setFieldValue('description', 'A description')
    await api.goToNextStep() // now on questions, empty

    const advanced = await api.goToNextStep()

    expect(advanced).toBe(false)
    expect(api.currentStep.value).toBe('questions')
  })

  it('should add and remove questions, never going below one', () => {
    const { api } = withForm()

    api.addQuestion()
    expect(api.questionFields.value).toHaveLength(2)

    api.removeQuestionAt(1)
    expect(api.questionFields.value).toHaveLength(1)

    api.removeQuestionAt(0)
    expect(api.questionFields.value).toHaveLength(1)
  })

  it('should manage tags without duplicates', () => {
    const { api } = withForm()

    api.addTag('  geography ')
    api.addTag('geography')

    expect(api.values.tags).toEqual(['geography'])

    api.removeTag('geography')
    expect(api.values.tags).toEqual([])
  })

  it('should add a quiz on submit when creating', async () => {
    const quizStore = useQuizStore()
    const { api } = withForm()
    await fillValidForm(api)

    await api.submit()

    expect(quizStore.quizzes).toHaveLength(1)
    expect(quizStore.quizzes[0]?.title).toBe('My quiz')
    expect(push).toHaveBeenCalledWith({ name: 'quiz-management' })
  })

  it('should update the quiz on submit when editing', async () => {
    const quizStore = useQuizStore()
    const quiz: Quiz = {
      id: 'quiz-1',
      title: 'Old title',
      description: 'Old description',
      questions: [{ id: 'q1', text: 'Old?', options: ['A', 'B'], correctAnswerIndex: 0 }],
    }
    quizStore.addQuiz(quiz)

    const { api } = withForm('quiz-1')
    expect(api.isEditing.value).toBe(true)
    expect(api.values.title).toBe('Old title')

    api.setFieldValue('title', 'New title')
    await nextTick()
    await api.submit()

    expect(quizStore.quizzes).toHaveLength(1)
    expect(quizStore.getQuizById('quiz-1')?.title).toBe('New title')
  })

  it('should preserve existing question ids when editing', async () => {
    const quizStore = useQuizStore()
    const quiz: Quiz = {
      id: 'quiz-1',
      title: 'Title',
      description: 'Description',
      questions: [
        { id: 'q-existing', text: 'Old?', options: ['A', 'B'], correctAnswerIndex: 0 },
      ],
    }
    quizStore.addQuiz(quiz)

    const { api } = withForm('quiz-1')
    api.setFieldValue('questions[0].text', 'Updated?')
    await nextTick()
    await api.submit()

    expect(quizStore.getQuizById('quiz-1')?.questions[0]?.id).toBe('q-existing')
    expect(quizStore.getQuizById('quiz-1')?.questions[0]?.text).toBe('Updated?')
  })

  it('should not submit while the form is invalid', async () => {
    const quizStore = useQuizStore()
    const { api } = withForm()

    await api.submit()

    expect(quizStore.quizzes).toHaveLength(0)
  })
})
