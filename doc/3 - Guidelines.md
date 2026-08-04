# Guidelines

This document outlines the coding standards, naming conventions, and architectural decisions for the Infinity Quiz project to ensure consistency and maintainability.

---

## Table of Contents
1. [Clean Code Rules](#clean-code-rules)
2. [Naming Conventions](#naming-conventions)
3. [Project Architecture](#project-architecture)
4. [Vue.js Specific Guidelines](#vuejs-specific-guidelines)
5. [TypeScript Specific Guidelines](#typescript-specific-guidelines)
6. [Pinia Specific Guidelines](#pinia-specific-guidelines)
7. [Testing Guidelines](#testing-guidelines)
8. [File Organization](#file-organization)

---

## Clean Code Rules

### General Principles
- **SOLID Principles**: Follow Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion.
- **DRY (Don't Repeat Yourself)**: Extract reusable logic into functions, composables, or components.
- **KISS (Keep It Simple, Stupid)**: Prefer simple solutions over complex ones.
- **YAGNI (You Aren't Gonna Need It)**: Don't implement features until they are actually needed.
- **Boy Scout Rule**: Leave the code cleaner than you found it.

### Code Quality
- **Readability First**: Code should be easy to read and understand.
- **Meaningful Names**: Use descriptive, intention-revealing names for variables, functions, and classes.
- **Small Functions**: Functions should do one thing and be small (max ~20 lines).
- **Small Files**: Keep files focused and under ~300 lines when possible.
- **Avoid Magic Numbers/Strings**: Use named constants instead.
- **No Hardcoded Values**: Configuration values should be extractable.
- **Consistent Style**: Follow the project's linting and formatting rules.
- **No Comments for Obvious Code**: Self-documenting code is preferred. Use comments only for non-obvious logic or TODO items.
- **Error Handling**: Always handle potential errors gracefully.
- **Null Checks**: Use optional chaining (`?.`) and nullish coalescing (`??`) where appropriate.

### Functions
- Use verbs for function names (e.g., `fetchQuiz`, `calculateScore`, `validateAnswer`).
- Limit to 3 parameters maximum. Use objects for more parameters.
- Return early for guard clauses instead of nested conditions.
- Pure functions preferred where possible (same input = same output, no side effects).

### Conditionals
- Avoid deep nesting (max 2-3 levels). Use early returns or extract functions.
- Prefer positive conditions over negative when possible.
- Use ternary operators for simple conditional assignments, not for complex logic.
- Consider using polymorphism or strategy pattern for complex conditional logic.

### Loops
- Prefer array methods (`map`, `filter`, `reduce`, `find`, `some`, `every`) over traditional loops.
- Use `for...of` instead of `for` loops when iterating over arrays.
- Avoid modifying arrays while iterating over them.

---

## Naming Conventions

### General
- Use **English** for all names (variables, functions, files, etc.)
- Be **descriptive** and **specific**
- Avoid abbreviations unless widely known (e.g., `id`, `url`, `http`)

### Variables & Functions
| Type | Convention | Examples |
|------|------------|----------|
| Variables | camelCase | `currentQuestion`, `userScore`, `isLoading` |
| Functions | camelCase | `getQuizById()`, `calculateFinalScore()` |
| Constants | UPPER_SNAKE_CASE | `MAX_QUESTIONS`, `DEFAULT_TIMEOUT` |
| Boolean variables | Prefix with `is`, `has`, `can`, `should` | `isCompleted`, `hasStarted`, `canSubmit` |

### Classes & Types
| Type | Convention | Examples |
|------|------------|----------|
| Classes | PascalCase | `Quiz`, `Question`, `UserProfile` |
| Interfaces | PascalCase (prefix `I` optional) | `IQuiz`, `Question`, `QuizSettings` |
| Type Aliases | PascalCase | `QuizId`, `ScoreType`, `AnswerOption` |
| Enums | PascalCase | `QuizDifficulty`, `QuestionType` |
| Enum Members | UPPER_SNAKE_CASE | `EASY`, `MEDIUM`, `HARD` |

### Vue.js Specific
| Type | Convention | Examples |
|------|------------|----------|
| Components | PascalCase | `QuizCard.vue`, `ScoreDisplay.vue` |
| Single File Components | PascalCase with `.vue` | `QuestionItem.vue`, `ResultsSummary.vue` |
| Composables | camelCase, prefix with `use` | `useQuiz()`, `useTimer()`, `useLocalStorage()` |
| Props | camelCase | `questionText`, `currentIndex`, `isDisabled` |
| Emits | camelCase, verb-based | `submit`, `next`, `prev`, `complete` |
| Slots | kebab-case | `header`, `footer`, `question-content` |
| Refs | camelCase, suffix with `Ref` | `quizRef`, `scoreRef` |
| Computed | camelCase | `totalScore`, `formattedTime` |
| Watchers | camelCase | - |

### Files & Directories
| Type | Convention | Examples |
|------|------------|----------|
| File names | kebab-case | `quiz-store.ts`, `question-utils.ts` |
| Vue components | PascalCase | `QuizCard.vue`, `QuestionList.vue` |
| Directory names | kebab-case | `components/`, `composables/`, `stores/` |
| Test files | `.spec.ts` or `.test.ts` | `quiz-store.spec.ts`, `QuestionItem.test.ts` |

### CSS & Styles
| Type | Convention | Examples |
|------|------------|----------|
| CSS Classes | kebab-case | `.quiz-container`, `.question-card` |
| CSS Variables | kebab-case with `--` prefix | `--primary-color`, `--card-padding` |
| Utility Classes | kebab-case | `.text-center`, `.mt-4` |

### Pinia
| Type | Convention | Examples |
|------|------------|----------|
| Store files | kebab-case with `-store` suffix | `quiz-store.ts`, `user-store.ts` |
| Store names | camelCase, prefix with `use` | `useQuizStore()`, `useUserStore()` |
| State | camelCase | `currentQuiz`, `userScore` |
| Getters | camelCase | `getQuizById`, `getTotalScore` |
| Actions | camelCase, verb-based | `fetchQuiz`, `submitAnswer`, `resetQuiz` |

### Routes
| Type | Convention | Examples |
|------|------------|----------|
| Route names | kebab-case | `home`, `quiz-list`, `quiz-detail`, `results` |
| Route paths | kebab-case | `/`, `/quizzes`, `/quiz/:id`, `/results` |
| Dynamic segments | colon prefix | `:id`, `:quizId` |

---

## Project Architecture

### Directory Structure
```
src/
├── assets/                    # Static assets (images, fonts, etc.)
│   └── images/
├── components/               # Reusable Vue components
│   ├── common/               # Generic, app-wide components
│   │   ├── Button.vue
│   │   ├── Card.vue
│   │   ├── Modal.vue
│   │   └── LoadingSpinner.vue
│   └── quiz/                 # Quiz-specific components
│       ├── QuizCard.vue
│       ├── QuestionItem.vue
│       ├── AnswerOption.vue
│       └── ScoreDisplay.vue
├── composables/              # Vue composables
│   ├── useQuiz.ts
│   ├── useTimer.ts
│   ├── useLocalStorage.ts
│   └── useShuffle.ts
├── router/                   # Vue Router configuration
│   └── index.ts
├── stores/                   # Pinia stores
│   ├── quiz-store.ts
│   ├── user-store.ts
│   └── settings-store.ts
├── types/                    # TypeScript type definitions
│   ├── quiz.ts
│   ├── question.ts
│   ├── user.ts
│   └── index.ts
├── utils/                    # Utility functions
│   ├── quiz-utils.ts
│   ├── date-utils.ts
│   └── validation.ts
├── views/                    # Page-level components (routes)
│   ├── HomeView.vue
│   ├── QuizListView.vue
│   ├── QuizView.vue
│   └── ResultsView.vue
├── App.vue                   # Root component
└── main.ts                   # Application entry point
```

### Layer Separation
- **Views**: Route-level components, handle page layout and routing
- **Components**: Reusable UI elements, should be stateless or receive state via props
- **Composables**: Reusable stateful logic, can use hooks and reactivity
- **Stores**: Global state management with Pinia
- **Utils**: Pure utility functions without side effects
- **Types**: All TypeScript interfaces and types

### Data Flow
```
User Action → View → (Dispatch Action) → Store → (State Change) → Store → (Reactive Update) → View
                    ↓
              (or Composable Logic)
```

### Module Boundaries
- Each feature (e.g., quiz, user, settings) should have its own directory in `stores/`, `types/`, and potentially `utils/`
- Keep cross-module dependencies minimal
- Use composables to share logic between components

---

## Vue.js Specific Guidelines

### Component Structure
- Use `<script setup>` syntax (Composition API)
- Order sections: `<script setup>`, `<template>`, `<style>`
- Group related logic with comments in script section
- Use `defineProps`, `defineEmits`, `defineExpose` for type safety
- Avoid using `this` (Composition API only)

### Template
- Use kebab-case for HTML attributes
- Use camelCase for Vue directives (`v-on:click` or `@click`, not `@Click`)
- Use shorthand syntax for `v-on` (`@click` instead of `v-on:click`)
- Use shorthand syntax for `v-bind` (`:prop` instead of `v-bind:prop`)
- Limit template logic: move complex expressions to computed properties or methods
- Use `v-for` with `:key` attribute (prefer unique IDs)
- Use `v-if` for conditional rendering, `v-show` for display toggling
- Avoid `v-if` and `v-for` on the same element (use computed property to filter)

### Props
- Always define prop types with TypeScript
- Use `required: true` for mandatory props
- Provide default values for optional props
- Document props with JSDoc comments for complex components
- Use `withDefaults` for default prop values in `<script setup>`

### Events
- Emit events for parent-child communication
- Use descriptive event names (verbs)
- Document emitted events
- Avoid emitting too many events from a single component

### Slots
- Use slots for content distribution
- Name slots descriptively
- Provide fallback content when possible
- Use scoped slots for passing data to slot content

### Lifecycle Hooks
- Use `onMounted`, `onUpdated`, `onUnmounted` from `vue`
- Clean up resources in `onUnmounted` (timers, subscriptions, event listeners)
- Avoid side effects in `onCreated`/`setup()`

### Reactivity
- Use `ref` for primitive values
- Use `reactive` for objects
- Use `computed` for derived state
- Use `watch` and `watchEffect` sparingly
- Prefer `computed` over `watch` when possible

---

## TypeScript Specific Guidelines

### Type Annotations
- Always annotate function return types
- Annotate function parameters when type is not obvious
- Use type inference for variables when type is obvious
- Don't use `any` - use `unknown` instead and narrow with type guards
- Use `never` for values that should never occur

### Interfaces vs Types
- Use `interface` for object shapes and class implementations
- Use `type` for unions, intersections, tuples, and mapped types
- Prefer `interface` for public APIs and props

### Generics
- Use descriptive generic parameter names (`T`, `K`, `V` only for simple cases)
- Document generic constraints
- Consider utility types (`Partial<T>`, `Pick<T, K>`, `Omit<T, K>`)

### Type Utilities
- Use `readonly` for immutable arrays and objects
- Use `as const` for literal type inference
- Use type assertions (`as`) sparingly, prefer type narrowing
- Use `satisfies` operator for type checking without widening

### Enums
- Use string enums for serializable values
- Use const object pattern for simple string constants
- Prefer union types for simple sets of constants

---

## Pinia Specific Guidelines

### Store Structure
- One store per domain/feature
- Keep stores focused and single-purpose
- Split large stores into smaller, related stores
- Use composition pattern for complex store logic

### State
- State should be immutable (use functions to modify state)
- Initialize state with proper types
- Use `ref` or `reactive` for state properties
- Persist state with `pinia-plugin-persistedstate` when needed

### Getters
- Use for derived/computed state
- Memoized automatically (like computed)
- Keep simple and pure
- Can accept parameters

### Actions
- Use for async operations and complex logic
- Can commit multiple state mutations
- Should be testable in isolation
- Return promises for async actions

### Persistence
- Use `pinia-plugin-persistedstate` with `persist: true` option
- Specify which state to persist in `persist` configuration
- Use custom storage keys for clarity
- Consider migration strategies for breaking changes

Example store with persistence:
```typescript
import { defineStore } from 'pinia'

export const useQuizStore = defineStore('quiz', {
  state: () => ({
    quizzes: [] as Quiz[],
    currentQuizId: null as string | null,
  }),
  persist: {
    enabled: true,
    strategies: [{ storage: localStorage, paths: ['quizzes'] }],
  },
  // ...getters and actions
})
```

---

## Testing Guidelines

### General
- Test behavior, not implementation
- Each test should test one thing
- Tests should be isolated and repeatable
- Use descriptive test names
- Avoid test interdependence

### File Naming
- Co-locate tests with source files when possible
- Use `.spec.ts` for unit tests
- Use `.test.ts` for integration tests

### Test Structure
- Use `describe` to group related tests
- Use `it` or `test` for individual test cases
- Follow Arrange-Act-Assert pattern

### Vue Component Testing
- Use `@vue/test-utils`
- Test props, events, and rendering
- Use `mount` for full component rendering
- Use `shallowMount` for isolated unit testing
- Mock dependencies when testing in isolation

### Pinia Testing
- Test stores independently
- Mock API calls and external dependencies
- Test actions with mocked state
- Test getters with various state combinations

### Coverage
- Aim for 80%+ coverage for critical paths
- 100% coverage is not required, but test all important logic
- Review coverage reports regularly

---

## File Organization Guidelines

### Imports
- Group imports by type: external, internal, relative
- Use absolute imports with `@/` alias
- Order imports alphabetically within groups
- Place type-only imports in separate `type` statements

Example:
```typescript
// External dependencies
import { ref } from 'vue'
import { defineStore } from 'pinia'

// Internal types
import type { Quiz } from '@/types/quiz'

// Relative imports
import { useTimer } from '@/composables/useTimer'
```

### Export Order
- Export types first
- Export constants
- Export functions
- Export default last (if applicable)

### File Size
- Keep files focused and small
- Split files when they exceed ~300-400 lines
- Group related functionality together

### Directory Depth
- Avoid deep nesting (max 3-4 levels)
- Use flat structure when possible
- Group by feature, not by type

---

## Commit Guidelines

- Use conventional commits format: `type(scope): message`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`
- Keep commits small and focused
- Write descriptive commit messages
- Reference issues when applicable

---

## Code Review Guidelines

- Review for adherence to these guidelines
- Check for potential bugs and edge cases
- Verify type safety
- Ensure proper error handling
- Confirm tests are adequate
- Check for performance issues
- Suggest improvements for readability and maintainability
