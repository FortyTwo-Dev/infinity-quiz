import { fileURLToPath, URL } from 'node:url'
import { readFileSync } from 'node:fs'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'

const packageJson = JSON.parse(
  readFileSync(fileURLToPath(new URL('./package.json', import.meta.url)), 'utf8'),
) as { version: string }

// https://vite.dev/config/
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(packageJson.version),
  },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // `<search>` is a native HTML element, but Vue's tag list predates it:
          // without this the compiler emits a `resolveComponent` call that fails
          // at runtime and warns on every mount.
          isCustomElement: (tag) => tag === 'search',
        },
      },
    }),
    vueDevTools(),
    // The application is local-first: the shell, the typefaces and the logo are
    // precached so it keeps working offline. The update is offered, never
    // applied behind the user's back (see docs/decisions/ADR-003).
    VitePWA({
      registerType: 'prompt',
      injectRegister: false,
      workbox: {
        globPatterns: ['**/*{js,css,html,ico,png,svg,woff,woff2,ttf}'],
      },
      manifest: {
        name: 'Infinity Quiz',
        short_name: 'IQuiz',
        description:
          'A local-first quiz application: a catalogue, a playable quiz with a timer and immediate feedback, a statistics screen, and a JSON format to share quizzes.',
        theme_color: '#00ff96',
        background_color: '#ffffff',
        lang: 'en',
        icons: [
          {
            src: '/img/logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: '/img/logo-mono.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'monochrome',
          },
          {
            src: '/favicon.ico',
            sizes: 'any',
            type: 'image/x-icon',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
