<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { PhList } from '@phosphor-icons/vue'
import AppSidebar from './AppSidebar.vue'
import ThemeToggle from '@/components/common/theme/ThemeToggle.vue'
import NotificationToast from '@/components/common/notification/NotificationToast.vue'

const route = useRoute()

const routeLabels: Record<string, string> = {
  'quiz-list': 'Home',
  quiz: 'Quiz',
  results: 'Results',
  statistics: 'Statistics',
  'quiz-management': 'Management',
  'quiz-create': 'Create',
  'quiz-edit': 'Edit',
  'quiz-import-export': 'Import / Export',
  settings: 'Settings',
}

const currentPageLabel = computed(() => routeLabels[route.name as string] || 'IQuiz')

const isQuizRoute = computed(() => route.name === 'quiz')

/** The drawer only exists below the desktop breakpoint; above it, the same
 * state means "expanded" or "collapsed". */
const isDesktop = ref(true)
const isSidebarOpen = ref(true)
const toggleButton = ref<HTMLButtonElement | null>(null)

let desktopQuery: MediaQueryList | null = null

function syncWithViewport(event: MediaQueryListEvent | MediaQueryList) {
  isDesktop.value = event.matches
  isSidebarOpen.value = event.matches
}

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value
}

function closeSidebarOnMobile() {
  if (isDesktop.value) return
  isSidebarOpen.value = false
  toggleButton.value?.focus()
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && !isDesktop.value && isSidebarOpen.value) closeSidebarOnMobile()
}

onMounted(() => {
  desktopQuery = window.matchMedia('(min-width: 64rem)')
  syncWithViewport(desktopQuery)
  desktopQuery.addEventListener('change', syncWithViewport)
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  desktopQuery?.removeEventListener('change', syncWithViewport)
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div
    class="app-shell"
    :class="{ 'app-shell-fullscreen': isQuizRoute }"
    :data-sidebar="isSidebarOpen ? 'open' : 'closed'"
  >
    <a class="app-skip-link" href="#main-content">Skip to content</a>

    <button
      v-if="!isQuizRoute && !isDesktop && isSidebarOpen"
      type="button"
      class="app-sidebar-backdrop"
      aria-label="Close navigation"
      @click="closeSidebarOnMobile"
    />

    <aside
      v-if="!isQuizRoute"
      id="app-sidebar"
      class="app-sidebar"
      :data-collapsed="isSidebarOpen ? 'false' : 'true'"
      aria-label="Main navigation"
    >
      <AppSidebar />
    </aside>

    <div class="app-main">
      <header v-if="!isQuizRoute" class="app-topbar">
        <button
          ref="toggleButton"
          type="button"
          class="app-icon-button"
          aria-controls="app-sidebar"
          :aria-expanded="isSidebarOpen"
          :aria-label="isSidebarOpen ? 'Collapse navigation' : 'Expand navigation'"
          @click="toggleSidebar"
        >
          <PhList :size="20" weight="bold" />
        </button>
        <h1 class="app-topbar-title">{{ currentPageLabel }}</h1>
        <div class="app-topbar-end">
          <ThemeToggle />
        </div>
      </header>

      <NotificationToast />

      <main id="main-content" class="app-content">
        <router-view />
      </main>
    </div>
  </div>
</template>
