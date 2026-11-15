import { accessibleName, normalize } from '../../support/accessibility'
import { describe, it, expect } from 'vitest'
import { nextTick } from 'vue'
import QuizQuestionFields from '../../../components/quiz/form/QuizQuestionFields.vue'
import {
  control,
  controlMatching,
  mountInForm,
  questionFixture,
  type Wrapper,
} from '../../support/form'

function questionTextControl(wrapper: Wrapper) {
  const textareas = wrapper.findAll('textarea')
  if (textareas.length > 0) return textareas[0]

  return wrapper.findAll('input').find((candidate) => {
    const haystack = `${accessibleName(candidate.element)} ${candidate.attributes('name') ?? ''}`
    return !/option/i.test(haystack)
  })
}

function mountStep(
  props: { questionIndex?: number; totalQuestions?: number; canRemove?: boolean } = {},
  questionCount = 1,
) {
  const questions = questionFixture(questionCount)
  return mountInForm(QuizQuestionFields, {
    initialValues: { questions },
    props: {
      questionIndex: props.questionIndex ?? 0,
      totalQuestions: props.totalQuestions ?? questions.length,
      canRemove: props.canRemove ?? false,
    },
  })
}

function stepComponent(wrapper: Wrapper) {
  return wrapper.findComponent(QuizQuestionFields)
}

describe('QuizQuestionFields', () => {
  it('titles the card after the question index', () => {
    expect(normalize(mountStep({ questionIndex: 0 }).wrapper.text())).toContain('Question 1')
  })

  it('titles the third question card accordingly', () => {
    expect(normalize(mountStep({ questionIndex: 2 }, 3).wrapper.text())).toContain('Question 3')
  })

  it('hides the remove control when the question cannot be removed', () => {
    const { wrapper } = mountStep({ canRemove: false })

    expect(control(wrapper, 'Remove question 1')).toBeUndefined()
  })

  it('emits remove when the remove control is activated', async () => {
    const { wrapper } = mountStep({ canRemove: true })

    const remove = control(wrapper, 'Remove question 1')
    expect(remove).toBeDefined()
    await remove!.trigger('click')
    await nextTick()

    expect(stepComponent(wrapper).emitted('remove')).toHaveLength(1)
  })

  it('stores the question text in the form', async () => {
    const { wrapper, form } = mountStep()

    const text = questionTextControl(wrapper)
    expect(text).toBeDefined()
    await text!.setValue('What is the capital of France?')
    await nextTick()

    expect(form.values.questions[0].text).toBe('What is the capital of France?')
  })

  it('renders one row per option with an input, a radio and a remove control', () => {
    const { wrapper } = mountStep()

    expect(control(wrapper, 'Option 1')).toBeDefined()
    expect(control(wrapper, 'Option 2')).toBeDefined()
    expect(control(wrapper, 'Mark option 1 as correct')).toBeDefined()
    expect(control(wrapper, 'Mark option 2 as correct')).toBeDefined()
    expect(control(wrapper, 'Remove option 1')).toBeDefined()
    expect(control(wrapper, 'Remove option 2')).toBeDefined()
  })

  it('disables both remove-option controls while only two options remain', () => {
    const { wrapper } = mountStep()

    expect(control(wrapper, 'Remove option 1')!.attributes('disabled')).toBeDefined()
    expect(control(wrapper, 'Remove option 2')!.attributes('disabled')).toBeDefined()
  })

  it('appends an option and enables the remove controls', async () => {
    const { wrapper } = mountStep()

    const add = control(wrapper, 'Add option')
    expect(add).toBeDefined()
    await add!.trigger('click')
    await nextTick()

    expect(control(wrapper, 'Option 3')).toBeDefined()
    expect(control(wrapper, 'Mark option 3 as correct')).toBeDefined()
    expect(control(wrapper, 'Remove option 1')!.attributes('disabled')).toBeUndefined()
    expect(control(wrapper, 'Remove option 2')!.attributes('disabled')).toBeUndefined()
    expect(control(wrapper, 'Remove option 3')!.attributes('disabled')).toBeUndefined()
  })

  it('stores the index of the option whose radio is chosen', async () => {
    const { wrapper, form } = mountStep()

    await control(wrapper, 'Add option')!.trigger('click')
    await nextTick()

    await control(wrapper, 'Mark option 3 as correct')!.setValue()
    await nextTick()

    expect(form.values.questions[0].correctAnswerIndex).toBe(2)
  })

  it('starts with the advanced options collapsed', () => {
    const { wrapper } = mountStep()

    const toggle = control(wrapper, 'Advanced options')
    expect(toggle).toBeDefined()
    expect(toggle!.attributes('aria-expanded')).toBe('false')
    expect(controlMatching(wrapper, /explanation/i)).toBeUndefined()
  })

  it('reveals the explanation, the time limit and the shuffle checkbox once expanded', async () => {
    const { wrapper } = mountStep()

    await control(wrapper, 'Advanced options')!.trigger('click')
    await nextTick()

    expect(control(wrapper, 'Advanced options')!.attributes('aria-expanded')).toBe('true')
    expect(controlMatching(wrapper, /explanation/i)).toBeDefined()
    expect(controlMatching(wrapper, /time limit/i)).toBeDefined()
    expect(controlMatching(wrapper, /shuffle/i)).toBeDefined()
  })
})
