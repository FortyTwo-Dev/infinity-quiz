<script setup lang="ts">
import { useThemeStore } from '@/stores/theme-store'
import { PhSun, PhMoon } from '@phosphor-icons/vue'
import Button from './Button.vue'

const themeStore = useThemeStore()
</script>

<template>
  <div class="theme-toggle">
    <Button
      variant="text"
      size="small"
      :class="{
        'theme-button--active': themeStore.currentThemeName === 'light',
      }"
      @click="themeStore.setTheme('light')"
    >
      <PhSun :size="24" weight="duotone" />
    </Button>
    <Button
      variant="text"
      size="small"
      :class="{
        'theme-button--active': themeStore.currentThemeName === 'dark',
      }"
      @click="themeStore.setTheme('dark')"
    >
      <PhMoon :size="24" weight="duotone" />
    </Button>
  </div>
</template>

<style scoped>
.theme-toggle {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.theme-button--active {
  color: var(--color-primary) !important;
}
</style>
