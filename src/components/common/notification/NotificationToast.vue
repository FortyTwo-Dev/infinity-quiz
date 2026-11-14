<script setup lang="ts">
import { onUnmounted, type Component } from 'vue'
import { ItAlert, ItToast } from '@/components/itheme'
import { useNotificationStore, type NotificationVariant } from '@/stores/notification-store'
import { PhCheckCircle, PhInfo, PhWarningCircle, PhXCircle } from '@phosphor-icons/vue'

const notificationStore = useNotificationStore()

const variantToAlert: Record<NotificationVariant, 'info' | 'success' | 'warning' | 'danger'> = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  error: 'danger',
}

const variantToIcon: Record<NotificationVariant, Component> = {
  info: PhInfo,
  success: PhCheckCircle,
  warning: PhWarningCircle,
  error: PhXCircle,
}

// Clear remaining notifications on unmount to avoid memory leaks
onUnmounted(() => {
  notificationStore.clearAll()
})
</script>

<template>
  <Teleport to="body">
    <ItToast horizontal="end" vertical="top">
      <TransitionGroup name="app-toast" tag="div" class="app-toast-stack">
        <ItAlert
          v-for="notification in notificationStore.notifications"
          :key="notification.id"
          class="app-toast"
          :variant="variantToAlert[notification.variant]"
          live
        >
          <component :is="variantToIcon[notification.variant]" :size="20" weight="fill" />
          <span class="it-alert-body">{{ notification.message }}</span>
          <button
            type="button"
            class="app-toast-close"
            aria-label="Close notification"
            @click.stop="notificationStore.removeNotification(notification.id)"
          >
            ×
          </button>
        </ItAlert>
      </TransitionGroup>
    </ItToast>
  </Teleport>
</template>
