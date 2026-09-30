<script setup lang="ts">
import { computed } from 'vue'
import { PhSun, PhMoon } from '@phosphor-icons/vue'
import { DButton } from '@/components/daisy-ui'
import { useThemeStore } from '@/stores'
import {
  THEME_COLORS,
  THEME_VARIANTS,
  buildThemeName,
  type ThemeColor,
  type ThemeVariant,
} from '@/constants/themes'

const themeStore = useThemeStore()

const activeThemeName = computed(() => themeStore.globalThemeName)

const currentColor = computed<ThemeColor | null>(() => {
  const name = activeThemeName.value
  for (const color of THEME_COLORS) {
    if (THEME_VARIANTS.some((variant) => buildThemeName(color, variant) === name)) {
      return color
    }
  }
  return null
})

const currentVariant = computed<ThemeVariant>(() => {
  const name = activeThemeName.value
  if (name.endsWith('-dark')) return 'dark'
  return 'light'
})

const isImportedActive = computed(() => currentColor.value === null)

function applyColor(color: ThemeColor) {
  themeStore.applyTheme(buildThemeName(color, currentVariant.value))
}

function applyImported(name: string) {
  themeStore.applyTheme(name)
}

function toggleVariant() {
  if (!currentColor.value) return
  const next: ThemeVariant = currentVariant.value === 'light' ? 'dark' : 'light'
  themeStore.applyTheme(buildThemeName(currentColor.value, next))
}
</script>

<template>
  <div class="flex items-center gap-4">
    <!-- Dropdown pour choisir le thème -->
    <div class="dropdown">
      <button type="button" tabindex="0" class="btn btn-sm">
        {{ activeThemeName }}
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
        <li class="menu-title text-xs"><span>Colors</span></li>
        <li v-for="color in THEME_COLORS" :key="`color-${color}`">
          <button
            type="button"
            class="btn btn-sm btn-block justify-start"
            :class="currentColor === color ? 'btn-primary' : 'btn-ghost'"
            @click="applyColor(color)"
          >
            {{ color }}
          </button>
        </li>

        <template v-if="themeStore.importedThemes.length > 0">
          <li class="menu-title text-xs mt-1"><span>Imported</span></li>
          <li v-for="theme in themeStore.importedThemes" :key="theme.name">
            <button
              type="button"
              class="btn btn-sm btn-block justify-start"
              :class="activeThemeName === theme.name ? 'btn-primary' : 'btn-ghost'"
              @click="applyImported(theme.name)"
            >
              {{ theme.name }}
            </button>
          </li>
        </template>
      </ul>
    </div>

    <!-- Toggle Light/Dark (uniquement pour les thèmes built-in) -->
    <DButton
      variant="ghost"
      size="sm"
      :disabled="isImportedActive"
      @click="toggleVariant"
      :title="currentVariant === 'light' ? 'Dark mode' : 'Light mode'"
    >
      <PhSun v-if="currentVariant === 'light'" :size="24" weight="duotone" />
      <PhMoon v-else :size="24" weight="duotone" />
    </DButton>
  </div>
</template>
