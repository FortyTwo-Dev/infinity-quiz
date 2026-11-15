<script setup lang="ts">
import { ref } from 'vue'
import { PhPlus, PhUpload } from '@phosphor-icons/vue'
import { ItButton } from '@infinitylib/infinity-theme-vue'
import { ItCard, ItCardBody } from '@/components/itheme'
import { ConfirmModal } from '@/components/common'
import QuizSearchBar from '../components/quiz/QuizSearchBar.vue'
import { QuizManageCard } from '../components/quiz/card'
import { useQuizManagement } from '../composables/useQuizManagement'
import { useQuizStore, useNotificationStore } from '../stores'

const quizStore = useQuizStore()
const notificationStore = useNotificationStore()

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

const showDeleteModal = ref(false)
const quizToDelete = ref<string | null>(null)
const showDuplicateModal = ref(false)
const quizToDuplicate = ref<string | null>(null)

function confirmDuplicate() {
  if (quizToDuplicate.value) {
    const title = quizStore.getQuizById(quizToDuplicate.value)?.title || 'this quiz'
    duplicateQuiz(quizToDuplicate.value)
    notificationStore.addNotification(`Quiz "${title}" duplicated successfully`, 'success', 3000)
    quizToDuplicate.value = null
  }
  showDuplicateModal.value = false
}

function confirmDelete() {
  if (quizToDelete.value) {
    const title = quizStore.getQuizById(quizToDelete.value)?.title || 'this quiz'
    deleteQuiz(quizToDelete.value)
    notificationStore.addNotification(`Quiz "${title}" deleted`, 'success', 3000)
    quizToDelete.value = null
  }
  showDeleteModal.value = false
}

function requestDelete(quizId: string) {
  quizToDelete.value = quizId
  showDeleteModal.value = true
}

function requestDuplicate(quizId: string) {
  quizToDuplicate.value = quizId
  showDuplicateModal.value = true
}

const hasFilters = () => Boolean(searchTerm.value || selectedCategory.value || selectedTag.value)
</script>

<template>
  <section class="quiz-view">
    <header class="quiz-page-header">
      <div>
        <h1 class="quiz-page-title">Manage quizzes</h1>
        <p class="quiz-page-subtitle">Create, edit, duplicate, delete and export your quizzes</p>
      </div>
      <div class="quiz-page-actions">
        <ItButton variant="secondary" @click="navigateToImportExport">
          <PhUpload :size="20" />
          Import / Export
        </ItButton>
        <ItButton variant="primary" @click="navigateToCreate">
          <PhPlus :size="20" />
          New quiz
        </ItButton>
      </div>
    </header>

    <QuizSearchBar
      v-model:search-term="searchTerm"
      v-model:selected-category="selectedCategory"
      v-model:selected-tag="selectedTag"
      :categories="allCategories"
      :tags="allTags"
    />

    <div v-if="filteredQuizzes.length > 0" class="quiz-grid">
      <QuizManageCard
        v-for="quiz in filteredQuizzes"
        :key="quiz.id"
        :quiz="quiz"
        @edit="navigateToEdit"
        @duplicate="requestDuplicate"
        @delete="requestDelete"
      />
    </div>

    <ItCard v-else border class="quiz-empty">
      <ItCardBody size="lg">
        <p class="quiz-empty-title">No quizzes found</p>
        <p class="quiz-empty-text">
          {{
            hasFilters()
              ? 'Nothing matches these filters.'
              : 'The catalogue is empty: create a quiz or import one.'
          }}
        </p>
        <div class="quiz-empty-actions">
          <ItButton v-if="hasFilters()" variant="secondary" @click="clearFilters">
            Clear filters
          </ItButton>
          <ItButton v-else variant="primary" @click="navigateToCreate">
            <PhPlus :size="18" />
            Create a quiz
          </ItButton>
        </div>
      </ItCardBody>
    </ItCard>

    <ConfirmModal
      v-model="showDeleteModal"
      :title="
        quizToDelete
          ? 'Delete ' + (quizStore.getQuizById(quizToDelete)?.title || '')
          : 'Confirm deletion'
      "
      confirm-text="Delete"
      cancel-text="Cancel"
      variant="danger"
      @confirm="confirmDelete"
    />

    <ConfirmModal
      v-model="showDuplicateModal"
      title="Confirm duplication"
      :message="
        quizToDuplicate
          ? 'Duplicate ' + (quizStore.getQuizById(quizToDuplicate)?.title || '') + ' ?'
          : ''
      "
      confirm-text="Duplicate"
      cancel-text="Cancel"
      variant="primary"
      @confirm="confirmDuplicate"
    />
  </section>
</template>
