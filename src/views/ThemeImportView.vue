<script setup lang="ts">
import { ref } from 'vue'
import { useThemeStore, useNotificationStore } from '@/stores'
import { DButton, DInput, DTextarea } from '@/components/daisy-ui'
import { DCard, DCardBody, DCardTitle, DCardActions } from '@/components/daisy-ui/card'
import { ConfirmModal } from '@/components/common'
import { LContainer, LFlex } from '@/components/layout'
import { parseThemeBlock } from '@/utils/theme-import'
import { PhUpload, PhTrash, PhArrowSquareOut } from '@phosphor-icons/vue'

const THEME_GENERATOR_URL = 'https://daisyui.com/theme-generator/'

const themeStore = useThemeStore()
const notificationStore = useNotificationStore()

const cssDraft = ref('')
const nameDraft = ref('')

const showDeleteModal = ref(false)
const themeToDelete = ref<string | null>(null)

function onCssInput() {
  try {
    const parsed = parseThemeBlock(cssDraft.value)
    if (!nameDraft.value || nameDraft.value === parsed.name) {
      nameDraft.value = parsed.name
    }
  } catch {
    return
  }
}

function handleImport() {
  try {
    themeStore.importTheme(cssDraft.value, nameDraft.value)
    notificationStore.addNotification(`Theme "${nameDraft.value}" imported`, 'success', 3000)
    cssDraft.value = ''
    nameDraft.value = ''
  } catch (err) {
    notificationStore.addNotification((err as Error).message, 'error', 4000)
  }
}

function requestDelete(name: string) {
  themeToDelete.value = name
  showDeleteModal.value = true
}

function confirmDelete() {
  if (themeToDelete.value) {
    themeStore.removeTheme(themeToDelete.value)
    notificationStore.addNotification(`Theme "${themeToDelete.value}" deleted`, 'success', 3000)
    themeToDelete.value = null
  }
  showDeleteModal.value = false
}
</script>

<template>
  <LContainer as="section" size="7xl" padding="md" centered>
    <LFlex as="header" align="center" justify="between" class="mb-6">
      <div>
        <h1 class="text-base-content text-2xl font-bold">Themes</h1>
        <p class="text-base-content/70">Import a daisyUI theme and apply it globally</p>
      </div>
      <a
        :href="THEME_GENERATOR_URL"
        target="_blank"
        rel="noopener"
        class="btn btn-sm btn-accent inline-flex items-center gap-2"
      >
        <PhArrowSquareOut :size="18" />
        Theme Generator
      </a>
    </LFlex>

    <DCard border class="bg-base-100 w-full mb-6">
      <DCardBody padding="lg" class="gap-4">
        <DCardTitle tag="h2" size="lg">Import a theme</DCardTitle>
        <p class="text-base-content/70 text-sm">
          Open the
          <a
            :href="THEME_GENERATOR_URL"
            target="_blank"
            rel="noopener"
            class="link link-primary"
            >daisyUI Theme Generator</a
          >, copy the whole <code class="text-xs">@plugin "daisyui/theme" { ... }</code> block, and
          paste it below.
        </p>

        <div class="flex flex-col gap-2">
          <label class="label justify-start gap-2 py-0">
            <span class="label-text">Name</span>
          </label>
          <DInput v-model="nameDraft" placeholder="my-theme" class="w-full" />
        </div>

        <DTextarea
          v-model="cssDraft"
          :rows="10"
          placeholder='@plugin "daisyui/theme" { name: "my-theme"; ... }'
          class="font-mono text-sm resize-y w-full"
          @update:model-value="onCssInput"
        />

        <DCardActions justify="end">
          <DButton type="button" variant="primary" size="md" @click="handleImport">
            <PhUpload :size="18" />
            Import
          </DButton>
        </DCardActions>
      </DCardBody>
    </DCard>

    <DCard border class="bg-base-100 w-full">
      <DCardBody padding="lg" class="gap-4">
        <DCardTitle tag="h2" size="lg">Imported themes</DCardTitle>

        <p v-if="themeStore.importedThemes.length === 0" class="text-base-content/70">
          No imported themes yet.
        </p>

        <div v-else class="flex flex-col gap-2">
          <div
            v-for="theme in themeStore.importedThemes"
            :key="theme.name"
            class="flex items-center justify-between gap-4 p-3 border border-base-200 rounded-box"
          >
            <div class="flex items-center gap-3">
              <span class="font-semibold">{{ theme.name }}</span>
              <span class="badge badge-ghost badge-sm">{{ theme.colorScheme }}</span>
            </div>
            <div class="flex gap-2">
              <DButton
                variant="primary"
                size="sm"
                :disabled="themeStore.globalThemeName === theme.name"
                @click="themeStore.applyTheme(theme.name)"
              >
                Apply
              </DButton>
              <DButton variant="error" size="sm" @click="requestDelete(theme.name)">
                <PhTrash :size="16" />
              </DButton>
            </div>
          </div>
        </div>
      </DCardBody>
    </DCard>

    <ConfirmModal
      v-model="showDeleteModal"
      :title="themeToDelete ? `Delete ${themeToDelete}?` : 'Confirm deletion'"
      message="This will remove the imported theme. It cannot be undone."
      confirm-text="Delete"
      cancel-text="Cancel"
      variant="error"
      @confirm="confirmDelete"
    />
  </LContainer>
</template>
