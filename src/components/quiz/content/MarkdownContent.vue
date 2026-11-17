<script setup lang="ts">
import { computed } from 'vue'
import { renderMarkdown } from '@/utils/markdown'

interface Props {
  /** Markdown source. Empty or whitespace renders nothing. */
  source: string
}

const props = defineProps<Props>()

const html = computed(() => renderMarkdown(props.source))
</script>

<template>
  <!-- Sanitized by `renderMarkdown`: the only `v-html` in the application. -->
  <div class="quiz-prose" v-html="html" />
</template>
