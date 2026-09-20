<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ConfirmModal } from '@/components/common'
import { DButton } from '@/components/daisy-ui'
import QuizSearchBar from '../components/quiz/QuizSearchBar.vue'
import { QuizManageCard } from '../components/quiz/card'
import { useQuizManagement } from '../composables/useQuizManagement'
import { useQuizStore, useNotificationStore } from '../stores'
import { PhPlus, PhUpload } from '@phosphor-icons/vue'

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
    const title = quizStore.getQuizById(quizToDuplicate.value)?.title || 'le quiz'
    duplicateQuiz(quizToDuplicate.value)
    notificationStore.addNotification(`Quiz "${title}" dupliqué avec succès`, 'success', 3000)
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
    const title = quizStore.getQuizById(quizToDelete.value)?.title || 'le quiz'
    deleteQuiz(quizToDelete.value)
    notificationStore.addNotification(`Quiz "${title}" supprimé avec succès`, 'success', 3000)
    quizToDelete.value = null
  }
  showDeleteModal.value = false
}

const handleImportExport = () => {
  navigateToImportExport()
}
</script>

<template>
  <div class="max-w-7xl mx-auto p-4">
    <div class="flex justify-between items-start mb-8 gap-6">
      <div>
        <h1 class="text-base-content mb-2 text-2xl font-bold">Quiz Management</h1>
        <p class="text-base-content/70 m-0">Create, edit, delete and organize your quizzes</p>
      </div>
      <div class="flex gap-4">
        <DButton
          type="button"
          variant="secondary"
          size="md"
          @click="handleImportExport"
          class="inline-flex items-center gap-2"
        >
          <PhUpload :size="20" />
          Import/Export
        </DButton>
        <DButton
          type="button"
          variant="primary"
          size="md"
          @click="handleCreateQuiz"
          class="inline-flex items-center gap-2"
        >
          <PhPlus :size="20" />
          New Quiz
        </DButton>
      </div>
    </div>

    <QuizSearchBar
      v-model:searchTerm="searchTerm"
      v-model:selectedCategory="selectedCategory"
      v-model:selectedTag="selectedTag"
      :categories="allCategories"
      :tags="allTags"
    />

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <QuizManageCard
        v-for="quiz in filteredQuizzes"
        :key="quiz.id"
        :quiz="quiz"
        @edit="handleEditQuiz"
        @duplicate="handleDuplicateQuiz"
        @delete="handleDeleteQuiz"
      />

      <div
        v-if="filteredQuizzes.length === 0"
        class="col-span-full text-center p-8 text-base-content/70"
      >
        <h3 class="text-base-content mb-2 text-lg">No quizzes found</h3>
        <p v-if="searchTerm || selectedCategory || selectedTag" class="mb-0">
          No quizzes match your search criteria.
          <button
            type="button"
            class="bg-none border-none text-primary cursor-pointer underline font-inherit p-0 ml-2 hover:text-primary/80"
            @click="clearFilters"
          >
            Clear filters
          </button>
        </p>
        <p v-else class="mb-0">No quizzes available. Create a new one!</p>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <ConfirmModal
      v-model="showDeleteModal"
      :title="
        quizToDelete
          ? 'Delete ' + (quizStore.getQuizById(quizToDelete)?.title || '')
          : 'Confirm deletion'
      "
      confirm-text="Delete"
      cancel-text="Cancel"
      variant="error"
      @confirm="confirmDelete"
    />

    <!-- Duplicate Confirmation Modal -->
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
  </div>
</template>
