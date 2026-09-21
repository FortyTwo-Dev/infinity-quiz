<script setup lang="ts">
interface Props {
  label?: string
  message?: string
  error?: boolean
  bordered?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  label: undefined,
  message: undefined,
  error: false,
  bordered: false,
})
</script>

<template>
  <fieldset
    class="fieldset"
    :class="{ 'bg-base-200 border-base-300 rounded-box border p-4': props.bordered }"
  >
    <legend v-if="props.label" class="fieldset-legend">{{ props.label }}</legend>
    <slot />
    <span v-if="props.message" class="label" :class="{ 'text-error': props.error }">
      {{ props.message }}
    </span>
  </fieldset>
</template>
