<script setup lang="ts">
import { ref, watch, onMounted, type ComponentRef } from 'vue'
import { DModal, DModalBox, DModalActions, DModalBackdrop } from '@/components/daisy-ui'
import { DButton } from '@/components/daisy-ui'
import type { ButtonVariant } from '@/components/daisy-ui/types'

interface Props {
  modelValue: boolean
  title?: string
  message?: string
  itemName?: string
  confirmText?: string
  cancelText?: string
  variant?: ButtonVariant
  persistent?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Confirmer la suppression',
  confirmText: 'Supprimer',
  cancelText: 'Annuler',
  variant: 'error',
  persistent: false,
})

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}

const emit = defineEmits<Emits>()

const dialog = ref<ComponentRef<typeof DModal> | null>(null)

function syncDialogState() {
  if (props.modelValue && dialog.value) {
    dialog.value.open()
  } else if (dialog.value) {
    dialog.value.close()
  }
}

// Sync with parent: when modelValue changes, update dialog
watch(
  () => props.modelValue,
  () => {
    syncDialogState()
  },
)

// When dialog closes from external (Escape key, backdrop click), emit cancel
function handleClose() {
  if (!props.persistent) {
    emit('update:modelValue', false)
    emit('cancel')
  }
}

function handleCancel() {
  if (!props.persistent) {
    dialog.value?.close()
    emit('update:modelValue', false)
    emit('cancel')
  }
}

function handleConfirm() {
  dialog.value?.close()
  emit('update:modelValue', false)
  emit('confirm')
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && !props.persistent) {
    handleCancel()
  }
  if (event.key === 'Enter') {
    handleConfirm()
  }
}

// Initialize dialog state on mount
onMounted(() => {
  syncDialogState()
})
</script>

<template>
  <DModal ref="dialog" @keydown="handleKeydown" @close="handleClose">
    <DModalBackdrop />
    <DModalBox>
      <h3 v-if="props.title" class="font-bold text-lg">
        {{ props.title }}
      </h3>

      <p v-if="props.message" class="py-4">
        {{ props.message }}
      </p>

      <p v-if="!props.message && props.itemName" class="py-4">
        Êtes-vous sûr de vouloir supprimer "<strong>{{ props.itemName }}</strong>
        " ?
        <span class="text-sm text-base-content/70">Cette action ne peut pas être annulée.</span>
      </p>

      <p v-if="!props.message && !props.itemName" class="py-4">
        Êtes-vous sûr de vouloir supprimer cet élément ?
        <span class="text-sm text-base-content/70">Cette action ne peut pas être annulée.</span>
      </p>

      <DModalActions>
        <DButton variant="ghost" @click="handleCancel" :disabled="props.persistent">
          {{ props.cancelText }}
        </DButton>
        <DButton :variant="props.variant" @click="handleConfirm">
          {{ props.confirmText }}
        </DButton>
      </DModalActions>
    </DModalBox>
  </DModal>
</template>
