import { describe, it, expect } from 'vitest'
import { defineComponent, h, nextTick, type Component } from 'vue'
import { mount } from '@vue/test-utils'
import { useForm } from 'vee-validate'
import QuizQuestionsStep from '../../../components/quiz/form/QuizQuestionsStep.vue'

type Wrapper = ReturnType<typeof mount>
type FormApi = ReturnType<typeof useForm>

const CONTROL_SELECTOR =
  'input, select, textarea, button, [role="button"], [role="checkbox"], [role="radio"], [role="switch"]'

function mountInForm(
  component: Component,
  options: { initialValues: Record<string, unknown>; props?: Record<string, unknown> },
) {
  let form!: FormApi
  const Host = defineComponent({
    setup() {
      form = useForm({ initialValues: options.initialValues })
      return () => h(component, options.props ?? {})
    },
  })
  const wrapper = mount(Host)
  return { wrapper, form }
}

function normalize(value: string | null | undefined): string {
  return (value ?? '').replace(/\s+/g, ' ').trim()
}

function accessibleName(element: Element): string {
  const aria = element.getAttribute('aria-label')
  if (aria) return normalize(aria)

  const labelledBy = element.getAttribute('aria-labelledby')
  if (labelledBy) {
    const document = element.ownerDocument
    const text = labelledBy
      .split(/\s+/)
      .map((id) => document?.getElementById(id)?.textContent ?? '')
      .join(' ')
    if (normalize(text)) return normalize(text)
  }

  const labels = (element as HTMLInputElement).labels
  if (labels && labels.length > 0) {
    const text = Array.from(labels)
      .map((label) => label.textContent)
      .join(' ')
    if (normalize(text)) return normalize(text)
  }

  if (element.tagName === 'BUTTON') return normalize(element.textContent)

  const title = element.getAttribute('title')
  if (title) return normalize(title)

  return ''
}

function control(wrapper: Wrapper, name: string) {
  return wrapper.findAll(CONTROL_SELECTOR).find((candidate) => {
    if (accessibleName(candidate.element).includes(normalize(name))) return true
    return candidate.attributes('name') === name
  })
}

function controlMatching(wrapper: Wrapper, pattern: RegExp) {
  return wrapper
    .findAll(CONTROL_SELECTOR)
    .find((candidate) => pattern.test(accessibleName(candidate.element)))
}

function createQuestion() {
  return { text: '', options: ['', ''], correctAnswerIndex: 0 }
}

function mountStep(questionCount: number) {
  return mountInForm(QuizQuestionsStep, {
    initialValues: {
      questions: Array.from({ length: questionCount }, createQuestion),
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
