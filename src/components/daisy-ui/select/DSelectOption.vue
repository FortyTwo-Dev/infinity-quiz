<script setup lang="ts">
interface Props {
  value: string | number
  disabled?: boolean
  selected?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  selected: false,
})
</script>

<template>
  <option
    :value="props.value"
    :disabled="props.disabled"
    :selected="props.selected"
    v-bind="$attrs"
  >
    <slot>{{ props.value }}</slot>
  </option>
</template>
