<script setup lang="ts">
import { ref, watch } from 'vue'
import Button from '../common/Button.vue'

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
  }
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
  <div class="quiz-search-bar">
    <div class="search-input-wrapper">
      <input
        type="text"
        :value="localSearchTerm"
        @input="handleSearchChange"
        placeholder="Rechercher des quiz..."
        class="search-input"
      />
      <span class="search-icon">🔍</span>
    </div>

    <div class="filters">
      <div class="dropdown" @click.stop>
        <button
          type="button"
          class="dropdown-toggle"
          @click="showCategoryDropdown = !showCategoryDropdown"
        >
          {{ getCategoryLabel(selectedCategory) }}
          <span class="dropdown-arrow">{{ showCategoryDropdown ? '▲' : '▼' }}</span>
        </button>
        <ul v-if="showCategoryDropdown" class="dropdown-menu">
          <li
            class="dropdown-item"
            @click="handleCategorySelect(null)"
          >
            Toutes les catégories
          </li>
          <li
            v-for="category in categories"
            :key="category"
            class="dropdown-item"
            @click="handleCategorySelect(category)"
          >
            {{ category }}
          </li>
        </ul>
      </div>

      <div class="dropdown" @click.stop>
        <button
          type="button"
          class="dropdown-toggle"
          @click="showTagDropdown = !showTagDropdown"
        >
          {{ getTagLabel(selectedTag) }}
          <span class="dropdown-arrow">{{ showTagDropdown ? '▲' : '▼' }}</span>
        </button>
        <ul v-if="showTagDropdown" class="dropdown-menu">
          <li class="dropdown-item" @click="handleTagSelect(null)">
            Tous les tags
          </li>
          <li
            v-for="tag in tags"
            :key="tag"
            class="dropdown-item"
            @click="handleTagSelect(tag)"
          >
            {{ tag }}
          </li>
        </ul>
      </div>

      <Button
        type="button"
        variant="secondary"
        size="small"
        @click="handleClear"
        :disabled="!localSearchTerm && !selectedCategory && !selectedTag"
      >
        Effacer
      </Button>
    </div>
  </div>
</template>

<style scoped>
.quiz-search-bar {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-md);
  align-items: center;
  margin-bottom: var(--space-lg);
}

.search-input-wrapper {
  position: relative;
  flex: 1;
  min-width: 200px;
}

.search-input {
  width: 100%;
  padding: var(--space-sm) var(--space-sm) var(--space-sm) 36px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-bg);
  color: var(--color-text);
  font-family: inherit;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px var(--color-primary-alpha);
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-secondary);
  pointer-events: none;
}

.filters {
  display: flex;
  gap: var(--space-sm);
  align-items: center;
}

.dropdown {
  position: relative;
}

.dropdown-toggle {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-bg);
  color: var(--color-text);
  font-family: inherit;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.dropdown-toggle:hover {
  border-color: var(--color-primary);
  background: var(--color-bg-hover);
}

.dropdown-arrow {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: var(--space-xs);
  padding: var(--space-xs) 0;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  list-style: none;
  margin: 0;
}

.dropdown-item {
  padding: var(--space-sm) var(--space-md);
  color: var(--color-text);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.dropdown-item:hover {
  background: var(--color-bg-hover);
  color: var(--color-primary);
}
</style>
