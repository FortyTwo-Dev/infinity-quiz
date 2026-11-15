import { computed, onMounted, onUnmounted, ref, type Ref } from 'vue'
import type { ThemeColorName } from '../constants/themes'

export type { ThemeColorName } from '../constants/themes'

function readCssVar(name: string): string {
  if (typeof document === 'undefined') return ''
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

/**
 * Reactive CSS custom property of the theme. Re-reads whenever the mode or the
 * accent changes: the theme store writes both attributes, and an accent-only
 * change leaves the mode untouched.
 */
export function useCssVariable(name: string): Ref<string> {
  const value = ref(readCssVar(name))
  let observer: MutationObserver | null = null

  onMounted(() => {
    value.value = readCssVar(name)
    observer = new MutationObserver(() => {
      value.value = readCssVar(name)
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'data-accent'],
    })
  })

  onUnmounted(() => observer?.disconnect())

  return value
}

/** Reactive semantic colour of the theme package (e.g. `--it-accent`). */
export function useThemeColor(name: ThemeColorName): Ref<string> {
  return useCssVariable(`--it-${name}`)
}

/** Reactive box radius of the theme package (`--it-radius`), in pixels. */
export function useThemeRadius(): Ref<number> {
  const raw = useCssVariable('--it-radius')
  return computed(() => {
    const remIndex = raw.value.indexOf('rem')
    if (remIndex === -1) return 0
    const numberStr = raw.value.slice(0, remIndex).trim()
    const parsed = Number.parseFloat(numberStr)
    return Number.isNaN(parsed) ? 0 : Math.round(parsed * 16)
  })
}

/**
 * Append an alpha channel to an oklch colour the theme package publishes
 * (e.g. `oklch(54% 0.245 262.881)` → `oklch(54% 0.245 262.881 / 0.1)`).
 */
export function oklchWithAlpha(color: string, alpha: number): string {
  const trimmed = color.trim()
  const closingParen = trimmed.lastIndexOf(')')
  if (closingParen === -1) return trimmed

  const head = trimmed.slice(0, closingParen).trimEnd()
  if (head.includes('/')) {
    const slashIndex = head.lastIndexOf('/')
    return `${head.slice(0, slashIndex).trimEnd()} / ${alpha})`
  }
  return `${head} / ${alpha})`
}
