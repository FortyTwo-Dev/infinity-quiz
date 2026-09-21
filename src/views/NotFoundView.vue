<script setup lang="ts">
import { useRouter } from 'vue-router'
import { DButton } from '@/components/daisy-ui'
import { PhCompass } from '@phosphor-icons/vue'

const router = useRouter()

function goHome() {
  router.push({ name: 'quiz-list' })
}
</script>

<template>
  <div class="max-w-xl mx-auto p-4 text-center min-h-[60vh] flex flex-col items-center justify-center">
    <PhCompass :size="64" weight="duotone" class="text-primary mb-6" />
    <h1 class="text-4xl font-bold text-base-content mb-4">404</h1>
    <p class="text-lg text-base-content/70 mb-8">
      The page you are looking for does not exist.
    </p>
    <DButton variant="primary" size="md" @click="goHome">Back to quiz list</DButton>
  </div>
</template>
