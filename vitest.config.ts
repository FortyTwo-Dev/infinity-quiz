import { fileURLToPath } from 'node:url'
import { defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

export default defineConfig({
  ...viteConfig,
  test: {
    environment: 'jsdom',
    exclude: [...configDefaults.exclude, 'e2e/**', '**/App.spec.ts'],
    root: fileURLToPath(new URL('./', import.meta.url)),
    // Bun's runtime exposes a phantom `__esModule` annotation, which breaks
    // Vitest's ESM/CJS interop for packages like zod (named imports resolve to
    // undefined). Inlining zod keeps it inside Vitest's pipeline instead.
    // See https://github.com/oven-sh/bun/issues/3393
    server: {
      deps: {
        inline: ['zod'],
      },
    },
    coverage: {
      // `lcov` is required by the SonarQube analysis; `text` for local feedback.
      reporter: ['text', 'lcov'],
      thresholds: {
        lines: 80,
      },
    },
  },
})
