export const THEME_COLORS = ['blue', 'yellow', 'red'] as const
export type ThemeColor = (typeof THEME_COLORS)[number]

export const THEME_VARIANTS = ['light', 'dark'] as const
export type ThemeVariant = (typeof THEME_VARIANTS)[number]

export const BUILT_IN_THEMES = THEME_COLORS.flatMap((color) =>
  THEME_VARIANTS.map((variant) => buildThemeName(color, variant)),
)

export const DEFAULT_THEME_NAME = 'infinity-blue-light'

export function buildThemeName(color: ThemeColor, variant: ThemeVariant): string {
  return `infinity-${color}-${variant}`
}

/** A valid daisyUI theme name (usable as `data-theme` and `name:`). */
export function isValidThemeName(name: string): boolean {
  return /^[A-Za-z0-9_-]+$/.test(name)
}
