import type { VueWrapper } from '@vue/test-utils'

/**
 * What a screen reader would announce, read from the DOM the test renders.
 *
 * jsdom fills `element.labels` for a labelled control but not the label query
 * that a browser resolves, so the lookup walks the sources in order instead of
 * trusting one API.
 */

/** Collapse whitespace, so an attribute and a text node compare equal. */
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

  const wrapping = element.closest('label')
  if (normalize(wrapping?.textContent)) return normalize(wrapping?.textContent)

  if (element.tagName === 'BUTTON') return normalize(element.textContent)

  const title = element.getAttribute('title')
  if (title) return normalize(title)

  return normalize(element.textContent)
}

/** The button a user reaches by its accessible name. */
export function buttonNamed(wrapper: VueWrapper, name: string) {
  const match = wrapper
    .findAll('button')
    .find((candidate) => accessibleName(candidate.element) === name)
  if (!match) throw new Error(`No button named "${name}"`)
  return match
}
