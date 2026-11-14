import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import ItDialog from '../../../components/itheme/ItDialog.vue'
import { installDialogSupport } from '../../support/dialog'

installDialogSupport()

async function settle() {
  await nextTick()
  await new Promise((resolve) => setTimeout(resolve, 0))
}

describe('ItDialog', () => {
  it('opens and closes the native dialog with the open prop', async () => {
    const wrapper = mount(ItDialog, { props: { open: false } })
    const dialog = wrapper.get('dialog').element as HTMLDialogElement

    expect(dialog.open).toBe(false)

    await wrapper.setProps({ open: true })
    expect(dialog.open).toBe(true)

    await wrapper.setProps({ open: false })
    expect(dialog.open).toBe(false)
  })

  it('opens exactly once when mounted open', async () => {
    const showModal = vi.spyOn(HTMLDialogElement.prototype, 'showModal')

    const wrapper = mount(ItDialog, { props: { open: true } })
    expect(showModal).toHaveBeenCalledTimes(1)

    await wrapper.setProps({ open: true })
    expect(showModal).toHaveBeenCalledTimes(1)

    showModal.mockRestore()
  })

  it('emits close when the platform closes it', async () => {
    const wrapper = mount(ItDialog, { props: { open: true } })
    const dialog = wrapper.get('dialog').element as HTMLDialogElement

    dialog.close()
    await settle()

    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('names the dialog through aria-labelledby', () => {
    const wrapper = mount(ItDialog, { props: { labelledBy: 'quiz-info-title' } })

    expect(wrapper.get('dialog').attributes('aria-labelledby')).toBe('quiz-info-title')
  })

  it('wraps its content in the dialog box', () => {
    const wrapper = mount(ItDialog, { props: { open: true }, slots: { default: 'Content' } })

    expect(wrapper.get('.it-dialog-box').text()).toBe('Content')
  })
})
