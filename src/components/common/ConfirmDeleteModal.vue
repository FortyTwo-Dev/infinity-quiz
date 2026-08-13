<script setup lang="ts">
import { ref, watch } from 'vue'
import Button from './Button.vue'

interface Props {
  modelValue: boolean
  title?: string
  message?: string
  itemName?: string
  confirmText?: string
  cancelText?: string
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isOpen = ref(props.modelValue)

// Sync with parent
watch(
  () => props.modelValue,
  (value) => {
    isOpen.value = value
  }
)

watch(isOpen, (value) => {
  emit('update:modelValue', value)
})

const handleCancel = () => {
  isOpen.value = false
  emit('cancel')
}

const handleConfirm = () => {
  isOpen.value = false
  emit('confirm')
}

const handleBackdropClick = (e: MouseEvent) => {
  if (e.target === e.currentTarget) {
    handleCancel()
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    handleCancel()
  }
  if (e.key === 'Enter') {
    handleConfirm()
  }
}
</script>

<template>
  <div
    v-if="isOpen"
    class="modal-backdrop"
    @click="handleBackdropClick"
    @keydown="handleKeydown"
    tabindex="0"
  >
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div class="modal-header">
        <h2 id="modal-title">{{ title || 'Confirmer la suppression' }}</h2>
      </div>

      <div class="modal-body">
        <p v-if="message">
          {{ message }}
        </p>
        <p v-else>
          Êtes-vous sûr de vouloir supprimer {{ itemName ? `"${itemName}"` : 'cet élément' }} ?
          <span v-if="!itemName">Cette action ne peut pas être annulée.</span>
        </p>
      </div>

      <div class="modal-footer">
        <Button type="button" variant="secondary" @click="handleCancel">
          {{ cancelText || 'Annuler' }}
        </Button>
        <Button type="button" variant="danger" @click="handleConfirm">
          {{ confirmText || 'Supprimer' }}
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: var(--space-md);
}

.modal {
  background: var(--color-bg);
  border-radius: var(--radius-md);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 400px;
  max-height: 90vh;
  overflow-y: auto;
  animation: modalSlideIn 0.2s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  padding: var(--space-lg);
  border-bottom: 1px solid var(--color-border);
}

.modal-header h2 {
  margin: 0;
  color: var(--color-text);
  font-size: 1.2rem;
}

.modal-body {
  padding: var(--space-lg);
}

.modal-body p {
  margin: 0;
  color: var(--color-text);
  line-height: 1.5;
}

.modal-body p span {
  display: block;
  margin-top: var(--space-sm);
  color: var(--color-text-secondary);
  font-size: 0.9rem;
}

.modal-footer {
  display: flex;
  gap: var(--space-md);
  justify-content: flex-end;
  padding: var(--space-lg);
  border-top: 1px solid var(--color-border);
}
</style>
