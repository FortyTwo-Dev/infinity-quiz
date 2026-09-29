<script setup lang="ts">
import type { Position } from '../types'
import { ref } from 'vue'

interface Props {
  id?: string
  position?: Position
}

const props = withDefaults(defineProps<Props>(), {
  position: 'middle',
})

// The root node is a Teleport (renders nothing in place), so fallthrough
// listeners must be forwarded explicitly to the <dialog> or they are lost.
defineOptions({ inheritAttrs: false })

const positionClasses: Record<Position, string> = {
  top: 'modal-top',
  middle: 'modal-middle',
  bottom: 'modal-bottom',
}

const dialog = ref<HTMLDialogElement | null>(null)

function open() {
  dialog.value?.showModal()
}

function close() {
  dialog.value?.close()
}

defineExpose({
  open,
  close,
})
</script>

<template>
  <Teleport to="body">
    <dialog
      :id="props.id"
      ref="dialog"
      class="modal"
      :class="positionClasses[props.position]"
      v-bind="$attrs"
    >
      <slot />
    </dialog>
  </Teleport>
</template>
