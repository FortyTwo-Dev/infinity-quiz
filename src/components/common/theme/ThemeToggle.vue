<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue'
import { PhSun, PhMoon } from '@phosphor-icons/vue'
import { DButton } from '@/components/daisy-ui'

// Thèmes disponibles (sans suffixe -light/-dark)
const themes = ['blue', 'yellow', 'red'] as const
type Theme = (typeof themes)[number]
type Variant = 'light' | 'dark'

const currentTheme = ref<Theme>('blue')
const currentVariant = ref<Variant>('light')

// Nom complet du thème
const fullThemeName = computed(() => `infinity-${currentTheme.value}-${currentVariant.value}`)

// Appliquer le thème
function applyTheme() {
  document.documentElement.dataset.theme = fullThemeName.value
  localStorage.setItem('theme', fullThemeName.value)
}

// Charger au montage
onMounted(() => {
  const saved = localStorage.getItem('theme')
  if (saved && saved.startsWith('infinity-')) {
    const parts = saved.replace('infinity-', '').split('-')
    if (parts.length === 2) {
      const [theme, variant] = parts
      if (themes.includes(theme as Theme) && (variant === 'light' || variant === 'dark')) {
        currentTheme.value = theme as Theme
        currentVariant.value = variant as Variant
      }
    }
  }
  applyTheme()
})

// Réappliquer quand ça change
watch([currentTheme, currentVariant], applyTheme)

// Toggle light/dark
function toggleVariant() {
  currentVariant.value = currentVariant.value === 'light' ? 'dark' : 'light'
}
</script>

<template>
  <div class="flex items-center gap-3">
    <!-- Dropdown pour choisir le thème de base -->
    <div class="dropdown">
      <button type="button" tabindex="0" class="btn btn-sm">
        {{ currentTheme }}
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
      <ul tabindex="-1" class="dropdown-content z-1 p-2 shadow-2xl bg-base-300 rounded-box w-40">
        <li v-for="theme in themes" :key="theme">
          <button
            type="button"
            class="btn btn-sm btn-block justify-start"
            :class="currentTheme === theme ? 'btn-primary' : 'btn-ghost'"
            @click="currentTheme = theme"
          >
            {{ theme }}
          </button>
        </li>
      </ul>
    </div>

    <!-- Toggle Light/Dark -->
    <DButton
      variant="ghost"
      size="sm"
      @click="toggleVariant"
      :title="currentVariant === 'light' ? 'Dark mode' : 'Light mode'"
    >
      <PhSun v-if="currentVariant === 'light'" :size="24" weight="duotone" />
      <PhMoon v-else :size="24" weight="duotone" />
    </DButton>
  </div>
</template>
