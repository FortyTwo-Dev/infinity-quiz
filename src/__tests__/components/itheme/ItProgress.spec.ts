import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ItProgress from '../../../components/itheme/ItProgress.vue'

describe('ItProgress', () => {
  it('exposes the value and the maximum', () => {
    const wrapper = mount(ItProgress, { props: { value: 3, max: 4, label: 'Question 3 of 4' } })

    const progress = wrapper.get('progress')
    expect(progress.attributes('value')).toBe('3')
    expect(progress.attributes('max')).toBe('4')
    expect(progress.attributes('aria-label')).toBe('Question 3 of 4')
  })

  it('is indeterminate when no value is given', () => {
    const wrapper = mount(ItProgress, { props: { label: 'Loading' } })

    expect(wrapper.get('progress').attributes('value')).toBeUndefined()
  })

  it('applies the variant class, accent by default', () => {
    expect(mount(ItProgress, { props: { label: 'Score' } }).classes()).toContain(
      'it-progress-accent',
    )
    expect(mount(ItProgress, { props: { label: 'Score', variant: 'danger' } }).classes()).toContain(
      'it-progress-danger',
    )
  })
})
