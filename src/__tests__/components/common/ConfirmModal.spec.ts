import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ConfirmModal from '../../../components/common/modal/ConfirmModal.vue'
import { installDialogSupport } from '../../support/dialog'

installDialogSupport()

function mountModal(props: Record<string, unknown> = {}) {
  return mount(ConfirmModal, {
    props: { modelValue: true, title: 'Delete quiz', message: 'Really?', ...props },
  })
}

describe('ConfirmModal', () => {
  it('shows its title and message in an open dialog', () => {
    const wrapper = mountModal()
    const dialog = wrapper.get('dialog').element as HTMLDialogElement

    expect(dialog.open).toBe(true)
    expect(wrapper.text()).toContain('Delete quiz')
    expect(wrapper.text()).toContain('Really?')
  })

  it('emits confirm and closes when the confirm button is pressed', async () => {
    const wrapper = mountModal({ confirmText: 'Delete' })

    const confirm = wrapper.findAll('button').find((button) => button.text() === 'Delete')
    await confirm?.trigger('click')

    expect(wrapper.emitted('confirm')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
  })

  it('emits cancel and closes when the cancel button is pressed', async () => {
    const wrapper = mountModal({ cancelText: 'Cancel' })

    const cancel = wrapper.findAll('button').find((button) => button.text() === 'Cancel')
    await cancel?.trigger('click')

    expect(wrapper.emitted('cancel')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
  })

  it('ignores cancel while persistent', async () => {
    const wrapper = mountModal({ cancelText: 'Cancel', persistent: true })

    const cancel = wrapper.findAll('button').find((button) => button.text() === 'Cancel')
    await cancel?.trigger('click')

    expect(wrapper.emitted('cancel')).toBeUndefined()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(cancel?.attributes('disabled')).toBeDefined()
  })

  it('emits cancel when the platform closes the dialog', async () => {
    const wrapper = mountModal()
    const dialog = wrapper.get('dialog').element as HTMLDialogElement

    dialog.close()
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(wrapper.emitted('cancel')).toHaveLength(1)
  })

  it('falls back to the item name sentence when no message is given', () => {
    const wrapper = mountModal({ message: undefined, itemName: 'Capitals' })

    expect(wrapper.text()).toContain('Are you sure you want to delete "Capitals"?')
    expect(wrapper.text()).toContain('This action cannot be undone.')
  })
})
