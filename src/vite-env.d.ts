/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

/** Application version, injected at build time by Vite from package.json. */
declare const __APP_VERSION__: string

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const component: DefineComponent<unknown, unknown, any>
  export default component
}
