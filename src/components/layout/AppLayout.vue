<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { PhList, PhSidebar } from '@phosphor-icons/vue'
import AppSidebar from './AppSidebar.vue'
import ThemeToggle from '@/components/common/theme/ThemeToggle.vue'
import NotificationToast from '@/components/common/notification/NotificationToast.vue'

const route = useRoute()

const routeLabels: Record<string, string> = {
  'quiz-list': 'Home',
  quiz: 'Quiz',
  results: 'Results',
  'quiz-management': 'Management',
  'quiz-create': 'Create',
  'quiz-edit': 'Edit',
  'quiz-import-export': 'Import / Export',
  'test-ui': 'Test UI',
}

const currentPageLabel = computed(() => routeLabels[route.name as string] || 'IQuiz')
</script>

<template>
  <div class="drawer lg:drawer-open">
    <!-- Drawer toggle input -->
    <input id="app-drawer" type="checkbox" class="drawer-toggle inline" />

    <!-- Main content -->
    <div class="drawer-content min-h-screen bg-base-300">
      <!-- Navbar -->
      <nav class="navbar w-full bg-base-300 border-b border-base-200 sticky top-0 z-10">
        <div class="flex-none">
          <label
            for="app-drawer"
            aria-label="toggle sidebar"
            class="btn btn-square btn-ghost drawer-button lg:hidden"
          >
            <PhList class="size-5" weight="fill" />
          </label>
        </div>
        <div class="navbar w-full">
          <label
            for="app-drawer"
            aria-label="toggle sidebar"
            class="btn btn-square btn-ghost drawer-button hidden lg:flex mr-2"
          >
            <PhSidebar size="20" weight="fill" />
          </label>
          <h1 class="text-lg font-bold text-base-content">
            {{ currentPageLabel }}
          </h1>
        </div>
        <div class="flex-none">
          <ThemeToggle />
        </div>
      </nav>
      <NotificationToast />

      <!-- Page content -->
      <div class="p-4 min-h-[calc(100vh-4rem)] overflow-y-auto">
        <router-view />
      </div>
    </div>

    <!-- Sidebar -->
    <div class="drawer-side is-drawer-close:overflow-visible z-50">
      <label for="app-drawer" aria-label="close sidebar" class="drawer-overlay" />
      <div
        class="flex min-h-full flex-col bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64 transition-all duration-200 shadow-md"
      >
        <AppSidebar />
      </div>
    </div>
  </div>
</template>
