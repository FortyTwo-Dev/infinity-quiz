import { defineStore } from 'pinia'
import { ref } from 'vue'

export type NotificationVariant = 'info' | 'success' | 'warning' | 'error'

export interface Notification {
  id: string
  message: string
  variant: NotificationVariant
  duration?: number
}

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<Notification[]>([])

  const addNotification = (
    message: string,
    variant: NotificationVariant = 'info',
    duration: number = 3000,
  ): string => {
    const id = crypto.randomUUID()
    notifications.value.push({ id, message, variant, duration })

    if (duration > 0) {
      setTimeout(() => removeNotification(id), duration)
    }

    return id
  }

  const removeNotification = (id: string) => {
    notifications.value = notifications.value.filter((n) => n.id !== id)
  }

  const clearAll = () => {
    notifications.value = []
  }

  return { notifications, addNotification, removeNotification, clearAll }
})
