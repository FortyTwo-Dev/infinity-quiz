<script setup lang="ts">
import { computed, nextTick, useTemplateRef, watch } from 'vue'
import { highlightCode } from '@/utils/highlight'
import { renderMarkdown } from '@/utils/markdown'

interface Props {
  /** Markdown source. Empty or whitespace renders nothing. */
  source: string
}

const props = defineProps<Props>()

// The HTML is sanitized by `renderMarkdown`; the highlight pass only adds spans
// to code blocks, after the sanitization. This is the only `v-html` in the app.
const html = computed(() => renderMarkdown(props.source))
const root = useTemplateRef<HTMLElement>('root')

/**
 * The Markdown is sanitized and rendered synchronously; the code blocks are
 * coloured afterwards, once Shiki and the grammar have loaded. A failure leaves
 * the plain code in place.
 */
async function highlightBlocks(container: HTMLElement) {
  const blocks = Array.from(container.querySelectorAll<HTMLElement>('pre > code[data-lang]'))

  await Promise.all(
    blocks.map(async (block) => {
      if (block.dataset.highlighted === 'true') return

      const highlighted = await highlightCode(block.textContent ?? '', block.dataset.lang)
      if (highlighted === null) return

      block.innerHTML = highlighted
      block.dataset.highlighted = 'true'
    }),
  )
}

watch(
  [html, root],
  async () => {
    if (!root.value) return
    await nextTick()
    if (root.value) await highlightBlocks(root.value)
  },
  { flush: 'post', immediate: true },
)
</script>

<template>
  <div ref="root" class="quiz-prose" v-html="html" />
</template>
