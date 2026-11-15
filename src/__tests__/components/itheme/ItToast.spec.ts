import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ItToast from '../../../components/itheme/ItToast.vue'
import { themeClasses } from '../../support/theme-classes'

describe('ItToast', () => {
  it('renders a div carrying it-toast with the default end and bottom placement, with the slot content', () => {
    const wrapper = mount(ItToast, { slots: { default: 'Toast' } })

    expect(wrapper.element.tagName).toBe('DIV')
    expect(themeClasses(wrapper)).toEqual(['it-toast', 'it-toast-bottom', 'it-toast-end'])
    expect(wrapper.text()).toBe('Toast')
  })

  it.each(['start', 'center', 'end'] as const)(
    'maps horizontal %s to its own modifier class',
    (horizontal) => {
      const wrapper = mount(ItToast, { props: { horizontal } })

      expect(themeClasses(wrapper)).toEqual([
        'it-toast',
        'it-toast-bottom',
        `it-toast-${horizontal}`,
      ])
    },
  )

  it.each([
    { vertical: 'top', expected: ['it-toast', 'it-toast-end', 'it-toast-top'] },
    { vertical: 'middle', expected: ['it-toast', 'it-toast-end', 'it-toast-middle'] },
    { vertical: 'bottom', expected: ['it-toast', 'it-toast-bottom', 'it-toast-end'] },
  ] as const)('maps vertical $vertical to its own modifier class', ({ vertical, expected }) => {
    const wrapper = mount(ItToast, { props: { vertical } })

    expect(themeClasses(wrapper)).toEqual(expected)
  })
})
