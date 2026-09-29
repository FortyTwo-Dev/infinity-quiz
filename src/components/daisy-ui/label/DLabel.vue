<script setup lang="ts">
interface Props {
  for?: string
}

const props = defineProps<Props>()
</script>

<template>
  <label class="flex items-center gap-2 cursor-pointer" :for="props.for">
    <slot />
  </label>
</template>
