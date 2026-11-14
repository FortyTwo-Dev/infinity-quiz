<script setup lang="ts">
// Candidate for upstream. Native <dialog>: modality, Escape and focus
// containment come from the platform.
import { onMounted, ref, watch } from 'vue'

interface Props {
  open?: boolean
  position?: 'top' | 'middle' | 'bottom'
  /** Id of the element naming the dialog. */
  labelledBy?: string
  /** Escape does not dismiss the dialog; only a command closes it. */
  persistent?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  position: 'middle',
  persistent: false,
})

const emit = defineEmits<{ close: [] }>()

const dialog = ref<HTMLDialogElement | null>(null)

/** `showModal` throws when the dialog is already open, so the state is read. */
function syncOpen(open: boolean) {
  const element = dialog.value
  if (!element) return
  if (open && !element.open) element.showModal()
  else if (!open && element.open) element.close()
}

onMounted(() => syncOpen(props.open))
watch(() => props.open, syncOpen)

/** `cancel` fires on Escape; a persistent dialog keeps its modality. */
function handleCancel(event: Event) {
  if (props.persistent) event.preventDefault()
}
</script>

<template>
  <dialog
    ref="dialog"
    class="it-dialog"
    :class="`it-dialog-${props.position}`"
    :aria-labelledby="props.labelledBy"
    @cancel="handleCancel"
    @close="emit('close')"
  >
    <div class="it-dialog-box">
      <slot />
    </div>
  </dialog>
</template>
