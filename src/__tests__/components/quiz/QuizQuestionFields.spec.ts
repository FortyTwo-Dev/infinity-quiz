import { normalize } from '../../support/accessibility'
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
  const byName = controlMatching(wrapper, /Question text/i)
  if (byName) return byName

  return wrapper
    .findAll('textarea, input')
    .find((candidate) => /^question-\d+-text$/.test(candidate.attributes('id') ?? ''))
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

/** Reveal the advanced section when the step still starts it collapsed. */
async function expandAdvanced(wrapper: Wrapper) {
  const toggle = control(wrapper, 'Advanced options')
  if (toggle && toggle.attributes('aria-expanded') === 'false') {
    await toggle.trigger('click')
    await nextTick()
  }
}

const contextLabel = 'Context (optional, Markdown)'

function contextField(wrapper: Wrapper) {
  return control(wrapper, contextLabel)
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

  it('renders a Markdown context textarea keyed to the question index', async () => {
    const { wrapper } = mountStep()
    await expandAdvanced(wrapper)

    const field = contextField(wrapper)
    expect(field).toBeDefined()
    expect(field!.element.tagName).toBe('TEXTAREA')
    expect(field!.attributes('id')).toBe('question-0-context')
  })

  it('indexes the context textarea after the questionIndex prop', async () => {
    const { wrapper } = mountStep({ questionIndex: 1 }, 2)
    await expandAdvanced(wrapper)

    expect(contextField(wrapper)?.attributes('id')).toBe('question-1-context')
  })

  it('stores the context in the form', async () => {
    const { wrapper, form } = mountStep()
    await expandAdvanced(wrapper)

    await contextField(wrapper)!.setValue('Use **markdown**')
    await nextTick()

    expect(form.values.questions[0].context).toBe('Use **markdown**')
  })

  it('starts in Write mode with both context toggles exposed', async () => {
    const { wrapper } = mountStep()
    await expandAdvanced(wrapper)

    expect(control(wrapper, 'Write')?.attributes('aria-pressed')).toBe('true')
    expect(control(wrapper, 'Preview')?.attributes('aria-pressed')).toBe('false')
  })

  it('previews the context as rendered HTML and returns to the textarea', async () => {
    const { wrapper } = mountStep()
    await expandAdvanced(wrapper)
    await contextField(wrapper)!.setValue('Use **markdown**')
    await nextTick()

    await control(wrapper, 'Preview')!.trigger('click')
    await nextTick()

    const preview = wrapper.find('.quiz-context-preview')
    expect(preview.exists()).toBe(true)
    expect(preview.find('strong').text()).toBe('markdown')

    await control(wrapper, 'Write')!.trigger('click')
    await nextTick()

    expect(contextField(wrapper)?.element.tagName).toBe('TEXTAREA')
  })

  it('says there is nothing to preview for an empty context', async () => {
    const { wrapper } = mountStep()
    await expandAdvanced(wrapper)

    await control(wrapper, 'Preview')!.trigger('click')
    await nextTick()

    expect(normalize(wrapper.find('.quiz-context-preview').text())).toContain(
      'Nothing to preview yet.',
    )
  })

  it('labelled the explanation as Markdown', async () => {
    const { wrapper } = mountStep()
    await expandAdvanced(wrapper)

    expect(controlMatching(wrapper, /explanation[\s\S]*markdown/i)).toBeDefined()
  })
})
