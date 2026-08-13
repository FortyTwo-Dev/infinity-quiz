<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Card from '../components/common/Card.vue'
import Button from '../components/common/Button.vue'
import ConfirmDeleteModal from '../components/common/ConfirmDeleteModal.vue'
import QuizSearchBar from '../components/quiz/QuizSearchBar.vue'
import { useQuizManagement } from '../composables/useQuizManagement'
import { useQuizStore } from '../stores'
import { PhPlus, PhTrash, PhPencil, PhCopy, PhUpload } from '@phosphor-icons/vue'

const quizStore = useQuizStore()
const {
  searchTerm,
  selectedCategory,
  selectedTag,
  allCategories,
  allTags,
  filteredQuizzes,
  deleteQuiz,
  duplicateQuiz,
  navigateToEdit,
  navigateToCreate,
  navigateToImportExport,
  clearFilters,
} = useQuizManagement()

// Modal state
const showDeleteModal = ref(false)
const quizToDelete = ref<string | null>(null)
const showDuplicateModal = ref(false)
const quizToDuplicate = ref<string | null>(null)

// Initialize quizzes
onMounted(() => {
  quizStore.initializeSampleQuizzes()
})

const handleCreateQuiz = () => {
  navigateToCreate()
}

const handleEditQuiz = (quizId: string) => {
  navigateToEdit(quizId)
}

const handleDuplicateQuiz = (quizId: string) => {
  quizToDuplicate.value = quizId
  showDuplicateModal.value = true
}

const confirmDuplicate = () => {
  if (quizToDuplicate.value) {
    duplicateQuiz(quizToDuplicate.value)
    quizToDuplicate.value = null
  }
  showDuplicateModal.value = false
}

const handleDeleteQuiz = (quizId: string) => {
  quizToDelete.value = quizId
  showDeleteModal.value = true
}

const confirmDelete = () => {
  if (quizToDelete.value) {
    deleteQuiz(quizToDelete.value)
    quizToDelete.value = null
  }
  showDeleteModal.value = false
}

const handleImportExport = () => {
  navigateToImportExport()
}

const getQuizCardClass = (quiz: { category?: string }) => {
  return {
    'quiz-card--general': quiz.category === 'Général',
    'quiz-card--science': quiz.category === 'Sciences',
    'quiz-card--history': quiz.category === 'Histoire',
    'quiz-card--speed': quiz.category === 'Vitesse',
    'quiz-card--learning': quiz.category === 'Apprentissage',
    'quiz-card--difficult': quiz.category === 'Difficile',
    'quiz-card--complete': quiz.category === 'Complet',
    'quiz-card--random': quiz.category === 'Aléatoire',
  }
}

const getCategoryColor = (category: string | undefined): string => {
  const colors: Record<string, string> = {
    Général: '--color-success',
    Sciences: '--color-info',
    Histoire: '--color-warning',
    Vitesse: '--color-danger',
    Apprentissage: '--color-primary',
    Difficile: '--color-danger',
    Complet: '--color-success',
    Aléatoire: '--color-warning',
  }
  return colors[category || ''] || '--color-primary'
}
</script>

<template>
  <div class="quiz-management-view">
    <div class="header">
      <div class="header-content">
        <h1>Gestion des Quiz</h1>
        <p>Créez, modifiez, supprimez et organisez vos quiz</p>
      </div>
      <div class="header-actions">
        <Button type="button" variant="secondary" @click="handleImportExport">
          <PhUpload :size="20" />
          Importer/Exporter
        </Button>
        <Button type="button" variant="primary" @click="handleCreateQuiz">
          <PhPlus :size="20" />
          Nouveau Quiz
        </Button>
      </div>
    </div>

    <QuizSearchBar
      v-model:searchTerm="searchTerm"
      v-model:selectedCategory="selectedCategory"
      v-model:selectedTag="selectedTag"
      :categories="allCategories"
      :tags="allTags"
    />

    <div class="quiz-grid">
      <Card
        v-for="quiz in filteredQuizzes"
        :key="quiz.id"
        variant="default"
        padding="medium"
        hoverable
        :class="['quiz-card', getQuizCardClass(quiz)]"
      >
        <div class="quiz-card-header">
          <div class="quiz-category" :style="{ '--category-color': `var(${getCategoryColor(quiz.category)})` }">
            {{ quiz.category || 'Non catégorisé' }}
          </div>
          <div class="quiz-actions">
            <Button
              type="button"
              variant="secondary"
              size="small"
              @click.stop="handleDuplicateQuiz(quiz.id)"
              title="Dupliquer"
            >
              <PhCopy :size="16" />
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="small"
              @click.stop="handleEditQuiz(quiz.id)"
              title="Modifier"
            >
              <PhPencil :size="16" />
            </Button>
            <Button
              type="button"
              variant="danger"
              size="small"
              @click.stop="handleDeleteQuiz(quiz.id)"
              title="Supprimer"
            >
              <PhTrash :size="16" />
            </Button>
          </div>
        </div>

        <div class="quiz-card-body" @click="handleEditQuiz(quiz.id)">
          <h2>{{ quiz.title }}</h2>
          <p class="quiz-description">{{ quiz.description }}</p>
          <div class="quiz-meta">
            <span class="meta-item">
              <strong>{{ quiz.questions.length }}</strong> questions
            </span>
            <span v-if="quiz.tags && quiz.tags.length > 0" class="meta-tags">
              <span v-for="tag in quiz.tags" :key="tag" class="tag">{{ tag }}</span>
            </span>
          </div>
        </div>
      </Card>

      <div v-if="filteredQuizzes.length === 0" class="empty-state">
        <h3>Aucun quiz trouvé</h3>
        <p v-if="searchTerm || selectedCategory || selectedTag">
          Aucun quiz ne correspond à vos critères de recherche.
          <button type="button" class="clear-link" @click="clearFilters">Effacer les filtres</button>
        </p>
        <p v-else>Aucun quiz disponible. Créez-en un nouveau !</p>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <ConfirmDeleteModal
      v-model="showDeleteModal"
      :itemName="quizToDelete ? quizStore.getQuizById(quizToDelete)?.title : ''"
      confirm-text="Supprimer"
      cancel-text="Annuler"
      @confirm="confirmDelete"
    />

    <!-- Duplicate Confirmation Modal -->
    <ConfirmDeleteModal
      v-model="showDuplicateModal"
      title="Confirmer la duplication"
      :message="quizToDuplicate ? 'Dupliquer ' + (quizStore.getQuizById(quizToDuplicate)?.title || '') + ' ?' : ''"
      confirm-text="Dupliquer"
      cancel-text="Annuler"
      @confirm="confirmDuplicate"
    />
  </div>
</template>

<style scoped>
.quiz-management-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-md);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-xl);
  gap: var(--space-lg);
}

.header-content h1 {
  margin: 0 0 var(--space-sm) 0;
  color: var(--color-text);
}

.header-content p {
  margin: 0;
  color: var(--color-text-secondary);
}

.header-actions {
  display: flex;
  gap: var(--space-md);
}

.quiz-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-md);
}

.quiz-card {
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid var(--color-border);
}

.quiz-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.quiz-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-sm);
}

.quiz-category {
  display: inline-block;
  padding: var(--space-xs) var(--space-sm);
  background: color-mix(in srgb, var(--category-color) 15%, transparent);
  color: var(--category-color);
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.quiz-actions {
  display: flex;
  gap: var(--space-xs);
  opacity: 0;
  transition: opacity 0.2s;
}

.quiz-card:hover .quiz-actions {
  opacity: 1;
}

.quiz-card-body h2 {
  margin: 0 0 var(--space-xs) 0;
  color: var(--color-text);
  font-size: 1.1rem;
}

.quiz-description {
  color: var(--color-text-secondary);
  font-size: 0.85rem;
  margin: 0 0 var(--space-sm) 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.quiz-meta {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  flex-wrap: wrap;
}

.meta-item {
  display: inline-block;
  padding: var(--space-xs) var(--space-sm);
  background: var(--color-bg);
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  color: var(--color-text-secondary);
}

.meta-item strong {
  color: var(--color-primary);
}

.meta-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}

.tag {
  display: inline-block;
  padding: var(--space-xs) var(--space-sm);
  background: var(--color-primary-alpha);
  color: var(--color-primary);
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: var(--space-xl);
  color: var(--color-text-secondary);
}

.empty-state h3 {
  margin: 0 0 var(--space-sm) 0;
  color: var(--color-text);
}

.clear-link {
  background: none;
  border: none;
  color: var(--color-primary);
  cursor: pointer;
  text-decoration: underline;
  font-size: inherit;
  padding: 0;
  margin-left: var(--space-xs);
}

.clear-link:hover {
  color: var(--color-primary-dark);
}
</style>
