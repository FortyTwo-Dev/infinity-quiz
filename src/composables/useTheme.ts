import { computed, onMounted, onUnmounted, ref, type Ref } from 'vue'

export type ThemeColorName =
  | 'primary'
  | 'primary-content'
  | 'secondary'
  | 'accent'
  | 'neutral'
  | 'neutral-content'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'base-100'
  | 'base-200'
  | 'base-300'
  | 'base-content'

function readCssVar(name: string): string {
  if (typeof document === 'undefined') return ''
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

/**
 * Reactive CSS custom property. Re-reads whenever the daisyUI theme changes
 * (the `data-theme` attribute is set by ThemeToggle).
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
      attributeFilter: ['data-theme'],
    })
  })

  onUnmounted(() => observer?.disconnect())

  return value
}

/** Reactive daisyUI theme color (e.g. `--color-primary`). */
export function useThemeColor(name: ThemeColorName): Ref<string> {
  return useCssVariable(`--color-${name}`)
}

/** Reactive daisyUI box radius (`--radius-box`), converted to pixels. */
export function useThemeRadius(): Ref<number> {
  const raw = useCssVariable('--radius-box')
  return computed(() => {
    const remIndex = raw.value.indexOf('rem')
    if (remIndex === -1) return 0
    const numberStr = raw.value.slice(0, remIndex).trim()
    const parsed = Number.parseFloat(numberStr)
    return Number.isNaN(parsed) ? 0 : Math.round(parsed * 16)
  })
}

/**
 * Append an alpha channel to a daisyUI oklch color (e.g.
 * `oklch(54% 0.245 262.881)` → `oklch(54% 0.245 262.881 / 0.1)`).
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
