<script setup lang="ts">
import { useRouter } from 'vue-router'
import { PhCompass } from '@phosphor-icons/vue'
import { ItButton } from '@infinitylib/infinity-theme-vue'

const router = useRouter()
</script>

<template>
  <section class="not-found">
    <PhCompass class="not-found-icon" :size="64" weight="duotone" aria-hidden="true" />
    <h1 class="not-found-code">404</h1>
    <p class="not-found-text">The page you are looking for does not exist.</p>
    <ItButton variant="primary" @click="router.push({ name: 'quiz-list' })">
      Back to quiz list
    </ItButton>
  </section>
</template>
