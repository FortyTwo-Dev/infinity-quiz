<script setup lang="ts">
import { ref, watch } from 'vue'
import { DButton, DSelect, DSelectOption, DInput } from '@/components/daisy-ui'

interface Props {
  searchTerm: string
  categories: string[]
  tags: string[]
  selectedCategory: string | null
  selectedTag: string | null
}

interface Emits {
  (e: 'update:searchTerm', value: string): void
  (e: 'update:selectedCategory', value: string | null): void
  (e: 'update:selectedTag', value: string | null): void
  (e: 'clear'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localSearchTerm = ref(props.searchTerm)

// Sync props with local state
watch(
  () => props.searchTerm,
  (value) => {
    localSearchTerm.value = value
  },
)

watch(localSearchTerm, (value) => {
  emit('update:searchTerm', value)
})

const handleSearchChange = (value: string | number) => {
  localSearchTerm.value = String(value)
}

const handleCategorySelect = (category: string | number | null) => {
  emit('update:selectedCategory', category === null || category === '' ? null : String(category))
}

const handleTagSelect = (tag: string | number | null) => {
  emit('update:selectedTag', tag === null || tag === '' ? null : String(tag))
}

const handleClear = () => {
  localSearchTerm.value = ''
  emit('update:selectedCategory', null)
  emit('update:selectedTag', null)
  emit('clear')
}
</script>

<template>
  <div class="flex flex-wrap gap-4 items-center mb-6">
    <div class="relative flex-1 min-w-50">
      <DInput
        id="search-input"
        type="text"
        :model-value="localSearchTerm"
        placeholder="Search quizzes..."
        class="w-full"
        aria-label="Search quizzes"
        @update:model-value="handleSearchChange"
      />
    </div>

    <div class="flex gap-4 items-center">
      <DSelect
        :model-value="selectedCategory"
        size="md"
        class="w-48"
        @update:model-value="handleCategorySelect"
      >
        <DSelectOption value="">All categories</DSelectOption>
        <DSelectOption v-for="category in categories" :key="category" :value="category">
          {{ category }}
        </DSelectOption>
      </DSelect>

      <DSelect
        :model-value="selectedTag"
        size="md"
        class="w-44"
        @update:model-value="handleTagSelect"
      >
        <DSelectOption value="">All tags</DSelectOption>
        <DSelectOption v-for="tag in tags" :key="tag" :value="tag">
          {{ tag }}
        </DSelectOption>
      </DSelect>

      <DButton
        type="button"
        variant="secondary"
        size="md"
        @click="handleClear"
        :disabled="!localSearchTerm && !selectedCategory && !selectedTag"
      >
        Clear
      </DButton>
    </div>
  </div>
</template>
