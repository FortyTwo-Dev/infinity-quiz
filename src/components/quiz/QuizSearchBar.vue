<script setup lang="ts">
import { ref, watch } from 'vue'
import { ItButton, ItInput, ItOption, ItSelect } from '@infinitylib/infinity-theme-vue'

interface Props {
  searchTerm: string
  categories: string[]
  tags: string[]
  selectedCategory: string | null
  selectedTag: string | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:searchTerm': [value: string]
  'update:selectedCategory': [value: string | null]
  'update:selectedTag': [value: string | null]
  clear: []
}>()

const localSearchTerm = ref(props.searchTerm)

watch(
  () => props.searchTerm,
  (value) => {
    localSearchTerm.value = value
  },
)

watch(localSearchTerm, (value) => {
  emit('update:searchTerm', value)
})

function handleSearch(value: string | number | undefined) {
  localSearchTerm.value = String(value ?? '')
}

function handleCategorySelect(value: string | undefined) {
  emit('update:selectedCategory', value ? String(value) : null)
}

function handleTagSelect(value: string | undefined) {
  emit('update:selectedTag', value ? String(value) : null)
}

function handleClear() {
  localSearchTerm.value = ''
  emit('update:selectedCategory', null)
  emit('update:selectedTag', null)
  emit('clear')
}
</script>

<template>
  <search class="quiz-search-bar">
    <ItInput
      id="quiz-search"
      type="search"
      :model-value="localSearchTerm"
      placeholder="Search quizzes…"
      aria-label="Search quizzes"
      class="quiz-search-input"
      @update:model-value="handleSearch"
    />

    <ItSelect
      id="quiz-category"
      :model-value="selectedCategory ?? ''"
      aria-label="Filter by category"
      class="quiz-search-filter"
      @update:model-value="handleCategorySelect"
    >
      <ItOption value="" text="All categories" />
      <ItOption v-for="category in categories" :key="category" :value="category" :text="category" />
    </ItSelect>

    <ItSelect
      id="quiz-tag"
      :model-value="selectedTag ?? ''"
      aria-label="Filter by tag"
      class="quiz-search-filter"
      @update:model-value="handleTagSelect"
    >
      <ItOption value="" text="All tags" />
      <ItOption v-for="tag in tags" :key="tag" :value="tag" :text="tag" />
    </ItSelect>

    <ItButton
      type="button"
      variant="secondary"
      :disabled="!localSearchTerm && !selectedCategory && !selectedTag"
      @click="handleClear"
    >
      Clear
    </ItButton>
  </search>
</template>
