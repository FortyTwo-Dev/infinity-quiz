import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useNotificationStore } from '../../stores/notification-store'
import { setupTestPinia } from './setup'

describe('useNotificationStore', () => {
  beforeEach(() => {
    setupTestPinia()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('state', () => {
    it('should initialize with no notifications', () => {
      const store = useNotificationStore()
      expect(store.notifications).toEqual([])
    })
  })

  describe('addNotification', () => {
    it('should add a notification with default variant and duration', () => {
      const store = useNotificationStore()
      store.addNotification('Hello')

      expect(store.notifications).toHaveLength(1)
      expect(store.notifications[0]?.message).toBe('Hello')
      expect(store.notifications[0]?.variant).toBe('info')
      expect(store.notifications[0]?.duration).toBe(3000)
    })

    it('should add a notification with a custom variant', () => {
      const store = useNotificationStore()
      store.addNotification('Saved', 'success')

      expect(store.notifications[0]?.variant).toBe('success')
    })

    it('should return a unique id per notification', () => {
      const store = useNotificationStore()
      const id1 = store.addNotification('One')
      const id2 = store.addNotification('Two')

      expect(id1).not.toBe(id2)
      expect(store.notifications).toHaveLength(2)
    })

    it('should auto-remove the notification after its duration', () => {
      const store = useNotificationStore()
      store.addNotification('Temporary', 'info', 1000)

      vi.advanceTimersByTime(999)
      expect(store.notifications).toHaveLength(1)

      vi.advanceTimersByTime(1)
      expect(store.notifications).toHaveLength(0)
    })

    it('should not schedule removal when duration is 0', () => {
      const store = useNotificationStore()
      store.addNotification('Persistent', 'info', 0)

      vi.advanceTimersByTime(10_000)
      expect(store.notifications).toHaveLength(1)
    })
  })

  describe('removeNotification', () => {
    it('should remove only the targeted notification', () => {
      const store = useNotificationStore()
      const id1 = store.addNotification('One', 'info', 0)
      store.addNotification('Two', 'info', 0)

      store.removeNotification(id1)

      expect(store.notifications).toHaveLength(1)
      expect(store.notifications[0]?.message).toBe('Two')
    })

    it('should do nothing for an unknown id', () => {
      const store = useNotificationStore()
      store.addNotification('One', 'info', 0)

      store.removeNotification('unknown')

      expect(store.notifications).toHaveLength(1)
    })
  })

  describe('clearAll', () => {
    it('should remove every notification', () => {
      const store = useNotificationStore()
      store.addNotification('One', 'info', 0)
      store.addNotification('Two', 'info', 0)

      store.clearAll()

      expect(store.notifications).toEqual([])
    })
  })
})
