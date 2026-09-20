<script setup lang="ts">
import { computed } from 'vue'
import { DCard, DCardBody } from '@/components/daisy-ui/card'
import { DButton, DCardActions, DCardTitle, DInputFile, DTextarea } from '@/components/daisy-ui'
import { useQuizImportExport } from '@/composables'
import { PhUpload, PhTrash } from '@phosphor-icons/vue'

const { state, validateJSON, clearMessages, importFromFile } = useQuizImportExport()

interface Emits {
  (e: 'import'): void
  (e: 'clear'): void
}

const emit = defineEmits<Emits>()

const handleFileSelect = async (event: Event) => {
  await importFromFile(event)
}

const handleImportFromText = () => {
  emit('import')
}

const handleClearText = () => {
  clearMessages()
  state.value.jsonData = ''
  emit('clear')
}

const previewText = computed(() => {
  if (state.value.jsonData) {
    try {
      const parsed = JSON.parse(state.value.jsonData)
      if (Array.isArray(parsed)) {
        return `Ready to import ${parsed.length} quizzes`
      } else {
        return `Ready to import: ${parsed.title || 'Untitled quiz'}`
      }
    } catch {
      return 'Invalid JSON'
    }
  }
  return 'Paste your JSON here...'
})

const isJsonValid = computed(() => {
  return state.value.jsonData ? validateJSON(state.value.jsonData) : false
})
</script>

<template>
  <DCard border class="bg-base-100">
    <DCardBody>
      <DCardTitle tag="h2" size="xl">
        <PhUpload :size="24" />
        Import
      </DCardTitle>
      <DCard>
        <DCardBody>
          <DCardTitle tag="h3" size="lg" class="w-full">From a file</DCardTitle>
          <DInputFile
            accept=".json"
            @change="handleFileSelect"
            aria-label="Select a JSON file"
            class="w-full"
          />
        </DCardBody>
      </DCard>

      <div class="divider">OR</div>

      <DCard>
        <DCardBody>
          <DCardTitle tag="h3" size="lg">From JSON text</DCardTitle>
          <DTextarea
            v-model="state.jsonData"
            placeholder="Paste your JSON here..."
            :rows="6"
            :variant="state.error && !state.jsonData ? 'error' : isJsonValid ? 'success' : ''"
            class="font-mono text-sm resize-y w-full"
            aria-label="Quizzes JSON to import"
          />
          <div class="text-xs">
            <span :class="{ 'text-success': isJsonValid, 'text-error': state.error }">
              {{ previewText }}
            </span>
          </div>
          <DCardActions justify="start">
            <DButton
              type="reset"
              variant="error"
              @click="handleClearText"
              :disabled="!state.jsonData"
            >
              <PhTrash :size="18" />
              Clear
            </DButton>
            <DButton
              type="button"
              variant="primary"
              @click="handleImportFromText"
              :disabled="!state.jsonData || !isJsonValid"
              :loading="state.isImporting"
            >
              <PhUpload :size="18" />
              Import
            </DButton>
          </DCardActions>
        </DCardBody>
      </DCard>

      <div class="grid gap-4">
        <div class="flex gap-4 flex-wrap"></div>

        <!-- Messages -->
        <div v-if="state.successMessage" class="mt-4 p-2 rounded text-sm alert alert-success">
          {{ state.successMessage }}
        </div>
        <div v-if="state.error" class="mt-4 p-2 rounded text-sm alert alert-error">
          {{ state.error }}
        </div>
      </div>
    </DCardBody>
  </DCard>
</template>
