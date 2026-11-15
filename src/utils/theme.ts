import {
  DEFAULT_THEME,
  LEGACY_THEME_NAMES,
  THEME_ACCENTS,
  THEME_MODES,
  THEME_OPTIONS,
  type ThemeAccent,
  type ThemeMode,
  type ThemeSelection,
} from '../constants/themes'

function isThemeMode(value: unknown): value is ThemeMode {
  return typeof value === 'string' && (THEME_MODES as readonly string[]).includes(value)
}

function isThemeAccent(value: unknown): value is ThemeAccent {
  return typeof value === 'string' && (THEME_ACCENTS as readonly string[]).includes(value)
}

function readSelection(value: unknown): ThemeSelection | null {
  if (typeof value !== 'object' || value === null) return null
  const candidate = value as Record<string, unknown>
  if (!isThemeMode(candidate.mode) || !isThemeAccent(candidate.accent)) return null
  return { mode: candidate.mode, accent: candidate.accent }
}

/**
 * Convert anything a stored payload or an imported quiz can carry into a
 * selection: a legacy daisyUI name, an already normalized object, or a
 * `<mode>-<accent>` form value. Returns `null` for everything else.
 */
export function normalizeThemeSelection(value: unknown): ThemeSelection | null {
  if (typeof value === 'string') {
    const legacy = LEGACY_THEME_NAMES[value]
    if (legacy) return { ...legacy }
    const option = THEME_OPTIONS.find((candidate) => candidate.value === value)
    if (option) return { mode: option.mode, accent: option.accent }
  }
  return readSelection(value)
}

/**
 * A stored global theme always resolves: an unknown value, a removed imported
 * theme or a malformed entry falls back to the default instead of throwing.
 */
export function normalizeGlobalTheme(value: unknown): ThemeSelection {
  return normalizeThemeSelection(value) ?? { ...DEFAULT_THEME }
}

/**
 * A quiz theme is optional: an unknown stored value means "play this quiz with
 * the default theme", never "reject the quiz".
 */
export function normalizeQuizTheme(value: unknown): ThemeSelection | undefined {
  return normalizeThemeSelection(value) ?? undefined
}

/** Serialize a selection for a form select, `undefined` meaning "default". */
export function themeToOptionValue(selection: ThemeSelection | undefined): string | undefined {
  return selection ? `${selection.mode}-${selection.accent}` : undefined
}

function parseJson(raw: string | null): unknown {
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : {}
}

/**
 * Rewrite the persisted theme payload in the shape the store persists
 * (`{ globalTheme }`). Accepts the legacy `{ globalThemeName, importedThemes }`
 * payload, the current one, or garbage, and is idempotent.
 */
export function migrateThemeStorage(raw: string | null): string {
  const payload = asRecord(parseJson(raw))
  const selection = normalizeGlobalTheme(payload.globalTheme ?? payload.globalThemeName)
  return JSON.stringify({ globalTheme: selection })
}

/**
 * Rewrite the `theme` field of every stored quiz, leaving every other property
 * untouched. A value the theme package cannot resolve is dropped, not kept.
 * Returns `null` when the payload is not a catalogue.
 */
export function migrateQuizCatalogue(raw: string | null): string | null {
  const payload = asRecord(parseJson(raw))
  if (!Array.isArray(payload.quizzes)) return null

  const quizzes = payload.quizzes.map((quiz) => {
    const entry = asRecord(quiz)
    if (Object.keys(entry).length === 0) return quiz
    return { ...entry, theme: normalizeQuizTheme(entry.theme) }
  })

  return JSON.stringify({ ...payload, quizzes })
}
