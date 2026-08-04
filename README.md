# Infinity Quiz

> A local-first quiz application built with Vue 3, Pinia, and Vite. All data is persisted in localStorage for a seamless offline experience.

## Features

### Current (MVP)
- Quiz list with local storage
- Quiz selection and question navigation
- Multiple choice questions
- Score tracking and results screen
- Restart and back to list functionality

### Roadmap
See [doc/2 - Roadmap.md](./doc/2%20-%20Roadmap.md) for the complete 6-phase development plan including timer, shuffling, quiz management, statistics, and multiplayer features.

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

See [doc/1 - Stack.md](./doc/1%20-%20Stack.md) for the full technical stack details.

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
# Run unit tests with Vitest
bun test:unit

# Run tests in watch mode
bun test:unit --watch
```

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
├── assets/                    # Static assets
├── components/               # Reusable Vue components
│   ├── common/               # Generic components (Button, Card, etc.)
│   └── quiz/                 # Quiz-specific components
├── composables/              # Vue composables
├── constants/                # Application constants
├── data/                     # Sample data and fixtures
├── router/                   # Vue Router configuration
├── stores/                   # Pinia stores
├── types/                    # TypeScript type definitions
├── utils/                    # Utility functions
├── views/                    # Page-level components (routes)
├── App.vue                   # Root component
└── main.ts                   # Application entry point

 tests/
├── composables/              # Composable tests
├── stores/                   # Store tests
└── utils/                    # Utility tests

doc/
├── 1 - Stack.md              # Technical stack documentation
├── 2 - Roadmap.md            # Development roadmap
├── 3 - Guidelines.md         # Coding standards and architecture
└── 4 - Git-Commits.md       # Git commit conventions
```

## Documentation

- [Coding Guidelines](./doc/3%20-%20Guidelines.md) - SOLID principles, naming conventions, architecture
- [Git Commit Conventions](./doc/4%20-%20Git-Commits.md) - Conventional Commits specification
- [Roadmap](./doc/2%20-%20Roadmap.md) - Feature development phases
- [Technical Stack](./doc/1%20-%20Stack.md) - Complete dependency list

## IDE Setup

### Recommended
- [VS Code](https://code.visualstudio.com/)
- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (disable Vetur)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

### Browser DevTools
- [Vue.js DevTools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) (Chrome/Edge)
- Enable Custom Object Formatter in DevTools settings

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default. We use:
- `vue-tsc` for type checking from the CLI
- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) in VS Code for IDE support

## Customize Configuration

See [Vite Configuration Reference](https://vite.dev/config/) for build configuration options.

## License

MIT License - see [LICENSE](LICENSE) file for details.
