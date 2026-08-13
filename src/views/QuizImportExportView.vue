<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Button from '../components/common/Button.vue'
import Card from '../components/common/Card.vue'
import { useQuizStore } from '../stores'
import { useQuizImportExport } from '../composables/useQuizImportExport'
import { PhDownload, PhUpload, PhCopy, PhTrash } from '@phosphor-icons/vue'

const quizStore = useQuizStore()
const {
  state,
  exportSingleQuiz,
  exportAllQuizzes,
  downloadQuiz,
  downloadAllQuizzes,
  importSingleQuiz,
  importMultipleQuizzes,
  importFromFile,
  validateJSON,
  clearMessages,
} = useQuizImportExport()

const selectedQuizId = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

// Available quizzes
const quizzes = computed(() => quizStore.quizzes)

// Initialize
onMounted(() => {
  quizStore.initializeSampleQuizzes()
})

// Export handlers
const handleExportSingle = () => {
  if (selectedQuizId.value) {
    downloadQuiz(selectedQuizId.value)
  }
}

const handleExportAll = () => {
  downloadAllQuizzes()
}

// Import handlers
const handleFileSelect = async (event: Event) => {
  await importFromFile(event)
}

const handleImportFromText = () => {
  clearMessages()
  if (validateJSON(state.value.jsonData)) {
    // Try to detect if it's a single quiz or multiple
    try {
      const parsed = JSON.parse(state.value.jsonData)
      if (Array.isArray(parsed)) {
        importMultipleQuizzes(state.value.jsonData)
      } else {
        importSingleQuiz(state.value.jsonData)
      }
    } catch {
      state.value.error = 'JSON invalide'
    }
  } else {
    state.value.error = 'Format JSON invalide. Doit contenir id, title et questions.'
  }
}

const handleClearText = () => {
  state.value.jsonData = ''
  clearMessages()
}

const handleCopyToClipboard = async () => {
  try {
    const jsonData = selectedQuizId.value
      ? exportSingleQuiz(selectedQuizId.value) || ''
      : exportAllQuizzes()
    await navigator.clipboard.writeText(jsonData)
    state.value.successMessage = 'Copié dans le presse-papier !'
  } catch {
    state.value.error = 'Échec de la copie dans le presse-papier'
  }
}

const getExportPreview = computed(() => {
  if (selectedQuizId.value) {
    return exportSingleQuiz(selectedQuizId.value)
  }
  return null
})

const previewText = computed(() => {
  if (state.value.jsonData) {
    try {
      const parsed = JSON.parse(state.value.jsonData)
      if (Array.isArray(parsed)) {
        return `Prêt à importer ${parsed.length} quiz`
      } else {
        return `Prêt à importer : ${parsed.title || 'Quiz sans titre'}`
      }
    } catch {
      return 'JSON invalide'
    }
  }
  return 'Collez votre JSON ici...'
})

const isJsonValid = computed(() => {
  return state.value.jsonData ? validateJSON(state.value.jsonData) : false
})

const hasQuizzes = computed(() => quizzes.value.length > 0)
</script>

<template>
  <div class="quiz-import-export-view">
    <div class="header">
      <h1>Importer / Exporter des Quiz</h1>
      <p>Partagez vos quiz avec d'autres utilisateurs ou importez des quiz existants</p>
    </div>

    <div class="content">
      <!-- Export Section -->
      <Card variant="default" padding="medium" class="section">
        <h2>
          <PhDownload :size="24" />
          Exporter
        </h2>

        <div class="export-options">
          <div class="form-group">
            <label for="quiz-select">Sélectionner un quiz à exporter</label>
            <select
              id="quiz-select"
              v-model="selectedQuizId"
              :disabled="!hasQuizzes"
            >
              <option value="">-- Tous les quiz --</option>
              <option v-for="quiz in quizzes" :key="quiz.id" :value="quiz.id">
                {{ quiz.title }}
              </option>
            </select>
          </div>

          <div class="export-buttons">
            <Button
              type="button"
              variant="primary"
              @click="handleExportSingle"
              :disabled="!selectedQuizId"
            >
              <PhDownload :size="18" />
              Exporter Quiz Sélectionné
            </Button>

            <Button type="button" variant="primary" @click="handleExportAll">
              <PhDownload :size="18" />
              Exporter Tous les Quiz
            </Button>

            <Button
              type="button"
              variant="secondary"
              @click="handleCopyToClipboard"
              :disabled="!selectedQuizId && !hasQuizzes"
            >
              <PhCopy :size="18" />
              Copier dans le presse-papier
            </Button>
          </div>

          <div v-if="selectedQuizId" class="preview-container">
            <h4>Aperçu du JSON :</h4>
            <pre class="json-preview">{{ getExportPreview }}</pre>
          </div>
        </div>
      </Card>

      <!-- Import Section -->
      <Card variant="default" padding="medium" class="section">
        <h2>
          <PhUpload :size="24" />
          Importer
        </h2>

        <div class="import-options">
          <div class="import-method">
            <h3>À partir d'un fichier</h3>
            <div class="file-upload">
              <input
                id="fileInput"
                ref="fileInput"
                type="file"
                accept=".json"
                @change="handleFileSelect"
                class="file-input"
                hidden
                aria-label="Sélectionner un fichier JSON"
              />
              <Button
                type="button"
                variant="primary"
                @click="() => fileInput?.click()"
              >
                <PhUpload :size="18" />
                Sélectionner un fichier
              </Button>
              <span class="file-hint">ou glissez-déposez un fichier JSON ici</span>
            </div>
          </div>

          <div class="divider">
            <span>ou</span>
          </div>

          <div class="import-method">
            <h3>À partir de texte JSON</h3>
            <div class="json-input-container">
              <textarea
                v-model="state.jsonData"
                placeholder="Collez votre JSON ici..."
                rows="6"
                :class="{
                  'input-error': state.error && !state.jsonData,
                  'input-success': isJsonValid,
                }"
              />
              <div class="preview-line">
                <span :class="{ 'valid': isJsonValid, 'invalid': state.error }">
                  {{ previewText }}
                </span>
              </div>
            </div>
          </div>

          <div class="import-buttons">
            <Button
              type="button"
              variant="danger"
              @click="handleClearText"
              :disabled="!state.jsonData"
            >
              <PhTrash :size="18" />
              Effacer
            </Button>
            <Button
              type="button"
              variant="primary"
              @click="handleImportFromText"
              :disabled="!state.jsonData || !isJsonValid"
              :loading="state.isImporting"
            >
              <PhUpload :size="18" />
              Importer
            </Button>
          </div>

          <!-- Messages -->
          <div v-if="state.successMessage" class="message success">
            {{ state.successMessage }}
          </div>
          <div v-if="state.error" class="message error">
            {{ state.error }}
          </div>
        </div>
      </Card>

      <!-- Info Section -->
      <Card variant="default" padding="medium" class="section info-section">
        <h2>Informations</h2>
        <p>
          Vous pouvez exporter et importer des quiz au format JSON.
          Cela vous permet de partager vos quiz avec d'autres utilisateurs.
        </p>
        <ul>
          <li><strong>Exporter un quiz :</strong> Sélectionnez un quiz et cliquez sur "Exporter Quiz Sélectionné" ou "Exporter Tous les Quiz"</li>
          <li><strong>Importer un quiz :</strong> Sélectionnez un fichier JSON ou collez le contenu JSON directement</li>
          <li><strong>Format requis :</strong> Le JSON doit contenir au minimum <code>id</code>, <code>title</code>, et <code>questions</code></li>
          <li><strong>Copier dans le presse-papier :</strong> Copiez rapidement le JSON d'un quiz pour le partager</li>
        </ul>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.quiz-import-export-view {
  max-width: 1000px;
  margin: 0 auto;
  padding: var(--space-md);
}

.header {
  margin-bottom: var(--space-xl);
}

.header h1 {
  margin: 0 0 var(--space-sm) 0;
  color: var(--color-text);
}

.header p {
  margin: 0;
  color: var(--color-text-secondary);
}

.content {
  display: grid;
  gap: var(--space-lg);
}

.section {
  width: 100%;
}

.section h2 {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin: 0 0 var(--space-lg) 0;
  color: var(--color-text);
}

.section h3 {
  margin: 0 0 var(--space-sm) 0;
  color: var(--color-text);
  font-size: 1rem;
}

.section h4 {
  margin: var(--space-md) 0 var(--space-sm) 0;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
}

.export-options,
.import-options {
  display: grid;
  gap: var(--space-md);
}

.form-group {
  margin-bottom: var(--space-md);
}

.form-group label {
  display: block;
  margin-bottom: var(--space-xs);
  font-weight: 500;
  color: var(--color-text);
}

.form-group select {
  width: 100%;
  max-width: 400px;
  padding: var(--space-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-bg);
  color: var(--color-text);
  font-family: inherit;
  font-size: 0.95rem;
}

.form-group select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px var(--color-primary-alpha);
}

.export-buttons,
.import-buttons {
  display: flex;
  gap: var(--space-md);
  flex-wrap: wrap;
}

.file-upload {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.file-hint {
  color: var(--color-text-secondary);
  font-size: 0.85rem;
}

.json-input-container {
  display: grid;
  gap: var(--space-xs);
}

.json-input-container textarea {
  width: 100%;
  padding: var(--space-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-bg);
  color: var(--color-text);
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  resize: vertical;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.json-input-container textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px var(--color-primary-alpha);
}

.json-input-container textarea.input-error {
  border-color: var(--color-danger);
}

.json-input-container textarea.input-success {
  border-color: var(--color-success);
}

.preview-line {
  font-size: 0.85rem;
}

.preview-line .valid {
  color: var(--color-success);
}

.preview-line .invalid {
  color: var(--color-danger);
}

.preview-container {
  margin-top: var(--space-md);
}

.json-preview {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: var(--space-sm);
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
  max-height: 200px;
  overflow-y: auto;
}

.divider {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  color: var(--color-text-secondary);
  font-size: 0.85rem;
  margin: var(--space-md) 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--color-border);
}

.message {
  margin-top: var(--space-md);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
}

.message.success {
  background: color-mix(in srgb, var(--color-success) 15%, transparent);
  color: var(--color-success);
  border: 1px solid var(--color-success);
}

.message.error {
  background: color-mix(in srgb, var(--color-danger) 15%, transparent);
  color: var(--color-danger);
  border: 1px solid var(--color-danger);
}

.info-section {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
}

.info-section ul {
  margin: var(--space-md) 0;
  padding-left: var(--space-lg);
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.info-section code {
  background: var(--color-bg-hover);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-xs);
  font-family: 'Courier New', monospace;
  color: var(--color-primary);
}
</style>
