<script setup lang="ts">
import { computed } from 'vue'
import { PhSun, PhMoon } from '@phosphor-icons/vue'
import { ItButton } from '@infinitylib/infinity-theme-vue'
import { useThemeStore } from '@/stores'
import { THEME_ACCENTS, type ThemeAccent } from '@/constants/themes'

const themeStore = useThemeStore()

const mode = computed(() => themeStore.globalTheme.mode)
const accent = computed(() => themeStore.globalTheme.accent)

function applyAccent(next: ThemeAccent) {
  themeStore.applyTheme({ mode: mode.value, accent: next })
}

function toggleMode() {
  themeStore.applyTheme({ mode: mode.value === 'light' ? 'dark' : 'light', accent: accent.value })
}
</script>

<template>
  <div class="flex items-center gap-4">
    <!-- Accent picker -->
    <div class="dropdown">
      <button type="button" tabindex="0" class="btn btn-sm">
        {{ accent }}
        <svg
          width="12"
          height="12"
          class="h-2 w-2 inline-block ml-1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 2048 2048"
        >
          <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z" />
        </svg>
      </button>
      <ul tabindex="-1" class="dropdown-content z-1 p-2 shadow-2xl bg-base-300 rounded-box w-48">
        <li class="menu-title text-xs"><span>Accents</span></li>
        <li v-for="option in THEME_ACCENTS" :key="`accent-${option}`">
          <button
            type="button"
            class="btn btn-sm btn-block justify-start"
            :class="accent === option ? 'btn-primary' : 'btn-ghost'"
            @click="applyAccent(option)"
          >
            {{ option }}
          </button>
        </li>
      </ul>
    </div>

    <!-- Light/dark switch -->
    <ItButton
      variant="ghost"
      size="sm"
      @click="toggleMode"
      :title="mode === 'light' ? 'Dark mode' : 'Light mode'"
    >
      <PhSun v-if="mode === 'light'" :size="24" weight="duotone" />
      <PhMoon v-else :size="24" weight="duotone" />
    </ItButton>
  </div>
</template>
