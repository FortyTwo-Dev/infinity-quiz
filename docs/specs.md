# Stack

## Runtime & Package Manager

| Tool | Version | Purpose |
|------|---------|---------|
| [Bun](https://bun.sh/) | >=1.4.0 | JavaScript runtime, package manager, bundler, and test runner |

## Framework & Core Libraries

| Tool | Version | Purpose |
|------|---------|---------|
| [Vue](https://vuejs.org/) | ^3.5.40 | Progressive JavaScript framework |
| [TypeScript](https://www.typescriptlang.org/) | ~6.0.0 | Type-safe JavaScript superset |
| [Pinia](https://pinia.vuejs.org/) | ^4.0.2 | State management library for Vue |
| [pinia-plugin-persistedstate](https://prazdevs.github.io/pinia-plugin-persistedstate/) | ^4.7.1 | Pinia plugin for localStorage/sessionStorage persistence |
| [Vue Router](https://router.vuejs.org/) | ^5.2.0 | Official router for Vue.js |

## Build Toolchain

| Tool | Version | Purpose |
|------|---------|---------|
| [Vite](https://vitejs.dev/) | ^8.1.5 | Next-generation frontend tooling |
| [@vitejs/plugin-vue](https://github.com/vitejs/vite-plugin-vue) | ^6.0.8 | Vite plugin for Vue single-file components |
| [vite-plugin-vue-devtools](https://github.com/vue-devtools/vite-plugin-vue-devtools) | ^8.1.5 | Vue DevTools integration for Vite |
| [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) | 2.0.0 | Service worker, precache and web manifest at build time |

## Testing

| Tool | Version | Purpose |
|------|---------|---------|
| [Vitest](https://vitest.dev/) | ^4.1.10 | Vite-native test framework, run on the Bun runtime (`bun run --bun vitest`) |
| [@vue/test-utils](https://test-utils.vuejs.org/) | ^2.4.11 | Vue-specific testing utilities |
| [jsdom](https://github.com/jsdom/jsdom) | ^29.1.1 | DOM implementation for Node.js |
| [@types/jsdom](https://www.npmjs.com/package/@types/jsdom) | ^28.0.3 | TypeScript types for jsdom |
| [@vitest/coverage-v8](https://vitest.dev/guide/coverage) | 4.1.10 | V8 coverage provider, gated on the `lines: 80` threshold |

> Requires Bun >= 1.4. Bun's test runner cannot compile `.vue` single-file components, so Vitest is used as the test runner on top of the Bun runtime. `zod` is inlined in `vitest.config.ts` to work around a Bun `__esModule` interop bug (oven-sh/bun#3393).

## Linting & Formatting

| Tool | Version | Purpose |
|------|---------|---------|
| [ESLint](https://eslint.org/) | ^10.7.0 | JavaScript/TypeScript linter |
| [@vue/eslint-config-typescript](https://github.com/vuejs/eslint-config) | ^14.9.0 | Vue-specific ESLint config for TypeScript |
| [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier) | ^10.1.8 | ESLint config to disable formatting rules that Prettier handles |
| [eslint-plugin-vue](https://eslint.vuejs.org/) | ~10.9.2 | ESLint plugin for Vue files |
| [eslint-plugin-oxlint](https://github.com/oxc-project/eslint-plugin-oxlint) | ~1.73.0 | ESLint plugin for Oxlint rules |
| [@vitest/eslint-plugin](https://github.com/vitest-dev/eslint-plugin) | ^1.6.23 | ESLint plugin for Vitest |
| [vue-eslint-parser](https://github.com/vuejs/vue-eslint-parser) | ^10.4.1 | ESLint custom parser for Vue files |
| [Oxlint](https://oxc.rs/) | ~1.74.0 | Fast JavaScript/TypeScript linter written in Rust |
| [Prettier](https://prettier.io/) | 3.9.5 | Code formatter |

## TypeScript Configuration

| Tool | Version | Purpose |
|------|---------|---------|
| [@vue/tsconfig](https://github.com/vuejs/tsconfig) | ^0.9.1 | Recommended TypeScript configs for Vue |
| [@tsconfig/node24](https://github.com/tsconfig/bases) | ^24.0.4 | TypeScript base config for Node 24 |
| [@types/node](https://www.npmjs.com/package/@types/node) | ^24.13.3 | TypeScript types for Node.js |
| [vue-tsc](https://github.com/vuejs/language-tools) | ^3.3.7 | Vue's TypeScript compiler |

## Utilities

| Tool | Version | Purpose |
|------|---------|---------|
| [npm-run-all2](https://github.com/mysticatea/npm-run-all2) | ^9.0.2 | Run multiple npm scripts in parallel or sequential |
| [jiti](https://github.com/unjs/jiti) | ^2.7.0 | Runtime TypeScript transpiler |
| [uuid](https://github.com/uuidjs/uuid) | ^14.0.1 | Identifier generation for quizzes, questions and attempts |
| [seedrandom](https://github.com/davidbau/seedrandom) | ^3.0.5 | Seeded generator behind the reproducible shuffle |

## Charts

| Tool | Version | Purpose |
|------|---------|---------|
| [chart.js](https://www.chartjs.org/) | ^4.5.1 | Charting library the statistics screen draws with |
| [vue-chartjs](https://vue-chartjs.org/) | ^5.3.4 | Vue 3 wrapper around chart.js |

## Validation

| Tool | Version | Purpose |
|------|---------|---------|
| [Zod](https://zod.dev/) | ^4.4.3 | Type-safe schema validation for quiz data structures |
| [vee-validate](https://vee-validate.logaretm.com/) | ^4.15.1 | Form state and validation driver |
| [@vee-validate/zod](https://vee-validate.logaretm.com/v4/integrations/zod.html) | ^4.15.1 | Form validation with Zod integration for Vue.js |


## Styling

| Tool | Version | Purpose |
|------|---------|---------|
| [@infinitylib/infinity-theme](https://github.com/InfinityLib/infinity-theme) | ^0.2.0 | CSS-first design tokens and component theme |
| [@infinitylib/infinity-theme-vue](https://github.com/InfinityLib/infinity-theme-vue) | ^0.1.0 | Vue wrappers over the theme's component classes |

## Icons

| Tool | Version | Purpose |
|------|---------|---------|
| [@phosphor-icons/vue](https://github.com/phosphor-icons/vue) | ^2.2.1 | Flexible icon library for Vue 3 |

## Runtime Compatibility

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | ^22.18.0 \| >=24.12.0 | JavaScript runtime (as defined in package.json engines) |
| Bun | >=1.4.0 | JavaScript runtime and package manager; required to run the test suite |

---

*All versions are as specified in `package.json` unless noted otherwise.*
