import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { LFlex } from '../../../components/layout/flex'
import { themeClasses } from '../../support/theme-classes'

describe('LFlex', () => {
  it('renders a div carrying l-flex by default, with the slot content', () => {
    const wrapper = mount(LFlex, { slots: { default: 'Items' } })

    expect(wrapper.element.tagName).toBe('DIV')
    expect(themeClasses(wrapper)).toEqual(['l-flex'])
    expect(wrapper.text()).toBe('Items')
  })

  it('renders the element requested by as', () => {
    const wrapper = mount(LFlex, { props: { as: 'span' }, slots: { default: 'Items' } })

    expect(wrapper.element.tagName).toBe('SPAN')
    expect(themeClasses(wrapper)).toEqual(['l-flex'])
  })

  it('replaces l-flex with l-flex-inline when inline', () => {
    const wrapper = mount(LFlex, { props: { inline: true } })

    expect(themeClasses(wrapper)).toEqual(['l-flex-inline'])
  })

  it('adds l-flex-wrap when wrap is true', () => {
    const wrapper = mount(LFlex, { props: { wrap: true } })

    expect(themeClasses(wrapper)).toEqual(['l-flex', 'l-flex-wrap'])
  })

  it('adds l-flex-nowrap when wrap is false', () => {
    const wrapper = mount(LFlex, { props: { wrap: false } })

    expect(themeClasses(wrapper)).toEqual(['l-flex', 'l-flex-nowrap'])
  })

  it('adds no wrap class when wrap is omitted', () => {
    const wrapper = mount(LFlex)

    expect(themeClasses(wrapper)).toEqual(['l-flex'])
  })

  it.each(['row', 'row-reverse', 'col', 'col-reverse'] as const)(
    'maps direction %s to l-flex-<direction>',
    (direction) => {
      const wrapper = mount(LFlex, { props: { direction } })

      expect(themeClasses(wrapper)).toEqual(['l-flex', `l-flex-${direction}`])
    },
  )

  it.each(['none', 'xs', 'sm', 'md', 'lg', 'xl'] as const)('maps gap %s to l-gap-<gap>', (gap) => {
    const wrapper = mount(LFlex, { props: { gap } })

    expect(themeClasses(wrapper)).toEqual(['l-flex', `l-gap-${gap}`])
  })

  it.each(['start', 'center', 'end', 'stretch', 'baseline'] as const)(
    'maps align %s to l-items-<align>',
    (align) => {
      const wrapper = mount(LFlex, { props: { align } })

      expect(themeClasses(wrapper)).toEqual(['l-flex', `l-items-${align}`])
    },
  )

  it.each(['start', 'center', 'end', 'between', 'around', 'evenly'] as const)(
    'maps justify %s to l-justify-<justify>',
    (justify) => {
      const wrapper = mount(LFlex, { props: { justify } })

      expect(themeClasses(wrapper)).toEqual(['l-flex', `l-justify-${justify}`])
    },
  )

  it('adds l-flex-full when fullWidth', () => {
    const wrapper = mount(LFlex, { props: { fullWidth: true } })

    expect(themeClasses(wrapper)).toEqual(['l-flex', 'l-flex-full'])
  })
})
