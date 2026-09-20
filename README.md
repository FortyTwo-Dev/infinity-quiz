# Infinity Quiz

> A local-first quiz application built with Vue 3, Pinia, and Vite. All data is persisted in localStorage for a seamless offline experience.

## Features

### Current (Phase 2 - Enhanced Quiz Experience)
- Quiz list with local storage
- Quiz selection and question navigation
- Multiple choice questions
- Score tracking and results screen
- Restart and back to list functionality
- Timer with optional time limit per quiz
- Progress bar for completion percentage
- Question and answer shuffling
- Skip question functionality
- Review mode at quiz end
- Correct answer highlighting
- Immediate feedback on selection

### Roadmap
See [docs/roadmap.md](./docs/roadmap.md) for the complete 6-phase development plan including timer, shuffling, quiz management, statistics, and multiplayer features.

## Tech Stack

| Category | Tools |
|----------|-------|
| **Runtime** | Bun 1.3.14 |
| **Framework** | Vue 3.5.40 |
| **Language** | TypeScript 6.0 |
| **State Management** | Pinia 4.0.2 + pinia-plugin-persistedstate |
| **Router** | Vue Router 5.2.0 |
| **Build Tool** | Vite 8.1.5 |
| **Testing** | Vitest 4.1.10, @vue/test-utils 2.4.11 |
| **Linting** | ESLint 10.7.0, Oxlint 1.74.0 |
| **Formatting** | Prettier 3.9.5 |
| **Icons** | [Phosphor Icons](https://phosphoricons.com/) |

See [docs/specs.md](./docs/specs.md) for the full technical stack details.

## Project Setup

```sh
# Install dependencies
bun install
```

### Development

```sh
# Start development server
bun dev

# Development server with custom port
bun dev --port 3000
```

### Build

```sh
# Type-check, compile and minify for production
bun run build

# Preview production build locally
bun preview
```

### Testing

```sh
# Run unit tests (Vitest on the Bun runtime)
bun test:unit

# Run tests once with coverage
bun test:coverage

# Watch mode
bun test:unit --watch
```

> Tests require Bun >= 1.4. Vitest runs on the Bun runtime via `bun run --bun vitest`.

### Linting & Formatting

```sh
# Run all linters
bun lint

# Run Oxlint (fast Rust-based linter)
bun lint:oxlint

# Run ESLint
bun lint:eslint

# Format code with Prettier
bun format
```

## Project Structure

```
src/
├── assets/                   # Static assets
│   └── styles/               # CSS variables and global styles
├── components/               # Reusable Vue components
│   ├── common/               # Generic components (Button, Card, ProgressBar, etc.)
│   └── quiz/                 # Quiz-specific components (FeedbackCard, QuestionReviewCard)
├── composables/              # Vue composables
│   ├── useFeedback.ts        # Feedback messages and levels
│   ├── useQuiz.ts            # Quiz session logic
│   ├── useResults.ts         # Results screen logic
│   ├── useScore.ts           # Score calculation utilities
│   └── useTimer.ts           # Timer functionality
├── constants/                # Application constants
├── data/                     # Sample data and fixtures
├── __tests__/                # Unit tests
│   ├── composables/          # Composable tests
│   ├── stores/               # Store tests
│   └── utils/                # Utility tests
├── router/                   # Vue Router configuration
├── stores/                   # Pinia stores
│   └── quiz/                 # Quiz-related stores
│       ├── quiz-store.ts         # Quiz CRUD operations
│       ├── quiz-session-store.ts # Quiz session management
│       ├── quiz-timer-store.ts   # Timer store
│       └── quiz-verification-store.ts # Answer verification
├── types/                    # TypeScript type definitions
├── utils/                    # Utility functions
├── views/                    # Page-level components (routes)
│   ├── QuizListView.vue      # Quiz selection
│   ├── QuizView.vue          # Quiz taking interface
│   └── ResultsView.vue       # Results display
├── App.vue                   # Root component
└── main.ts                   # Application entry point

docs/
├── decisions/
│   └── TEMPLATE.md          # ADR template
├── quiz-format.md           # Quiz data format specification
├── roadmap.md               # Development roadmap
├── specs.md                 # Technical stack documentation
└── workflow.md              # Git workflow and conventions


## Documentation

- [Technical Stack](./docs/specs.md) - Complete dependency list
- [Roadmap](./docs/roadmap.md) - Feature development phases
- [Workflow](./docs/workflow.md) - Git workflow, commits, PR, code review
- [Quiz Format](./docs/quiz-format.md) - Quiz data format specification
- [Coding Rules](./rules/) - All coding conventions and guidelines

## IDE Setup

### Recommended
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

### Browser DevTools
- [Vue.js DevTools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
- Enable Custom Object Formatter in DevTools settings

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default. We use:
- `src/vite-env.d.ts` with `declare module '*.vue'` for type declarations
- `vue-tsc` for type checking from the CLI

## Customize Configuration

See [Vite Configuration Reference](https://vite.dev/config/) for build configuration options.

## License

MIT License - see [LICENSE](LICENSE) file for details.

---

Powered by Mistral Vibe. Created by FortyTwo_Dev.
