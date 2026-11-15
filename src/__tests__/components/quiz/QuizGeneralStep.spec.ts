import { describe, it, expect } from 'vitest'
import { defineComponent, h, nextTick, type Component } from 'vue'
import { mount } from '@vue/test-utils'
import { useForm } from 'vee-validate'
import QuizGeneralStep from '../../../components/quiz/form/QuizGeneralStep.vue'
import { DEFAULT_THEME, THEME_OPTIONS } from '@/constants/themes'

type Wrapper = ReturnType<typeof mount>

const CONTROL_SELECTOR =
  'input, select, textarea, button, [role="button"], [role="checkbox"], [role="radio"], [role="switch"]'

type FormApi = ReturnType<typeof useForm>

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

/** A control whose accessible name contains `name`. */
function control(wrapper: Wrapper, name: string) {
  return wrapper.findAll(CONTROL_SELECTOR).find((candidate) => {
    const accessible = accessibleName(candidate.element)
    if (accessible.includes(normalize(name))) return true
    return candidate.attributes('name') === name
  })
}

function tagDraftInput(wrapper: Wrapper) {
  const inputs = wrapper.findAll('input').filter((candidate) => {
    const type = candidate.attributes('type') ?? 'text'
    return type === 'text'
  })

  const labelledAsTag = inputs.find((candidate) => {
    const haystack = [
      accessibleName(candidate.element),
      candidate.attributes('placeholder') ?? '',
      candidate.attributes('name') ?? '',
      candidate.attributes('id') ?? '',
    ]
      .join(' ')
      .toLowerCase()
    return haystack.includes('tag')
  })
  if (labelledAsTag) return labelledAsTag

  const excluded = (candidate: (typeof inputs)[number]) =>
    ['Title', 'Description'].includes(accessibleName(candidate.element))

  return inputs.find((candidate) => !excluded(candidate))
}

const initialValues = {
  title: '',
  description: '',
  category: '',
  theme: '',
  tags: [] as string[],
}

function mountStep(
  options: { initialValues?: Record<string, unknown>; tagSuggestions?: string[] } = {},
) {
  return mountInForm(QuizGeneralStep, {
    initialValues: options.initialValues ?? { ...initialValues },
    props: { tagSuggestions: options.tagSuggestions ?? [] },
  })
}

function stepComponent(wrapper: Wrapper) {
  return wrapper.findComponent(QuizGeneralStep)
}

describe('QuizGeneralStep', () => {
  it('renders the field labels', () => {
    const { wrapper } = mountStep()
    const rendered = normalize(wrapper.text())

    expect(rendered).toContain('Title')
    expect(rendered).toContain('Description')
    expect(rendered).toContain('Category')
    expect(rendered).toContain('Theme')
    expect(rendered).toContain('Tags')
  })

  it('stores the title typed in the form', async () => {
    const { wrapper, form } = mountStep()

    const input = control(wrapper, 'Title')
    expect(input).toBeDefined()
    await input!.setValue('World capitals')
    await nextTick()

    expect(form.values.title).toBe('World capitals')
  })

  it('renders a field error and marks the title input invalid', async () => {
    const { wrapper, form } = mountStep()

    form.setFieldError('title', 'Title is required')
    await nextTick()

    expect(normalize(wrapper.text())).toContain('Title is required')
    expect(control(wrapper, 'Title')!.attributes('aria-invalid')).toBe('true')
  })

  it('does not mark the title input invalid without an error', () => {
    const { wrapper } = mountStep()

    expect(control(wrapper, 'Title')!.attributes('aria-invalid')).toBeUndefined()
  })

  it('offers the default theme first, then one entry per theme option', () => {
    const { wrapper } = mountStep()

    const select = control(wrapper, 'Theme')
    expect(select).toBeDefined()

    const options = select!.findAll('option')
    expect(options).toHaveLength(THEME_OPTIONS.length + 1)
    expect(normalize(options[0]!.text())).toBe(
      `Default (${DEFAULT_THEME.mode}, ${DEFAULT_THEME.accent})`,
    )
    expect(options.slice(1).map((option) => normalize(option.text()))).toEqual(
      THEME_OPTIONS.map((option) => `${option.mode} · ${option.accent}`),
    )
  })

  it('stores the chosen theme in the form', async () => {
    const { wrapper, form } = mountStep()

    const select = control(wrapper, 'Theme')
    expect(select).toBeDefined()
    const chosen = select!.findAll('option')[1]!
    const chosenValue = (chosen.element as HTMLOptionElement).value

    await select!.setValue(chosenValue)
    await nextTick()

    expect(form.values.theme).toBe(THEME_OPTIONS[0]!.value)
  })

  it('emits add-tag with the trimmed draft and clears the input', async () => {
    const { wrapper } = mountStep()

    const draft = tagDraftInput(wrapper)
    expect(draft).toBeDefined()
    await draft!.setValue('  geography  ')
    await draft!.trigger('keydown', { key: 'Enter' })
    await nextTick()

    expect(stepComponent(wrapper).emitted('add-tag')).toEqual([['geography']])
    expect((draft!.element as HTMLInputElement).value).toBe('')
  })

  it('emits nothing for a blank tag draft', async () => {
    const { wrapper } = mountStep()

    const draft = tagDraftInput(wrapper)
    expect(draft).toBeDefined()
    await draft!.setValue('   ')
    await draft!.trigger('keydown', { key: 'Enter' })
    await nextTick()

    expect(stepComponent(wrapper).emitted('add-tag')).toBeUndefined()
  })

  it('renders every tag suggestion and emits add-tag when one is clicked', async () => {
    const { wrapper } = mountStep({ tagSuggestions: ['history', 'science'] })

    const suggestion = control(wrapper, '+ history')
    expect(suggestion).toBeDefined()
    expect(control(wrapper, '+ science')).toBeDefined()

    await suggestion!.trigger('click')
    await nextTick()

    expect(stepComponent(wrapper).emitted('add-tag')).toEqual([['history']])
  })

  it('renders stored tags as removable badges and emits remove-tag', async () => {
    const { wrapper } = mountStep({
      initialValues: { ...initialValues, tags: ['history', 'science'] },
    })

    expect(normalize(wrapper.text())).toContain('history')
    expect(normalize(wrapper.text())).toContain('science')

    const remove = control(wrapper, 'Remove tag history')
    expect(remove).toBeDefined()

    await remove!.trigger('click')
    await nextTick()

    expect(stepComponent(wrapper).emitted('remove-tag')).toEqual([['history']])
  })
})
