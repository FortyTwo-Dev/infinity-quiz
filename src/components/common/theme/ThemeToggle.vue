<script setup lang="ts">
import { computed } from 'vue'
import { PhSun, PhMoon } from '@phosphor-icons/vue'
import { ItButton } from '@infinitylib/infinity-theme-vue'
import { useThemeStore } from '@/stores'

const themeStore = useThemeStore()

const mode = computed(() => themeStore.globalTheme.mode)

function toggleMode() {
  themeStore.applyTheme({ mode: mode.value === 'light' ? 'dark' : 'light', accent: themeStore.globalTheme.accent })
}
</script>

<template>
  <ItButton
    variant="ghost"
    size="sm"
    :aria-label="mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'"
    @click="toggleMode"
  >
    <PhSun v-if="mode === 'light'" :size="20" weight="duotone" />
    <PhMoon v-else :size="20" weight="duotone" />
  </ItButton>
</template>
