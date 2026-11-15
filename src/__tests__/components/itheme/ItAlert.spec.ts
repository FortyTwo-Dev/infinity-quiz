import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ItAlert from '../../../components/itheme/ItAlert.vue'
import { themeClasses } from '../../support/theme-classes'

describe('ItAlert', () => {
  it('renders a div carrying it-alert and the default info variant, with the slot content', () => {
    const wrapper = mount(ItAlert, { slots: { default: 'Saved' } })

    expect(wrapper.element.tagName).toBe('DIV')
    expect(themeClasses(wrapper)).toEqual(['it-alert', 'it-alert-info'])
    expect(wrapper.text()).toBe('Saved')
  })

  it.each(['neutral', 'primary', 'success', 'warning', 'danger', 'info', 'ghost'] as const)(
    'maps variant %s to its own modifier class',
    (variant) => {
      const wrapper = mount(ItAlert, { props: { variant } })

      expect(themeClasses(wrapper)).toEqual(['it-alert', `it-alert-${variant}`])
    },
  )

  it('announces itself with role status when live', () => {
    const wrapper = mount(ItAlert, { props: { live: true } })

    expect(wrapper.attributes('role')).toBe('status')
  })

  it('carries no role attribute when not live', () => {
    const wrapper = mount(ItAlert)

    expect(wrapper.attributes('role')).toBeUndefined()
  })
})
