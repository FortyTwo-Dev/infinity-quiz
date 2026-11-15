export interface Credit {
  name: string
  role: string
  license: string
  href: string
}

/** The project's public repository, offered from the settings screen. */
export const SOURCE_CODE_URL = 'https://github.com/FortyTwo-Dev/infinity-quiz'

/**
 * What the application is built with, and the licenses its typefaces carry.
 * A dependency leaves this list when it leaves `package.json`.
 */
export const CREDITS: readonly Credit[] = [
  {
    name: 'Vue.js',
    role: 'UI framework',
    license: 'MIT',
    href: 'https://vuejs.org',
  },
  {
    name: 'Vue Router',
    role: 'Client-side routing',
    license: 'MIT',
    href: 'https://router.vuejs.org',
  },
  {
    name: 'Pinia',
    role: 'State management',
    license: 'MIT',
    href: 'https://pinia.vuejs.org',
  },
  {
    name: 'Vite',
    role: 'Build tooling',
    license: 'MIT',
    href: 'https://vite.dev',
  },
  {
    name: 'Infinity Theme',
    role: 'Design tokens and component theme',
    license: 'MIT',
    href: 'https://github.com/InfinityLib/infinity-theme',
  },
  {
    name: 'Infinity Theme Vue',
    role: 'Vue wrappers over the theme',
    license: 'MIT',
    href: 'https://github.com/InfinityLib/infinity-theme-vue',
  },
  {
    name: 'Chart.js',
    role: 'Charts on the statistics screen',
    license: 'MIT',
    href: 'https://www.chartjs.org',
  },
  {
    name: 'Zod',
    role: 'Schema validation',
    license: 'MIT',
    href: 'https://zod.dev',
  },
  {
    name: 'Phosphor Icons',
    role: 'Icon set',
    license: 'MIT',
    href: 'https://phosphoricons.com',
  },
  {
    name: 'Space Grotesk',
    role: 'Default typeface',
    license: 'SIL Open Font License 1.1',
    href: 'https://github.com/floriankarsten/space-grotesk',
  },
  {
    name: 'OpenDyslexic',
    role: 'Optional reading typeface',
    license: 'Bitstream Vera license',
    href: 'https://github.com/antijingoist/open-dyslexic',
  },
]
