import { describe, it, expect } from 'vitest'
import { nextTick } from 'vue'
import QuizSettingsStep from '../../../components/quiz/form/QuizSettingsStep.vue'
import { control, mountInForm, normalize } from '../../support/form'

const initialValues = {
  timeLimit: undefined as number | undefined,
  maxSkips: undefined as number | undefined,
  shuffleQuestions: false,
  shuffleAnswers: false,
  enableReviewMode: false,
  feedbackEnabled: false,
}

function mountStep(overrides: Record<string, unknown> = {}) {
  return mountInForm(QuizSettingsStep, { initialValues: { ...initialValues, ...overrides } })
}

describe('QuizSettingsStep', () => {
  it.each(['Time limit (seconds, optional)', 'Maximum skips (optional)'])(
    'renders the %s field',
    (label) => {
      expect(normalize(mountStep().wrapper.text())).toContain(label)
    },
  )

  it.each([
    ['Time limit', '300', 'timeLimit'],
    ['Maximum skips', '7', 'maxSkips'],
  ])('stores %s typed in the form', async (label, value, field) => {
    const { wrapper, form } = mountStep()

    const input = control(wrapper, label)
    expect(input).toBeDefined()
    await input!.setValue(value)
    await nextTick()

    expect(String(form.values[field])).toBe(value)
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
