<script setup lang="ts">
import { onUnmounted, type Component } from 'vue'
import { DToast } from '@/components/daisy-ui'
import { useNotificationStore, type NotificationVariant } from '@/stores/notification-store'
import { PhCheckCircle, PhInfo, PhWarningCircle, PhXCircle } from '@phosphor-icons/vue'

const notificationStore = useNotificationStore()

// Map notification variant to Daisy UI alert classes
const variantToAlertClass: Record<NotificationVariant, string> = {
  info: 'alert-info',
  success: 'alert-success',
  warning: 'alert-warning',
  error: 'alert-error',
}

// Map notification variant to icon component
const variantToIcon: Record<NotificationVariant, Component> = {
  info: PhInfo,
  success: PhCheckCircle,
  warning: PhWarningCircle,
  error: PhXCircle,
}

// Map notification variant to icon color class
const variantToIconColor: Record<NotificationVariant, string> = {
  info: 'text-info',
  success: 'text-success',
  warning: 'text-warning',
  error: 'text-error',
}

// Clear remaining notifications on unmount to avoid memory leaks
onUnmounted(() => {
  notificationStore.clearAll()
})
</script>

<template>
  <Teleport to="body">
    <DToast horizontal="end" vertical="top">
      <TransitionGroup
        tag="div"
        class="flex flex-col gap-2"
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 translate-x-full"
        leave-active-class="transition-all duration-300 ease-in absolute"
        leave-from-class="opacity-100 translate-x-0"
        leave-to-class="opacity-0 translate-x-full"
        move-class="transition-all duration-300 ease-out"
      >
        <div
          v-for="notification in notificationStore.notifications"
          :key="notification.id"
          class="alert w-80 shadow-lg"
          :class="variantToAlertClass[notification.variant]"
          role="alert"
        >
          <div class="shrink-0">
            <component
              :is="variantToIcon[notification.variant]"
              :size="20"
              :class="variantToIconColor[notification.variant]"
            />
          </div>
          <span>{{ notification.message }}</span>
          <div class="shrink-0 ml-2">
            <button
              type="button"
              @click.stop="notificationStore.removeNotification(notification.id)"
              class="btn btn-sm btn-ghost btn-circle"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>
      </TransitionGroup>
    </DToast>
  </Teleport>
</template>
