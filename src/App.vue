<script setup lang="ts">
import { onMounted } from 'vue'
import { useQuizStore } from './stores'

const quizStore = useQuizStore()

onMounted(() => {
  quizStore.initializeSampleQuizzes()
})
</script>

<template>
  <div class="app-container">
    <router-view />
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  padding: 20px;
  background-color: #fafafa;
}
</style>
