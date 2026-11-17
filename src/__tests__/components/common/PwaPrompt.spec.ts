import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import PwaPrompt from '../../../components/common/pwa/PwaPrompt.vue'
import { accessibleName, buttonNamed } from '../../support/accessibility'
import {
  needRefresh,
  offlineReady,
  resetPwaRegistration,
  updateServiceWorker,
} from '../../support/pwa-register'

function mountPrompt() {
  return mount(PwaPrompt)
}

function banner(wrapper: ReturnType<typeof mountPrompt>) {
  const output = wrapper.find('output')
  if (!output.exists()) throw new Error('No status banner rendered')
  return output
}

function buttonNames(wrapper: ReturnType<typeof mountPrompt>): string[] {
  return wrapper.findAll('button').map((button) => accessibleName(button.element))
}

describe('PwaPrompt', () => {
  beforeEach(() => {
    resetPwaRegistration()
  })

  it('renders no banner while no status is pending', () => {
    const wrapper = mountPrompt()

    expect(wrapper.find('output').exists()).toBe(false)
  })

  it('announces that the application is ready to work offline', () => {
    offlineReady.value = true

    const wrapper = mountPrompt()
    const status = banner(wrapper)
    const names = buttonNames(wrapper)

    expect(wrapper.findAll('output')).toHaveLength(1)
    expect(status.attributes('aria-live')).toBe('polite')
    expect(accessibleName(status.element)).toBe('Application status')
    expect(status.text()).toContain('Ready to work offline.')
    expect(names).toContain('Close')
    expect(names).not.toContain('Reload')
  })

  it('announces a new version with a reload and a close control', () => {
    needRefresh.value = true

    const wrapper = mountPrompt()
    const status = banner(wrapper)
    const names = buttonNames(wrapper)

    expect(wrapper.findAll('output')).toHaveLength(1)
    expect(status.attributes('aria-live')).toBe('polite')
    expect(status.text()).toContain('A new version is available.')
    expect(names).toHaveLength(2)
    expect(names).toEqual(expect.arrayContaining(['Reload', 'Close']))
  })

  it('announces the new version when both statuses are pending', () => {
    offlineReady.value = true
    needRefresh.value = true

    const wrapper = mountPrompt()
    const status = banner(wrapper)
    const names = buttonNames(wrapper)

    expect(status.text()).toContain('A new version is available.')
    expect(status.text()).not.toContain('Ready to work offline.')
    expect(names).toEqual(expect.arrayContaining(['Reload', 'Close']))
  })

  it('shows the banner once the status changes after mount', async () => {
    const wrapper = mountPrompt()
    expect(wrapper.find('output').exists()).toBe(false)

    needRefresh.value = true
    await nextTick()

    expect(wrapper.findAll('output')).toHaveLength(1)
  })

  it('asks the service worker to update once when reload is clicked', async () => {
    needRefresh.value = true
    const wrapper = mountPrompt()

    await buttonNamed(wrapper, 'Reload').trigger('click')

    expect(updateServiceWorker).toHaveBeenCalledTimes(1)
  })

  it('closes the banner and clears the pending status when close is clicked', async () => {
    offlineReady.value = true
    const wrapper = mountPrompt()

    await buttonNamed(wrapper, 'Close').trigger('click')

    expect(wrapper.find('output').exists()).toBe(false)
    expect(offlineReady.value).toBe(false)
    expect(needRefresh.value).toBe(false)
  })

  it('clears both pending statuses without updating when close is clicked', async () => {
    offlineReady.value = true
    needRefresh.value = true
    const wrapper = mountPrompt()

    await buttonNamed(wrapper, 'Close').trigger('click')

    expect(wrapper.find('output').exists()).toBe(false)
    expect(offlineReady.value).toBe(false)
    expect(needRefresh.value).toBe(false)
    expect(updateServiceWorker).not.toHaveBeenCalled()
  })

  it('marks the banner as a polite live region', () => {
    needRefresh.value = true

    const wrapper = mountPrompt()

    expect(banner(wrapper).attributes('aria-live')).toBe('polite')
  })
})
