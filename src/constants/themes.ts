/** A semantic colour published by `@infinitylib/infinity-theme` (`--it-<name>`). */
export const THEME_COLOR_NAMES = [
  'fg',
  'surface',
  'surface-fg',
  'muted',
  'border',
  'accent',
  'accent-fg',
  'danger',
  'success',
  'warning',
  'info',
] as const
export type ThemeColorName = (typeof THEME_COLOR_NAMES)[number]

/**
 * A theme is a mode shipped by `@infinitylib/infinity-theme` and a brand accent
 * bound by the application (see `docs/decisions/ADR-002`). The two are
 * orthogonal: the mode picks the token set, the accent overrides `--it-accent`.
 */
export const THEME_MODES = ['light', 'dark'] as const
export type ThemeMode = (typeof THEME_MODES)[number]

export const THEME_ACCENTS = ['mint', 'fresh', 'emerald', 'green'] as const
export type ThemeAccent = (typeof THEME_ACCENTS)[number]

export interface ThemeSelection {
  mode: ThemeMode
  accent: ThemeAccent
}

export const DEFAULT_THEME: ThemeSelection = { mode: 'light', accent: 'green' }

/**
 * Theme names written by the daisyUI build. They are still in `localStorage` of
 * every existing install, so they are read for good, and never written again.
 */
export const LEGACY_THEME_NAMES: Record<string, ThemeSelection> = {
  'infinity-blue-light': { mode: 'light', accent: 'mint' },
  'infinity-blue-dark': { mode: 'dark', accent: 'mint' },
  'infinity-yellow-light': { mode: 'light', accent: 'fresh' },
  'infinity-yellow-dark': { mode: 'dark', accent: 'fresh' },
  'infinity-red-light': { mode: 'light', accent: 'emerald' },
  'infinity-red-dark': { mode: 'dark', accent: 'emerald' },
}

/** A selection as offered by a form select, serialized as `<mode>-<accent>`. */
export interface ThemeOption extends ThemeSelection {
  value: string
}

export const THEME_OPTIONS: ThemeOption[] = THEME_MODES.flatMap((mode) =>
  THEME_ACCENTS.map((accent) => ({ mode, accent, value: `${mode}-${accent}` })),
)
