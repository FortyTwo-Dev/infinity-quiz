<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const handleGoBack = () => {
  router.push({ name: 'quiz-management' })
}
</script>

<template>
  <div class="max-w-4xl mx-auto p-4 min-h-[60vh] flex flex-col items-center justify-center">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-warning mb-4">Under Construction</h1>
      <p class="text-lg text-base-content/70 mb-8">
        Le formulaire de création/modification de quiz est en cours de refactorisation.
      </p>
      <button type="button" @click="handleGoBack" class="btn btn-primary">Retour à la gestion des quiz</button>
    </div>
  </div>
</template>
