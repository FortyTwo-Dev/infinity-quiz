import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ItCardTitle from '../../../components/itheme/ItCardTitle.vue'
import { themeClasses } from '../../support/theme-classes'

describe('ItCardTitle', () => {
  it('renders an h2 carrying it-card-title by default, with the slot content', () => {
    const wrapper = mount(ItCardTitle, { slots: { default: 'Title' } })

    expect(wrapper.element.tagName).toBe('H2')
    expect(themeClasses(wrapper)).toEqual(['it-card-title'])
    expect(wrapper.text()).toBe('Title')
  })

  it('renders the heading level requested by as', () => {
    const wrapper = mount(ItCardTitle, {
      props: { as: 'h3' },
      slots: { default: 'Title' },
    })

    expect(wrapper.element.tagName).toBe('H3')
    expect(themeClasses(wrapper)).toEqual(['it-card-title'])
  })

  it('adds it-card-title-sm for size sm', () => {
    const wrapper = mount(ItCardTitle, { props: { size: 'sm' } })

    expect(themeClasses(wrapper)).toEqual(['it-card-title', 'it-card-title-sm'])
  })

  it('adds it-card-title-lg for size lg', () => {
    const wrapper = mount(ItCardTitle, { props: { size: 'lg' } })

    expect(themeClasses(wrapper)).toEqual(['it-card-title', 'it-card-title-lg'])
  })

  it('adds no size class for size md', () => {
    const wrapper = mount(ItCardTitle, { props: { size: 'md' } })

    expect(themeClasses(wrapper)).toEqual(['it-card-title'])
  })
})
