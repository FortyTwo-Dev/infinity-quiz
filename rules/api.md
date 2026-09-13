# API Conventions

This file groups API call rules: configuration, error handling, typing, and best practices.

---

## Basic Configuration

Typical structure:
```
src/
├── api/
│   ├── index.ts           # Main export and Axios configuration
│   ├── quiz.ts           # Quiz-specific API calls
│   ├── user.ts           # User-specific API calls
│   └── types/            # Shared types for API responses
```

Axios configuration (src/api/index.ts):
```typescript
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor (add auth token)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// Response interceptor (handle global errors)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
```

---

## Naming

| Type | Convention | Examples |
|------|------------|----------|
| Files | Named after domain | `quiz.ts`, `user.ts`, `auth.ts` |
| Functions | Verb + domain | `fetchQuizzes`, `createUser`, `deleteQuiz` |
| Suffixes | Add `Async` for async functions (optional but recommended) | `fetchQuizzesAsync` |

Examples:
```typescript
// src/api/quiz.ts
export async function fetchQuizzesAsync() { ... }
export async function fetchQuizByIdAsync(id: string) { ... }
export async function createQuizAsync(quiz: Quiz) { ... }
export async function updateQuizAsync(id: string, quiz: Partial<Quiz>) { ... }
export async function deleteQuizAsync(id: string) { ... }
```

---

## Best Practices

### Type Requests and Responses
- Always type parameters and returns
- Use interfaces for response shapes
- Validate data with Zod or similar validator

```typescript
import { z } from 'zod'

const QuizSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  questions: z.array(QuestionSchema),
})

type Quiz = z.infer<typeof QuizSchema>

async function fetchQuizByIdAsync(id: string): Promise<Quiz> {
  const response = await api.get(`/quizzes/${id}`)
  return QuizSchema.parse(response.data)
}
```

### Error Handling
- Never silently ignore errors
- Always propagate or handle errors
- Use custom error classes for API errors

```typescript
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly message: string,
    public readonly data?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function fetchQuizByIdAsync(id: string): Promise<Quiz> {
  try {
    const response = await api.get(`/quizzes/${id}`)
    return QuizSchema.parse(response.data)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new ApiError(
        error.response?.status || 500,
        error.response?.data?.message || 'Unknown error',
        error.response?.data
      )
    }
    throw error
  }
}
```

### Endpoint Constants
- Use constants for endpoint paths
- Avoid magic strings

```typescript
// src/api/endpoints.ts
export const QUIZ_ENDPOINTS = {
  BASE: '/quizzes',
  BY_ID: (id: string) => `/quizzes/${id}`,
  CREATE: '/quizzes',
  UPDATE: (id: string) => `/quizzes/${id}`,
  DELETE: (id: string) => `/quizzes/${id}`,
} as const

async function fetchQuizByIdAsync(id: string): Promise<Quiz> {
  const response = await api.get(QUIZ_ENDPOINTS.BY_ID(id))
  return QuizSchema.parse(response.data)
}
```

### Pagination
- Standardize pagination format
- Always return pagination metadata

```typescript
interface PaginatedResponse<T> {
  data: T[]
  meta: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }
}

async function fetchQuizzesAsync(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Quiz>> {
  const response = await api.get('/quizzes', {
    params: { page, limit }
  })
  return PaginatedResponseSchema.parse(response.data)
}
```

---

## Avoid

- Direct API calls from components - always use API functions
- Silent error handling - always propagate or handle errors
- Untyped responses - always type returns
- Magic strings for URLs - use constants
- Hardcoded auth tokens - use localStorage or dedicated store
- Requests without timeout - always configure timeout

---

## Integration with Stores

Stores should use API functions, never call axios directly.

```typescript
// src/stores/quiz-store.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchQuizzesAsync, fetchQuizByIdAsync } from '@/api/quiz'

export const useQuizStore = defineStore('quiz', () => {
  const quizzes = ref<Quiz[]>([])
  const currentQuiz = ref<Quiz | null>(null)
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  async function loadQuizzesAsync() {
    isLoading.value = true
    error.value = null
    try {
      quizzes.value = await fetchQuizzesAsync()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load quizzes'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    quizzes,
    currentQuiz,
    isLoading,
    error,
    loadQuizzesAsync,
  }
})
```

Resources: [Axios Documentation](https://axios-http.com/docs/intro), [Zod Documentation](https://zod.dev/)
