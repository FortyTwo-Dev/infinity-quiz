<script setup lang="ts">
// Candidate for upstream. Native <dialog>: modality, Escape and focus
// containment come from the platform.
import { onMounted, ref, watch } from 'vue'

interface Props {
  open?: boolean
  position?: 'top' | 'middle' | 'bottom'
  /** Id of the element naming the dialog. */
  labelledBy?: string
}

const props = withDefaults(defineProps<Props>(), { open: false, position: 'middle' })

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
</script>

<template>
  <dialog
    ref="dialog"
    class="it-dialog"
    :class="`it-dialog-${props.position}`"
    :aria-labelledby="props.labelledBy"
    @close="emit('close')"
  >
    <div class="it-dialog-box">
      <slot />
    </div>
  </dialog>
</template>
