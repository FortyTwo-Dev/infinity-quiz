<script setup lang="ts">
import { computed, ref } from 'vue'
import { PhSun, PhMoon } from '@phosphor-icons/vue'
import { ItButton } from '@infinitylib/infinity-theme-vue'
import { useThemeStore } from '@/stores'
import { THEME_ACCENTS, type ThemeAccent } from '@/constants/themes'

const themeStore = useThemeStore()

const menu = ref<HTMLDetailsElement | null>(null)

const mode = computed(() => themeStore.globalTheme.mode)
const accent = computed(() => themeStore.globalTheme.accent)

function applyAccent(next: ThemeAccent) {
  themeStore.applyTheme({ mode: mode.value, accent: next })
  if (menu.value) menu.value.open = false
}

function toggleMode() {
  themeStore.applyTheme({ mode: mode.value === 'light' ? 'dark' : 'light', accent: accent.value })
}
</script>

<template>
  <div class="app-theme-controls">
    <details ref="menu" class="app-theme-menu">
      <summary class="app-theme-trigger">
        <span class="app-theme-swatch" aria-hidden="true" />
        {{ accent }}
      </summary>

      <div class="app-theme-panel">
        <p class="app-theme-heading">Accent</p>
        <button
          v-for="option in THEME_ACCENTS"
          :key="option"
          type="button"
          class="app-theme-option"
          :aria-pressed="accent === option"
          @click="applyAccent(option)"
        >
          {{ option }}
        </button>
      </div>
    </details>

    <ItButton
      variant="ghost"
      size="sm"
      :aria-label="mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'"
      @click="toggleMode"
    >
      <PhSun v-if="mode === 'light'" :size="20" weight="duotone" />
      <PhMoon v-else :size="20" weight="duotone" />
    </ItButton>
  </div>
</template>
