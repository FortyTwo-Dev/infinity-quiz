<script setup lang="ts">
import { ref, watch } from 'vue'
import { DButton } from '@/components/daisy-ui'

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
const showCategoryDropdown = ref(false)
const showTagDropdown = ref(false)

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

const handleSearchChange = (e: Event) => {
  localSearchTerm.value = (e.target as HTMLInputElement).value
}

const handleCategorySelect = (category: string | null) => {
  emit('update:selectedCategory', category)
  showCategoryDropdown.value = false
}

const handleTagSelect = (tag: string | null) => {
  emit('update:selectedTag', tag)
  showTagDropdown.value = false
}

const handleClear = () => {
  localSearchTerm.value = ''
  emit('update:selectedCategory', null)
  emit('update:selectedTag', null)
  emit('clear')
}

const getCategoryLabel = (category: string | null): string => {
  return category || 'Toutes les catégories'
}

const getTagLabel = (tag: string | null): string => {
  return tag || 'Tous les tags'
}
</script>

<template>
  <div class="flex flex-wrap gap-4 items-center mb-6">
    <div class="relative flex-1 min-w-[200px]">
      <input
        id="search-input"
        type="text"
        :value="localSearchTerm"
        @input="handleSearchChange"
        placeholder="Rechercher des quiz..."
        class="input input-bordered w-full"
        aria-label="Rechercher des quiz"
      />
    </div>

    <div class="flex gap-2 items-center">
      <div class="relative" @click.stop tabindex="0" @keydown.enter.stop="showCategoryDropdown = !showCategoryDropdown" @keydown.space.stop="showCategoryDropdown = !showCategoryDropdown">
        <button
          type="button"
          class="btn btn-ghost btn-sm flex items-center gap-1"
          @click="showCategoryDropdown = !showCategoryDropdown"
        >
          {{ getCategoryLabel(selectedCategory) }}
          <span class="text-xs text-base-content/60">{{ showCategoryDropdown ? '▲' : '▼' }}</span>
        </button>
        <ul
          v-if="showCategoryDropdown"
          class="absolute top-full left-0 right-0 mt-1 p-1 bg-base-100 border border-base-300 rounded-lg shadow-lg max-h-[200px] overflow-y-auto z-[1000] list-none"
        >
          <li
            role="button"
            tabindex="0"
            class="px-4 py-2 text-sm cursor-pointer hover:bg-base-200 hover:text-primary transition-all"
            @click="handleCategorySelect(null)"
            @keydown.enter="handleCategorySelect(null)"
            @keydown.space="handleCategorySelect(null)"
          >
            Toutes les catégories
          </li>
          <li
            v-for="category in categories"
            :key="category"
            role="button"
            tabindex="0"
            class="px-4 py-2 text-sm cursor-pointer hover:bg-base-200 hover:text-primary transition-all"
            @click="handleCategorySelect(category)"
            @keydown.enter="handleCategorySelect(category)"
            @keydown.space="handleCategorySelect(category)"
          >
            {{ category }}
          </li>
        </ul>
      </div>

      <div class="relative" @click.stop tabindex="0" @keydown.enter.stop="showTagDropdown = !showTagDropdown" @keydown.space.stop="showTagDropdown = !showTagDropdown">
        <button
          type="button"
          class="btn btn-ghost btn-sm flex items-center gap-1"
          @click="showTagDropdown = !showTagDropdown"
        >
          {{ getTagLabel(selectedTag) }}
          <span class="text-xs text-base-content/60">{{ showTagDropdown ? '▲' : '▼' }}</span>
        </button>
        <ul
          v-if="showTagDropdown"
          class="absolute top-full left-0 right-0 mt-1 p-1 bg-base-100 border border-base-300 rounded-lg shadow-lg max-h-[200px] overflow-y-auto z-[1000] list-none"
        >
          <li
            role="button"
            tabindex="0"
            class="px-4 py-2 text-sm cursor-pointer hover:bg-base-200 hover:text-primary transition-all"
            @click="handleTagSelect(null)"
            @keydown.enter="handleTagSelect(null)"
            @keydown.space="handleTagSelect(null)"
          >
            Tous les tags
          </li>
          <li
            v-for="tag in tags"
            :key="tag"
            role="button"
            tabindex="0"
            class="px-4 py-2 text-sm cursor-pointer hover:bg-base-200 hover:text-primary transition-all"
            @click="handleTagSelect(tag)"
            @keydown.enter="handleTagSelect(tag)"
            @keydown.space="handleTagSelect(tag)"
          >
            {{ tag }}
          </li>
        </ul>
      </div>

      <DButton
        type="button"
        variant="secondary"
        size="sm"
        @click="handleClear"
        :disabled="!localSearchTerm && !selectedCategory && !selectedTag"
      >
        Effacer
      </DButton>
    </div>
  </div>
</template>
