<script setup lang="ts">
import { ItDialog } from '@/components/itheme'
import { ItButton } from '@infinitylib/infinity-theme-vue'
import { CREDITS } from '@/constants/credits'

interface Props {
  open: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{ close: [] }>()
</script>

<template>
  <ItDialog :open="props.open" labelled-by="credits-dialog-title" @close="emit('close')">
    <h2 id="credits-dialog-title" class="it-h2">Credits</h2>

    <p class="credits-intro">
      Infinity Quiz is built with these projects and typefaces. Every link opens in a new tab.
    </p>

    <ul class="credits-list">
      <li v-for="credit in CREDITS" :key="credit.name" class="credits-entry">
        <a
          :href="credit.href"
          target="_blank"
          rel="noopener noreferrer"
          class="credits-name it-link-accent"
        >
          {{ credit.name }}
        </a>
        <span class="credits-meta">{{ credit.role }} · {{ credit.license }}</span>
      </li>
    </ul>

    <div class="it-dialog-actions">
      <ItButton type="button" variant="secondary" @click="emit('close')">Close</ItButton>
    </div>
  </ItDialog>
</template>
