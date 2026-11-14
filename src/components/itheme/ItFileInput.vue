<script setup lang="ts">
// Candidate for upstream. The package ships no file input.
interface Props {
  /** Accessible name: the picker has no visible label of its own. */
  label: string
  id?: string
  name?: string
  accept?: string
  multiple?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  multiple: false,
  disabled: false,
})

const emit = defineEmits<{ change: [files: File[]] }>()

function onChange(event: Event) {
  const input = event.target as HTMLInputElement
  emit('change', input.files ? Array.from(input.files) : [])
}
</script>

<template>
  <input
    class="it-file-input"
    type="file"
    :id="props.id"
    :name="props.name"
    :accept="props.accept"
    :multiple="props.multiple"
    :disabled="props.disabled"
    :aria-label="props.label"
    @change="onChange"
  />
</template>
