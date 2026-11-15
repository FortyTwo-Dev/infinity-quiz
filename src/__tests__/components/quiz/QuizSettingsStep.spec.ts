import { describe, it, expect } from 'vitest'
import { defineComponent, h, nextTick, type Component } from 'vue'
import { mount } from '@vue/test-utils'
import { useForm } from 'vee-validate'
import QuizSettingsStep from '../../../components/quiz/form/QuizSettingsStep.vue'

type Wrapper = ReturnType<typeof mount>
type FormApi = ReturnType<typeof useForm>

const CONTROL_SELECTOR =
  'input, select, textarea, button, [role="button"], [role="checkbox"], [role="radio"], [role="switch"]'

function mountInForm(component: Component, initialValues: Record<string, unknown>) {
  let form!: FormApi
  const Host = defineComponent({
    setup() {
      form = useForm({ initialValues })
      return () => h(component)
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

const initialValues = {
  timeLimit: undefined as number | undefined,
  maxSkips: undefined as number | undefined,
  shuffleQuestions: false,
  shuffleAnswers: false,
  enableReviewMode: false,
  feedbackEnabled: false,
}

function mountStep(overrides: Record<string, unknown> = {}) {
  return mountInForm(QuizSettingsStep, { ...initialValues, ...overrides })
}

describe('QuizSettingsStep', () => {
  it('renders the numeric field labels', () => {
    const { wrapper } = mountStep()
    const rendered = normalize(wrapper.text())

    expect(rendered).toContain('Time limit (seconds, optional)')
    expect(rendered).toContain('Maximum skips (optional)')
  })

  it('stores the time limit typed in the form', async () => {
    const { wrapper, form } = mountStep()

    const input = control(wrapper, 'Time limit')
    expect(input).toBeDefined()
    await input!.setValue('300')
    await nextTick()

    expect(String(form.values.timeLimit)).toBe('300')
  })

  it('stores the maximum skips typed in the form', async () => {
    const { wrapper, form } = mountStep()

    const input = control(wrapper, 'Maximum skips')
    expect(input).toBeDefined()
    await input!.setValue('7')
    await nextTick()

    expect(String(form.values.maxSkips)).toBe('7')
  })

  it('renders the four checkbox labels', () => {
    const { wrapper } = mountStep()
    const rendered = normalize(wrapper.text())

    expect(rendered).toContain('Shuffle questions')
    expect(rendered).toContain('Shuffle all answers')
    expect(rendered).toContain('Enable review mode at the end')
    expect(rendered).toContain('Show immediate feedback after each answer')
  })

  it('stores the boolean when a checkbox is toggled and restores it when untoggled', async () => {
    const { wrapper, form } = mountStep()

    const checkbox = control(wrapper, 'Shuffle questions')
    expect(checkbox).toBeDefined()

    await checkbox!.setValue(true)
    await nextTick()
    expect(form.values.shuffleQuestions).toBe(true)

    await checkbox!.setValue(false)
    await nextTick()
    expect(form.values.shuffleQuestions).toBe(false)
  })

  it('stores the boolean of each checkbox in its own field', async () => {
    const { wrapper, form } = mountStep()

    await control(wrapper, 'Shuffle all answers')!.setValue(true)
    await control(wrapper, 'Enable review mode at the end')!.setValue(true)
    await control(wrapper, 'Show immediate feedback after each answer')!.setValue(true)
    await nextTick()

    expect(form.values.shuffleAnswers).toBe(true)
    expect(form.values.enableReviewMode).toBe(true)
    expect(form.values.feedbackEnabled).toBe(true)
  })

  it('reflects a checkbox already true in the initial values', () => {
    const { wrapper } = mountStep({ shuffleQuestions: true })

    const checkbox = control(wrapper, 'Shuffle questions')
    expect(checkbox).toBeDefined()
    expect((checkbox!.element as HTMLInputElement).checked).toBe(true)
  })
})
