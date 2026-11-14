import { describe, it, expect } from 'vitest'
import {
  migrateQuizCatalogue,
  migrateThemeStorage,
  normalizeGlobalTheme,
  normalizeQuizTheme,
  normalizeThemeSelection,
  themeToOptionValue,
} from '../../utils/theme'

describe('normalizeThemeSelection', () => {
  it('converts every legacy daisyUI theme name', () => {
    expect(normalizeThemeSelection('infinity-blue-light')).toEqual({
      mode: 'light',
      accent: 'green',
    })
    expect(normalizeThemeSelection('infinity-blue-dark')).toEqual({ mode: 'dark', accent: 'green' })
    expect(normalizeThemeSelection('infinity-yellow-light')).toEqual({
      mode: 'light',
      accent: 'green',
    })
    expect(normalizeThemeSelection('infinity-yellow-dark')).toEqual({
      mode: 'dark',
      accent: 'green',
    })
    expect(normalizeThemeSelection('infinity-red-light')).toEqual({ mode: 'light', accent: 'green' })
    expect(normalizeThemeSelection('infinity-red-dark')).toEqual({ mode: 'dark', accent: 'green' })
  })

  it('converts a form option value', () => {
    expect(normalizeThemeSelection('dark-green')).toEqual({ mode: 'dark', accent: 'green' })
  })

  it('accepts an already normalized selection', () => {
    expect(normalizeThemeSelection({ mode: 'dark', accent: 'green' })).toEqual({
      mode: 'dark',
      accent: 'green',
    })
  })

  it('rejects an unknown name, a malformed object and a non-string', () => {
    expect(normalizeThemeSelection('mytheme')).toBeNull()
    expect(normalizeThemeSelection('')).toBeNull()
    expect(normalizeThemeSelection({ mode: 'dark' })).toBeNull()
    expect(normalizeThemeSelection({ mode: 'dark', accent: 'violet' })).toBeNull()
    expect(normalizeThemeSelection(null)).toBeNull()
    expect(normalizeThemeSelection(undefined)).toBeNull()
    expect(normalizeThemeSelection(42)).toBeNull()
  })
})

describe('normalizeGlobalTheme', () => {
  it('keeps a valid selection', () => {
    expect(normalizeGlobalTheme('infinity-red-dark')).toEqual({ mode: 'dark', accent: 'green' })
  })

  it('falls back to the default for anything else', () => {
    expect(normalizeGlobalTheme('imported-theme')).toEqual({ mode: 'light', accent: 'green' })
    expect(normalizeGlobalTheme(undefined)).toEqual({ mode: 'light', accent: 'green' })
    expect(normalizeGlobalTheme({ mode: 'sepia', accent: 'green' })).toEqual({
      mode: 'light',
      accent: 'green',
    })
  })
})

describe('normalizeQuizTheme', () => {
  it('returns undefined for a missing or unknown value', () => {
    expect(normalizeQuizTheme(undefined)).toBeUndefined()
    expect(normalizeQuizTheme('removed-theme')).toBeUndefined()
    expect(normalizeQuizTheme({ mode: 'dark', accent: 'nope' })).toBeUndefined()
  })

  it('converts a legacy quiz theme', () => {
    expect(normalizeQuizTheme('infinity-yellow-dark')).toEqual({ mode: 'dark', accent: 'green' })
  })
})

describe('themeToOptionValue', () => {
  it('serializes a selection and leaves undefined alone', () => {
    expect(themeToOptionValue({ mode: 'dark', accent: 'green' })).toBe('dark-green')
    expect(themeToOptionValue(undefined)).toBeUndefined()
  })
})

describe('migrateThemeStorage', () => {
  it('rewrites the legacy payload', () => {
    const raw = JSON.stringify({
      globalThemeName: 'infinity-red-dark',
      importedThemes: [{ name: 'mytheme', colorScheme: 'dark', raw: '' }],
    })

    expect(JSON.parse(migrateThemeStorage(raw))).toEqual({
      globalTheme: { mode: 'dark', accent: 'green' },
    })
  })

  it('is idempotent', () => {
    const once = migrateThemeStorage(JSON.stringify({ globalThemeName: 'infinity-yellow-light' }))
    expect(migrateThemeStorage(once)).toBe(once)
  })

  it('falls back to the default on malformed JSON or an empty payload', () => {
    const expected = JSON.stringify({ globalTheme: { mode: 'light', accent: 'green' } })
    expect(migrateThemeStorage('not json')).toBe(expected)
    expect(migrateThemeStorage(null)).toBe(expected)
    expect(migrateThemeStorage(JSON.stringify({ globalThemeName: 'gone' }))).toBe(expected)
  })
})

describe('migrateQuizCatalogue', () => {
  const legacyQuiz = {
    id: 'q1',
    title: 'Capitals',
    description: 'Europe',
    questions: [],
    theme: 'infinity-red-dark',
    tags: ['geo'],
  }

  it('converts the theme and keeps every other property', () => {
    const raw = JSON.stringify({ quizzes: [legacyQuiz] })

    const migrated = JSON.parse(migrateQuizCatalogue(raw) ?? '{}')

    expect(migrated.quizzes[0]).toEqual({
      id: 'q1',
      title: 'Capitals',
      description: 'Europe',
      questions: [],
      theme: { mode: 'dark', accent: 'green' },
      tags: ['geo'],
    })
  })

  it('drops an unknown theme without touching the quiz', () => {
    const raw = JSON.stringify({ quizzes: [{ ...legacyQuiz, theme: 'mytheme' }] })

    const migrated = JSON.parse(migrateQuizCatalogue(raw) ?? '{}')

    expect(migrated.quizzes[0].title).toBe('Capitals')
    expect(migrated.quizzes[0]).not.toHaveProperty('theme')
  })

  it('returns null when the payload is not a catalogue', () => {
    expect(migrateQuizCatalogue(null)).toBeNull()
    expect(migrateQuizCatalogue('not json')).toBeNull()
    expect(migrateQuizCatalogue(JSON.stringify({ quizzes: 'nope' }))).toBeNull()
  })
})
