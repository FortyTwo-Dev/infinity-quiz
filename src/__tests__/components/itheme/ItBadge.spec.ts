import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ItBadge from '../../../components/itheme/ItBadge.vue'

describe('ItBadge', () => {
  it('renders the requested variant and size as it- classes', () => {
    const wrapper = mount(ItBadge, {
      props: { variant: 'success', size: 'sm' },
      slots: { default: 'Passed' },
    })

    expect(wrapper.classes()).toContain('it-badge')
    expect(wrapper.classes()).toContain('it-badge-success')
    expect(wrapper.classes()).toContain('it-badge-sm')
    expect(wrapper.text()).toBe('Passed')
  })

  it('adds no remove button unless removable', () => {
    const wrapper = mount(ItBadge, { props: { variant: 'success' } })

    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('emits remove from a button that has an accessible name', async () => {
    const wrapper = mount(ItBadge, {
      props: { removable: true, removeLabel: 'Remove tag geography' },
    })

    const button = wrapper.get('button')
    expect(button.attributes('aria-label')).toBe('Remove tag geography')

    await button.trigger('click')

    expect(wrapper.emitted('remove')).toHaveLength(1)
  })

  it('keeps the remove button disabled when the badge is disabled', async () => {
    const wrapper = mount(ItBadge, { props: { removable: true, disabled: true } })

    await wrapper.get('button').trigger('click')

    expect(wrapper.get('button').attributes('disabled')).toBeDefined()
    expect(wrapper.emitted('remove')).toBeUndefined()
  })

  it('composes outline and soft modifiers without losing the variant', () => {
    const wrapper = mount(ItBadge, {
      props: { variant: 'warning', outline: true, soft: true },
    })

    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['it-badge-warning', 'it-badge-outline', 'it-badge-soft']),
    )
  })
})
