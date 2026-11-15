<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { AccessibilitySettings, SettingsSection } from '@/components/settings'
</script>

<template>
  <section class="settings-view">
    <header class="quiz-page-header">
      <div>
        <h1 class="quiz-page-title">Settings</h1>
        <p class="quiz-page-subtitle">Accessibility, account and data management</p>
      </div>
    </header>

    <AccessibilitySettings />

    <SettingsSection
      title="Account"
      badge="Coming soon"
      description="Sign in to carry your profile across devices. Accounts need a server: until then, everything stays on this device."
    />

    <SettingsSection
      title="Sync"
      badge="Coming soon"
      description="Synchronize your quizzes and history across devices. Nothing leaves this device today."
    />

    <SettingsSection
      title="Export data"
      badge="Coming soon"
      description="Download a single backup of your quizzes, attempt history and preferences."
    >
      <p class="settings-note">
        Until it ships, the
        <RouterLink :to="{ name: 'quiz-import-export' }">Import / Export</RouterLink>
        screen moves your quizzes as JSON.
      </p>
    </SettingsSection>
  </section>
</template>
