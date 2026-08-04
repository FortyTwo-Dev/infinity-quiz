<script setup lang="ts">
import { onMounted } from 'vue'
import { useQuizStore } from './stores'
import { useThemeStore } from './stores/theme-store'
import ThemeToggle from './components/common/ThemeToggle.vue'

const quizStore = useQuizStore()
const themeStore = useThemeStore()

onMounted(() => {
  quizStore.initializeSampleQuizzes()
  themeStore.initializeStyleElement()
})
</script>

<template>
  <div class="app-container">
    <div class="header">
      <h1 class="title">Infinity Quiz</h1>
      <ThemeToggle />
    </div>
    <router-view />
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  padding: var(--space-lg);
  background-color: var(--color-bg);
  transition: background-color var(--transition-normal);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-xl);
}

.title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
}
</style>
