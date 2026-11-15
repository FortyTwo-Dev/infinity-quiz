import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ItCardBody from '../../../components/itheme/ItCardBody.vue'
import { themeClasses } from '../../support/theme-classes'

describe('ItCardBody', () => {
  it('renders a div carrying it-card-body by default, with the slot content', () => {
    const wrapper = mount(ItCardBody, { slots: { default: 'Body' } })

    expect(wrapper.element.tagName).toBe('DIV')
    expect(themeClasses(wrapper)).toEqual(['it-card-body'])
    expect(wrapper.text()).toBe('Body')
  })

  it('adds it-card-body-sm for size sm', () => {
    const wrapper = mount(ItCardBody, { props: { size: 'sm' } })

    expect(themeClasses(wrapper)).toEqual(['it-card-body', 'it-card-body-sm'])
  })

  it('adds it-card-body-lg for size lg', () => {
    const wrapper = mount(ItCardBody, { props: { size: 'lg' } })

    expect(themeClasses(wrapper)).toEqual(['it-card-body', 'it-card-body-lg'])
  })

  it('adds no size class for size none', () => {
    const wrapper = mount(ItCardBody, { props: { size: 'none' } })

    expect(themeClasses(wrapper)).toEqual(['it-card-body'])
  })

  it('adds no size class for size md', () => {
    const wrapper = mount(ItCardBody, { props: { size: 'md' } })

    expect(themeClasses(wrapper)).toEqual(['it-card-body'])
  })
})
