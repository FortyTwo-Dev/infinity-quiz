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
    const match = raw.value.match(/([\d.]+)rem/)
    return match ? Math.round(parseFloat(match[1]!) * 16) : 0
  })
}

/**
 * Append an alpha channel to a daisyUI oklch color (e.g.
 * `oklch(54% 0.245 262.881)` → `oklch(54% 0.245 262.881 / 0.1)`).
 */
export function oklchWithAlpha(color: string, alpha: number): string {
  const trimmed = color.trim()
  if (trimmed.includes('/')) {
    return trimmed.replace(/\s*\/\s*[\d.]+\)$/, ` / ${alpha})`)
  }
  return trimmed.replace(/\)$/, ` / ${alpha})`)
}
