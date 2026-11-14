<script setup lang="ts">
import { computed } from 'vue'
import { PhUpload, PhTrash } from '@phosphor-icons/vue'
import { ItAlert, ItCard, ItCardBody, ItCardTitle, ItFileInput } from '@/components/itheme'
import { ItButton, ItTextarea } from '@infinitylib/infinity-theme-vue'
import { useQuizImportExport } from '@/composables'

const { state, validateJSON, clearMessages, importFromJson, importFile } = useQuizImportExport()

async function handleFileSelect(files: File[]) {
  const file = files[0]
  if (!file) return
  await importFile(file)
}

function handleImportFromText() {
  importFromJson(state.value.jsonData)
}

function handleClearText() {
  clearMessages()
  state.value.jsonData = ''
}

const previewText = computed(() => {
  if (!state.value.jsonData) return 'Paste your JSON here…'
  try {
    const parsed = JSON.parse(state.value.jsonData)
    return Array.isArray(parsed)
      ? `Ready to import ${parsed.length} quizzes`
      : `Ready to import: ${parsed.title || 'Untitled quiz'}`
  } catch {
    return 'Invalid JSON'
  }
})

const isJsonValid = computed(() =>
  state.value.jsonData ? validateJSON(state.value.jsonData) : false,
)
</script>

<template>
  <ItCard border class="import-card">
    <ItCardBody size="lg">
      <ItCardTitle as="h2">
        <PhUpload :size="24" aria-hidden="true" />
        Import
      </ItCardTitle>

      <section class="import-section">
        <h3 class="import-section-title">From a file</h3>
        <ItFileInput label="Select a JSON file" accept=".json" @change="handleFileSelect" />
      </section>

      <p class="import-or">or</p>

      <section class="import-section">
        <h3 class="import-section-title">From JSON text</h3>
        <ItTextarea
          v-model="state.jsonData"
          placeholder="Paste your JSON here…"
          :rows="6"
          class="import-json"
          aria-label="Quizzes JSON to import"
        />
        <p class="import-preview" :class="{ 'import-preview-valid': isJsonValid }">
          {{ previewText }}
        </p>

        <div class="import-actions">
          <ItButton
            type="reset"
            variant="danger"
            :disabled="!state.jsonData"
            @click="handleClearText"
          >
            <PhTrash :size="18" aria-hidden="true" />
            Clear
          </ItButton>
          <ItButton
            type="button"
            variant="primary"
            :disabled="!state.jsonData || !isJsonValid"
            :loading="state.isImporting"
            @click="handleImportFromText"
          >
            <PhUpload :size="18" aria-hidden="true" />
            Import
          </ItButton>
        </div>
      </section>

      <ItAlert v-if="state.successMessage" variant="success" live>
        {{ state.successMessage }}
      </ItAlert>
      <ItAlert v-if="state.error" variant="danger" live>
        {{ state.error }}
      </ItAlert>
    </ItCardBody>
  </ItCard>
</template>
