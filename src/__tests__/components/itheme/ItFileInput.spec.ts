import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ItFileInput from '../../../components/itheme/ItFileInput.vue'

describe('ItFileInput', () => {
  it('renders a file input named for assistive technology', () => {
    const wrapper = mount(ItFileInput, { props: { label: 'Import a quiz file' } })

    const input = wrapper.get('input')
    expect(input.attributes('type')).toBe('file')
    expect(input.attributes('aria-label')).toBe('Import a quiz file')
  })

  it('forwards accept and multiple', () => {
    const wrapper = mount(ItFileInput, {
      props: { label: 'Import', accept: '.json', multiple: true },
    })

    expect(wrapper.get('input').attributes('accept')).toBe('.json')
    expect(wrapper.get('input').attributes('multiple')).toBeDefined()
  })

  it('emits the selected files on change', async () => {
    const wrapper = mount(ItFileInput, { props: { label: 'Import' } })
    const input = wrapper.get('input').element as HTMLInputElement

    Object.defineProperty(input, 'files', {
      value: [new File(['{}'], 'quiz.json', { type: 'application/json' })],
      configurable: true,
    })
    await wrapper.get('input').trigger('change')

    const emitted = wrapper.emitted('change')
    expect(emitted).toHaveLength(1)
    const files = emitted?.[0]?.[0] as File[] | undefined
    expect(files?.[0]?.name).toBe('quiz.json')
  })

  it('emits an empty selection when the dialog is cancelled', async () => {
    const wrapper = mount(ItFileInput, { props: { label: 'Import' } })
    const input = wrapper.get('input').element as HTMLInputElement

    Object.defineProperty(input, 'files', { value: null, configurable: true })
    await wrapper.get('input').trigger('change')

    expect(wrapper.emitted('change')?.[0]?.[0]).toEqual([])
  })
})
