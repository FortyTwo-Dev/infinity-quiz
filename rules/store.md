# Pinia Conventions

This file groups Pinia-specific rules: store structure, state, getters, actions, and persistence.

---

## Store Structure

- One store per domain/feature
- Keep stores focused and single-purpose
- Split large stores into smaller, related stores
- Use composition pattern for complex store logic

---

## State

- State should be immutable (use functions to modify state)
- Initialize state with proper types
- Use `ref` or `reactive` for state properties
- Persist state with `pinia-plugin-persistedstate` when needed

Example:
```typescript
import { defineStore } from 'pinia'
import { ref } from 'vue'

interface QuizState {
  quizzes: Quiz[]
  currentQuizId: string | null
  isLoading: boolean
}

export const useQuizStore = defineStore('quiz', () => {
  const quizzes = ref<Quiz[]>([])
  const currentQuizId = ref<string | null>(null)
  const isLoading = ref<boolean>(false)
  
  return { quizzes, currentQuizId, isLoading }
})
```

---

## Getters

- Use for derived/computed state
- Memoized automatically (like computed)
- Keep getters simple and pure
- Can accept parameters

Example:
```typescript
import { defineStore } from 'pinia'
import { computed } from 'vue'

export const useQuizStore = defineStore('quiz', () => {
  const quizzes = ref<Quiz[]>([])
  
  const getQuizById = computed(() => (id: string) => {
    return quizzes.value.find(quiz => quiz.id === id)
  })
  
  const totalQuizzes = computed(() => quizzes.value.length)
  
  return { quizzes, getQuizById, totalQuizzes }
})
```

---

## Actions

- Use for async operations and complex logic
- Can commit multiple state mutations
- Should be testable in isolation
- Return promises for async actions

Example:
```typescript
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useQuizStore = defineStore('quiz', () => {
  const quizzes = ref<Quiz[]>([])
  const isLoading = ref<boolean>(false)
  
  async function fetchQuizzesAsync() {
    isLoading.value = true
    try {
      const response = await api.getQuizzes()
      quizzes.value = response.data
    } catch (error) {
      // Handle error
      console.error('Failed to fetch quizzes:', error)
    } finally {
      isLoading.value = false
    }
  }
  
  function reset() {
    quizzes.value = []
    currentQuizId.value = null
  }
  
  return { quizzes, isLoading, fetchQuizzesAsync, reset }
})
```

---

## Persistence

Use `pinia-plugin-persistedstate` to persist state to localStorage/sessionStorage.

### Configuration
- Specify which state to persist using the `pick` option
- Use `omit` to exclude specific properties from persistence
- Use custom storage keys for clarity
- Consider migration strategies for breaking changes

Example:
```typescript
import { defineStore } from 'pinia'

export const useQuizStore = defineStore('quiz', {
  state: () => ({
    quizzes: [] as Quiz[],
    currentQuizId: null as string | null,
    userPreferences: {} as UserPreferences,
  }),
  persist: {
    pick: ['quizzes', 'userPreferences'],
  },
})
```

Resources: [pinia-plugin-persistedstate Configuration Guide](https://prazdevs.github.io/pinia-plugin-persistedstate/guide/config.html)
