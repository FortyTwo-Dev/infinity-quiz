import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { LGrid } from '../../../components/layout/grid'
import { themeClasses } from '../../support/theme-classes'

describe('LGrid', () => {
  it('renders a div carrying l-grid by default, with the slot content', () => {
    const wrapper = mount(LGrid, { slots: { default: 'Cells' } })

    expect(wrapper.element.tagName).toBe('DIV')
    expect(themeClasses(wrapper)).toEqual(['l-grid'])
    expect(wrapper.text()).toBe('Cells')
  })

  it('renders the element requested by as', () => {
    const wrapper = mount(LGrid, { props: { as: 'section' }, slots: { default: 'Cells' } })

    expect(wrapper.element.tagName).toBe('SECTION')
    expect(themeClasses(wrapper)).toEqual(['l-grid'])
  })

  it('maps a numeric cols to l-grid-cols-<n>', () => {
    const wrapper = mount(LGrid, { props: { cols: 3 } })

    expect(themeClasses(wrapper)).toEqual(['l-grid', 'l-grid-cols-3'])
  })

  it('maps cols auto-fit to l-grid-cols-auto-fit', () => {
    const wrapper = mount(LGrid, { props: { cols: 'auto-fit' } })

    expect(themeClasses(wrapper)).toEqual(['l-grid', 'l-grid-cols-auto-fit'])
  })

  it('expands a responsive cols string into one class per breakpoint and no other column class', () => {
    const wrapper = mount(LGrid, { props: { cols: '1 md:2 lg:4' } })

    expect(themeClasses(wrapper)).toEqual([
      'l-grid',
      'l-grid-cols-1',
      'l-grid-lg-cols-4',
      'l-grid-md-cols-2',
    ])
  })

  it('adds no column class when cols is omitted', () => {
    const wrapper = mount(LGrid)

    expect(themeClasses(wrapper).filter((name) => name.includes('-cols-'))).toEqual([])
  })

  it.each(['none', 'xs', 'sm', 'md', 'lg', 'xl'] as const)('maps gap %s to l-gap-<gap>', (gap) => {
    const wrapper = mount(LGrid, { props: { gap } })

    expect(themeClasses(wrapper)).toEqual(['l-gap-' + gap, 'l-grid'])
  })

  it.each(['start', 'center', 'end', 'stretch'] as const)(
    'maps align %s to l-items-<align>',
    (align) => {
      const wrapper = mount(LGrid, { props: { align } })

      expect(themeClasses(wrapper)).toEqual(['l-grid', `l-items-${align}`])
    },
  )

  it.each(['start', 'center', 'end', 'between', 'around', 'evenly'] as const)(
    'maps justify %s to l-justify-<justify>',
    (justify) => {
      const wrapper = mount(LGrid, { props: { justify } })

      expect(themeClasses(wrapper)).toEqual(['l-grid', `l-justify-${justify}`])
    },
  )
})
