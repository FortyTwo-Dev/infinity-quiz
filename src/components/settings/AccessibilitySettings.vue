<script setup lang="ts">
import { ItCheckbox } from '@infinitylib/infinity-theme-vue'
import SettingsSection from './SettingsSection.vue'
import { useAccessibilityStore } from '@/stores'

const accessibilityStore = useAccessibilityStore()
</script>

<template>
  <SettingsSection
    title="Accessibility"
    description="Choose how the application reads. The preference is kept on this device."
  >
    <div class="settings-control">
      <ItCheckbox
        id="dyslexic-font"
        label="Use OpenDyslexic font"
        :model-value="accessibilityStore.isDyslexicFontEnabled"
        @update:model-value="accessibilityStore.setDyslexicFontEnabled"
      />
      <p class="settings-hint">
        OpenDyslexic is a typeface designed to make reading easier for people with dyslexia.
      </p>
    </div>
  </SettingsSection>
</template>
