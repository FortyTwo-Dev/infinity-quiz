import { normalize } from '../../support/accessibility'
import { describe, it, expect } from 'vitest'
import { nextTick } from 'vue'
import QuizQuestionsStep from '../../../components/quiz/form/QuizQuestionsStep.vue'
import {
  control,
  controlMatching,
  mountInForm,
  questionFixture,
  type Wrapper,
} from '../../support/form'

function mountStep(questionCount: number) {
  return mountInForm(QuizQuestionsStep, {
    initialValues: {
      questions: questionFixture(questionCount),
    },
    props: { questionCount },
  })
}

function stepComponent(wrapper: Wrapper) {
  return wrapper.findComponent(QuizQuestionsStep)
}

describe('QuizQuestionsStep', () => {
  it('renders one card per question, numbered from one', () => {
    const { wrapper } = mountStep(3)
    const rendered = normalize(wrapper.text())

    expect(rendered).toContain('Question 1')
    expect(rendered).toContain('Question 2')
    expect(rendered).toContain('Question 3')
  })

  it('renders no remove control for a single question', () => {
    const { wrapper } = mountStep(1)

    expect(controlMatching(wrapper, /remove question/i)).toBeUndefined()
  })

  it('renders a remove control for every question when there are several', () => {
    const { wrapper } = mountStep(2)

    expect(control(wrapper, 'Remove question 1')).toBeDefined()
    expect(control(wrapper, 'Remove question 2')).toBeDefined()
  })

  it('emits add when Add question is activated', async () => {
    const { wrapper } = mountStep(1)

    const add = control(wrapper, 'Add question')
    expect(add).toBeDefined()
    await add!.trigger('click')
    await nextTick()

    expect(stepComponent(wrapper).emitted('add')).toHaveLength(1)
  })

  it('emits remove with the index of the removed question', async () => {
    const { wrapper } = mountStep(2)

    await control(wrapper, 'Remove question 2')!.trigger('click')
    await nextTick()

    expect(stepComponent(wrapper).emitted('remove')).toEqual([[1]])
  })
})
