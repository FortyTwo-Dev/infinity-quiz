/**
 * Shared harness for the form-step specs.
 *
 * A step renders vee-validate `<Field>` components, which need a form context:
 * the subject cannot be mounted alone. The rest identifies a control the way a
 * user does, by its accessible name, so a spec never depends on a CSS class.
 */
import { defineComponent, h, nextTick, type Component } from 'vue'
import { mount } from '@vue/test-utils'
import { useForm } from 'vee-validate'

export type Wrapper = ReturnType<typeof mount>
export type FormApi = ReturnType<typeof useForm>

export const CONTROL_SELECTOR =
  'input, select, textarea, button, [role="button"], [role="checkbox"], [role="radio"], [role="switch"]'

interface MountOptions {
  initialValues: Record<string, unknown>
  props?: Record<string, unknown>
}

/** Mount a step inside a throwaway host that owns the form context. */
export function mountInForm(component: Component, options: MountOptions) {
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

export function normalize(value: string | null | undefined): string {
  return (value ?? '').replace(/\s+/g, ' ').trim()
}

export function accessibleName(element: Element): string {
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

/** The first control whose accessible name contains `name`. */
export function control(wrapper: Wrapper, name: string) {
  return wrapper.findAll(CONTROL_SELECTOR).find((candidate) => {
    if (accessibleName(candidate.element).includes(normalize(name))) return true
    return candidate.attributes('name') === name
  })
}

/** The first control whose accessible name matches `pattern`. */
export function controlMatching(wrapper: Wrapper, pattern: RegExp) {
  return wrapper
    .findAll(CONTROL_SELECTOR)
    .find((candidate) => pattern.test(accessibleName(candidate.element)))
}

/**
 * Type `value` into the control named `controlName`, then let the form settle.
 * Used by the specs that pin "this field feeds that form value".
 */
export async function typeIntoForm(
  step: { wrapper: Wrapper; form: FormApi },
  controlName: string,
  value: string,
): Promise<void> {
  const input = control(step.wrapper, controlName)
  if (!input) throw new Error(`no control named "${controlName}"`)

  await input.setValue(value)
  await nextTick()
}

/** A blank question, as the creation form starts one. */
export function questionFixture(count = 1) {
  return Array.from({ length: count }, () => ({
    text: '',
    options: ['', ''],
    correctAnswerIndex: 0,
  }))
}
