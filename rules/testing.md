# Testing Strategy

This file groups testing rules and best practices for unit and integration tests.

---

## General Principles

- Test behavior, not implementation
- Each test should test one thing
- Tests should be isolated and repeatable
- Use descriptive test names
- Avoid test interdependence

---

## File Organization

### Naming
- Co-locate tests with source files when possible
- Use `.spec.ts` for unit tests
- Use `.test.ts` for integration tests

Examples:
```
src/
├── components/
│   └── QuizCard.vue
│   └── QuizCard.spec.ts
├── stores/
│   └── quiz-store.ts
│   └── quiz-store.spec.ts
```

---

## Test Structure

- Use `describe` to group related tests
- Use `it` or `test` for individual test cases
- Follow Arrange-Act-Assert pattern

Example with Vitest:
```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import QuizCard from '@/components/QuizCard.vue'

describe('QuizCard', () => {
  it('renders the question text', () => {
    const props = { questionText: 'What is the capital of France?' }
    const wrapper = mount(QuizCard, { props })
    expect(wrapper.text()).toContain('What is the capital of France?')
  })
})
```

---

## Vue Component Testing

### Tools
Use `@vue/test-utils` for Vue component testing.
Test: props, events, rendering, and behavior.

### Mounting Components
- Use `mount` for full component rendering
- Use `shallowMount` for isolated unit testing (child components not rendered)
- Mock dependencies when testing in isolation

Example:
```typescript
import { mount, shallowMount } from '@vue/test-utils'

// Full rendering
it('renders child components', () => {
  const wrapper = mount(ParentComponent)
  expect(wrapper.find(ChildComponent).exists()).toBe(true)
})

// Isolated unit test
it('renders without child components', () => {
  const wrapper = shallowMount(ParentComponent)
  expect(wrapper.find(ChildComponent).exists()).toBe(false)
})
```

---

## Pinia Store Testing

- Test stores independently
- Mock API calls and external dependencies
- Test actions with mocked state
- Test getters with various state combinations

Example:
```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useQuizStore } from '@/stores/quiz-store'

describe('useQuizStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })
  
  it('fetches quizzes successfully', async () => {
    const store = useQuizStore()
    const mockQuizzes = [{ id: '1', title: 'Test Quiz' }]
    
    // Mock API
    vi.mock('@/api/quiz', () => ({
      getQuizzes: vi.fn().mockResolvedValue({ data: mockQuizzes })
    }))
    
    await store.fetchQuizzesAsync()
    
    expect(store.quizzes).toEqual(mockQuizzes)
    expect(store.isLoading).toBe(false)
  })
})
```

---

## Coverage

- Target: 80%+ coverage for critical paths
- 100% coverage not required, but test all important logic
- Review coverage reports regularly

Run tests with coverage:
```bash
bun test:coverage
```

---

## Tips

### Mocking
- Mock external dependencies (API, localStorage, etc.)
- Use `vi.mock()` with Vitest
- Create realistic mocks that simulate actual behavior

### Parameterized Tests
Use `it.each` to test multiple cases with same assertions:
```typescript
it.each([
  { input: 1, expected: 2 },
  { input: 2, expected: 4 },
])('doubles the input', ({ input, expected }) => {
  expect(double(input)).toBe(expected)
})
```

---

## Pre-push Checklist

- All unit tests pass
- All integration tests pass
- Coverage is acceptable (>80% for critical paths)
- Mocks are up to date
- Snapshots are validated
