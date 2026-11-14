import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ItCard from '../../../components/itheme/ItCard.vue'
import ItCardBody from '../../../components/itheme/ItCardBody.vue'
import ItCardTitle from '../../../components/itheme/ItCardTitle.vue'
import ItCardActions from '../../../components/itheme/ItCardActions.vue'

describe('ItCard', () => {
  it('renders a plain surface unless a border is asked for', () => {
    expect(mount(ItCard).classes()).toEqual(['it-card'])
    expect(mount(ItCard, { props: { border: true } }).classes()).toContain('it-card-border')
  })

  it('passes its content through', () => {
    const wrapper = mount(ItCard, { slots: { default: 'Body' } })

    expect(wrapper.text()).toBe('Body')
  })
})

describe('ItCardBody', () => {
  it('applies the requested padding', () => {
    expect(mount(ItCardBody, { props: { size: 'lg' } }).classes()).toContain('it-card-body-lg')
    expect(mount(ItCardBody, { props: { size: 'none' } }).classes()).toEqual(['it-card-body'])
  })
})

describe('ItCardTitle', () => {
  it('renders the requested heading level', () => {
    const wrapper = mount(ItCardTitle, { props: { as: 'h3' }, slots: { default: 'Title' } })

    expect(wrapper.element.tagName).toBe('H3')
    expect(wrapper.text()).toBe('Title')
  })

  it('defaults to a level-two heading', () => {
    expect(mount(ItCardTitle).element.tagName).toBe('H2')
  })
})

describe('ItCardActions', () => {
  it('maps the alignment onto a class, end by default', () => {
    expect(mount(ItCardActions).classes()).toContain('it-card-actions-end')
    expect(mount(ItCardActions, { props: { justify: 'between' } }).classes()).toContain(
      'it-card-actions-between',
    )
  })
})
