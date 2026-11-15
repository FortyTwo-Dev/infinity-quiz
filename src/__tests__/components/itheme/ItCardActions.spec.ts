import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ItCardActions from '../../../components/itheme/ItCardActions.vue'
import { themeClasses } from '../../support/theme-classes'

describe('ItCardActions', () => {
  it('renders a div carrying it-card-actions and the default end alignment, with the slot content', () => {
    const wrapper = mount(ItCardActions, { slots: { default: 'Actions' } })

    expect(wrapper.element.tagName).toBe('DIV')
    expect(themeClasses(wrapper)).toEqual(['it-card-actions', 'it-card-actions-end'])
    expect(wrapper.text()).toBe('Actions')
  })

  it.each(['start', 'center', 'end', 'between'] as const)(
    'maps justify %s to its own modifier class',
    (justify) => {
      const wrapper = mount(ItCardActions, { props: { justify } })

      expect(themeClasses(wrapper)).toEqual(['it-card-actions', `it-card-actions-${justify}`])
    },
  )
})
