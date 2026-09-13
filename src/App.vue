<script setup lang="ts">
import { onMounted } from 'vue'
import { useQuizStore } from './stores'
import { AppLayout } from '@/components/layout'

const quizStore = useQuizStore()

onMounted(() => {
  quizStore.initializeSampleQuizzes()
})
</script>

<template>
  <AppLayout />
</template>
