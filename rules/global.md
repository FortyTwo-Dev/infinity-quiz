# Global Rules

This file groups cross-cutting conventions: clean code principles, naming conventions, file organization, and TypeScript guidelines.

---

## Clean Code Rules

### General Principles
- SOLID: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion
- DRY: Extract reusable logic into functions, composables, or components
- KISS: Prefer simple solutions over complex ones
- YAGNI: Don't implement features until they are actually needed
- Boy Scout Rule: Leave the code cleaner than you found it

### Code Quality
- Readability first: Code should be easy to read and understand
- Meaningful names: Use descriptive, intention-revealing names
- Small functions: One thing per function, max ~20 lines
- Small files: Keep files focused and under ~300 lines when possible
- Avoid magic numbers/strings: Use named constants
- No hardcoded values: Configuration values should be extractable
- Consistent style: Follow project linting and formatting rules
- No comments for obvious code: Self-documenting code is preferred
- Error handling: Always handle potential errors gracefully
- Null checks: Use optional chaining (`?.`) and nullish coalescing (`??`) where appropriate

### Functions
- Use verbs for function names (e.g., `fetchQuiz`, `calculateScore`, `validateAnswer`)
- Limit to 3 parameters maximum. Use objects for more parameters
- Return early for guard clauses instead of nested conditions
- Prefer pure functions where possible

### Conditionals
- Avoid deep nesting (max 2-3 levels). Use early returns or extract functions
- Prefer positive conditions over negative when possible
- Use ternary operators for simple conditional assignments, not for complex logic

### Loops
- Prefer array methods (`map`, `filter`, `reduce`, `find`, `some`, `every`) over traditional loops
- Use `for...of` instead of `for` loops when iterating over arrays
- Avoid modifying arrays while iterating over them

---

## Naming Conventions

### General
- Use English for all names (variables, functions, files, etc.)
- Be descriptive and specific
- Avoid abbreviations unless widely known (e.g., `id`, `url`, `http`)

### Variables and Functions
| Type | Convention | Examples |
|------|------------|----------|
| Variables | camelCase | `currentQuestion`, `userScore`, `isLoading` |
| Functions | camelCase | `getQuizById()`, `calculateFinalScore()` |
| Constants | UPPER_SNAKE_CASE | `MAX_QUESTIONS`, `DEFAULT_TIMEOUT` |
| Boolean variables | Prefix with `is`, `has`, `can`, `should` | `isCompleted`, `hasStarted`, `canSubmit` |

### Classes and Types
| Type | Convention | Examples |
|------|------------|----------|
| Classes | PascalCase | `Quiz`, `Question`, `UserProfile` |
| Interfaces | PascalCase (prefix `I` optional) | `IQuiz`, `Question`, `QuizSettings` |
| Type Aliases | PascalCase | `QuizId`, `ScoreType`, `AnswerOption` |
| Enums | PascalCase | `QuizDifficulty`, `QuestionType` |
| Enum Members | UPPER_SNAKE_CASE | `EASY`, `MEDIUM`, `HARD` |

### Files and Directories
| Type | Convention | Examples |
|------|------------|----------|
| File names | kebab-case | `quiz-store.ts`, `question-utils.ts` |
| Vue components | PascalCase | `QuizCard.vue`, `QuestionList.vue` |
| Directory names | kebab-case | `components/`, `composables/`, `stores/` |
| Test files | `.spec.ts` or `.test.ts` | `quiz-store.spec.ts`, `QuestionItem.test.ts` |

### CSS and Styles
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

## File Organization

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
1. Export types first
2. Export constants
3. Export functions
4. Export default last (if applicable)

### File Size
- Keep files focused and small
- Split files when they exceed ~300-400 lines
- Group related functionality together

### Directory Depth
- Avoid deep nesting (max 3-4 levels)
- Use flat structure when possible
- Group by feature, not by type

---

## TypeScript Guidelines

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
- Views: Route-level components, handle page layout and routing
- Components: Reusable UI elements, should be stateless or receive state via props
- Composables: Reusable stateful logic, can use hooks and reactivity
- Stores: Global state management with Pinia
- Utils: Pure utility functions without side effects
- Types: All TypeScript interfaces and types

### Data Flow
```
User Action -> View -> (Dispatch Action) -> Store -> (State Change) -> Store -> (Reactive Update) -> View
                    ↓
              (or Composable Logic)
```

### Module Boundaries
- Each feature (e.g., quiz, user, settings) should have its own directory in `stores/`, `types/`, and potentially `utils/`
- Keep cross-module dependencies minimal
- Use composables to share logic between components
