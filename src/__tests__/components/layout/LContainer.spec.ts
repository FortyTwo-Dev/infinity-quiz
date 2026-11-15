import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { LContainer } from '../../../components/layout/container'
import { themeClasses } from '../../support/theme-classes'

describe('LContainer', () => {
  it('renders a div carrying l-container by default, with the slot content', () => {
    const wrapper = mount(LContainer, { slots: { default: 'Content' } })

    expect(wrapper.element.tagName).toBe('DIV')
    expect(themeClasses(wrapper)).toEqual(['l-container'])
    expect(wrapper.text()).toBe('Content')
  })

  it('renders the element requested by as', () => {
    const wrapper = mount(LContainer, { props: { as: 'main' }, slots: { default: 'Content' } })

    expect(wrapper.element.tagName).toBe('MAIN')
    expect(themeClasses(wrapper)).toEqual(['l-container'])
  })

  it('adds l-container-fluid when fluid', () => {
    const wrapper = mount(LContainer, { props: { fluid: true } })

    expect(themeClasses(wrapper)).toEqual(['l-container', 'l-container-fluid'])
  })

  it('adds l-container-<size> for an explicit size', () => {
    const wrapper = mount(LContainer, { props: { size: 'xl' } })

    expect(themeClasses(wrapper)).toEqual(['l-container', 'l-container-xl'])
  })

  it('ignores size when fluid', () => {
    const wrapper = mount(LContainer, { props: { fluid: true, size: 'xl' } })

    expect(themeClasses(wrapper)).toEqual(['l-container', 'l-container-fluid'])
  })

  it('adds l-container-pad-<padding> for an explicit padding', () => {
    const wrapper = mount(LContainer, { props: { padding: 'lg' } })

    expect(themeClasses(wrapper)).toEqual(['l-container', 'l-container-pad-lg'])
  })

  it('adds no padding class when padding is omitted', () => {
    const wrapper = mount(LContainer)

    expect(themeClasses(wrapper).filter((name) => name.startsWith('l-container-pad-'))).toEqual([])
  })

  it.each([true, false])('leaves the class list untouched for centered=%s', (centered) => {
    const wrapper = mount(LContainer, { props: { centered } })

    expect(themeClasses(wrapper)).toEqual(['l-container'])
  })
})
