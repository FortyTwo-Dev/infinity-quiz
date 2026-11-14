<script setup lang="ts">
import { ItDialog } from '@/components/itheme'
import { ItButton } from '@infinitylib/infinity-theme-vue'

interface Props {
  modelValue: boolean
  title?: string
  message?: string
  itemName?: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'primary' | 'secondary' | 'ghost'
  persistent?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Confirm deletion',
  confirmText: 'Delete',
  cancelText: 'Cancel',
  variant: 'danger',
  persistent: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
  cancel: []
}>()

function close() {
  emit('update:modelValue', false)
}

function handleCancel() {
  if (props.persistent) return
  close()
  emit('cancel')
}

function handleConfirm() {
  close()
  emit('confirm')
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') handleConfirm()
}
</script>

<template>
  <ItDialog
    :open="props.modelValue"
    :persistent="props.persistent"
    labelled-by="confirm-dialog-title"
    @close="handleCancel"
    @keydown="handleKeydown"
  >
    <h2 v-if="props.title" id="confirm-dialog-title" class="it-h3">{{ props.title }}</h2>

    <p v-if="props.message">{{ props.message }}</p>

    <p v-else-if="props.itemName">
      Are you sure you want to delete "<strong>{{ props.itemName }}</strong
      >"?
      <span class="it-small it-muted">This action cannot be undone.</span>
    </p>

    <p v-else>
      Are you sure you want to delete this item?
      <span class="it-small it-muted">This action cannot be undone.</span>
    </p>

    <div class="it-dialog-actions">
      <ItButton variant="ghost" :disabled="props.persistent" @click="handleCancel">
        {{ props.cancelText }}
      </ItButton>
      <ItButton :variant="props.variant" @click="handleConfirm">
        {{ props.confirmText }}
      </ItButton>
    </div>
  </ItDialog>
</template>
