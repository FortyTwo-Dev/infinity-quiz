import { accessibleName } from '../../support/accessibility'
import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import NotificationToast from '../../../components/common/notification/NotificationToast.vue'
import { useNotificationStore } from '@/stores'
import { setupTestPinia } from '../../stores/setup'

function mountToast() {
  return mount(NotificationToast, { global: { stubs: { teleport: true } } })
}

function alerts(wrapper: ReturnType<typeof mountToast>) {
  return wrapper.findAllComponents({ name: 'ItAlert' })
}

function closeControls(wrapper: ReturnType<typeof mountToast>) {
  return wrapper
    .findAll('button, [role="button"]')
    .filter((control) => accessibleName(control.element) === 'Close notification')
}

describe('NotificationToast', () => {
  beforeEach(() => {
    setupTestPinia()
  })

  it('renders no alert without a notification', () => {
    const wrapper = mountToast()

    expect(alerts(wrapper)).toHaveLength(0)
  })

  it('renders the message of a notification', () => {
    useNotificationStore().addNotification('Saved', 'success', 0)

    const wrapper = mountToast()

    expect(alerts(wrapper)).toHaveLength(1)
    expect(wrapper.text()).toContain('Saved')
  })

  it.each([
    { variant: 'info', expected: 'info' },
    { variant: 'success', expected: 'success' },
    { variant: 'warning', expected: 'warning' },
    { variant: 'error', expected: 'danger' },
  ] as const)('renders the $variant variant as $expected on the alert', ({ variant, expected }) => {
    useNotificationStore().addNotification(`A ${variant} message`, variant, 0)

    const wrapper = mountToast()

    expect(alerts(wrapper)).toHaveLength(1)
    expect(alerts(wrapper)[0]?.props('variant')).toBe(expected)
  })

  it('renders one alert per notification, in store order', () => {
    const store = useNotificationStore()
    store.addNotification('First', 'info', 0)
    store.addNotification('Second', 'success', 0)
    store.addNotification('Third', 'error', 0)

    const wrapper = mountToast()

    expect(alerts(wrapper).map((alert) => alert.text())).toEqual([
      expect.stringContaining('First'),
      expect.stringContaining('Second'),
      expect.stringContaining('Third'),
    ])
  })

  it('removes only its own notification when closed', async () => {
    const store = useNotificationStore()
    store.addNotification('First', 'info', 0)
    store.addNotification('Second', 'success', 0)
    const wrapper = mountToast()

    const controls = closeControls(wrapper)
    expect(controls).toHaveLength(2)

    await controls[0]?.trigger('click')

    expect(store.notifications.map((notification) => notification.message)).toEqual(['Second'])
  })

  it('clears the store when unmounted', async () => {
    const store = useNotificationStore()
    store.addNotification('First', 'info', 0)
    store.addNotification('Second', 'success', 0)
    const wrapper = mountToast()
    await nextTick()

    wrapper.unmount()

    expect(store.notifications).toEqual([])
  })
})
