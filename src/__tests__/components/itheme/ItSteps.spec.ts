import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ItSteps from '../../../components/itheme/ItSteps.vue'

describe('ItSteps', () => {
  const steps = ['General', 'Questions', 'Settings', 'Review']

  it('renders one list item per step, in order', () => {
    const wrapper = mount(ItSteps, { props: { steps, current: 1 } })

    const items = wrapper.findAll('li')
    expect(items).toHaveLength(4)
    expect(items.map((item) => item.text())).toEqual(steps)
  })

  it('marks exactly the current step with aria-current', () => {
    const wrapper = mount(ItSteps, { props: { steps, current: 2 } })

    const current = wrapper.findAll('li[aria-current="step"]')
    expect(current).toHaveLength(1)
    expect(current[0]?.text()).toBe('Settings')
  })

  it('marks no step when the index is out of range', () => {
    const wrapper = mount(ItSteps, { props: { steps, current: 99 } })

    expect(wrapper.findAll('li[aria-current="step"]')).toHaveLength(0)
  })

  it('switches to the vertical layout on request', () => {
    const wrapper = mount(ItSteps, { props: { steps, current: 0, vertical: true } })

    expect(wrapper.classes()).toContain('it-steps-vertical')
  })
})
