import { describe, it, expect } from 'vitest'
import { runInNewContext } from 'node:vm'
import themeInitScript from '../../../public/theme-init.js?raw'

const THEME_KEY = 'infinity-quiz-theme'
const ACCESSIBILITY_KEY = 'infinity-quiz-accessibility'

/** The attribute bag the blocking head script is expected to fill. */
interface ThemeDataset {
  theme?: string
  font?: string
}

type Storage = Record<string, string>

/**
 * Run the first-paint script the way the document head does: as a plain
 * global script, before any bundle, with only `document` and `localStorage`.
 */
function runThemeInit(storage: Storage): ThemeDataset {
  const dataset: ThemeDataset = {}
  const context = {
    document: { documentElement: { dataset } },
    localStorage: {
      getItem: (key: string): string | null => storage[key] ?? null,
    },
  }

  runInNewContext(themeInitScript, context)

  return dataset
}

describe('theme-init', () => {
  describe('theme resolution', () => {
    it.each([
      {
        label: 'the current dark payload',
        payload: '{"globalTheme":{"mode":"dark","accent":"green"}}',
        expected: 'dark',
      },
      {
        label: 'the current light payload',
        payload: '{"globalTheme":{"mode":"light","accent":"green"}}',
        expected: 'light',
      },
      {
        label: 'a legacy dark theme name',
        payload: '{"globalThemeName":"infinity-blue-dark"}',
        expected: 'dark',
      },
      {
        label: 'another legacy dark theme name',
        payload: '{"globalThemeName":"infinity-red-dark"}',
        expected: 'dark',
      },
      {
        label: 'a legacy name outside the shipped set that ends in -dark',
        payload: '{"globalThemeName":"legacy-purple-dark"}',
        expected: 'dark',
      },
      {
        label: 'a legacy light theme name',
        payload: '{"globalThemeName":"infinity-blue-light"}',
        expected: 'light',
      },
    ])('resolves $label to $expected', ({ payload, expected }) => {
      const dataset = runThemeInit({ [THEME_KEY]: payload })

      expect(dataset.theme).toBe(expected)
    })

    it('defaults to light when the theme key is absent', () => {
      const dataset = runThemeInit({})

      expect(dataset.theme).toBe('light')
    })

    it.each([
      { label: 'a malformed theme payload', payload: '{oops' },
      { label: 'an unknown mode', payload: '{"globalTheme":{"mode":"purple"}}' },
      { label: 'an empty theme payload', payload: '' },
    ])('defaults to light on $label', ({ payload }) => {
      const dataset = runThemeInit({ [THEME_KEY]: payload })

      expect(dataset.theme).toBe('light')
    })
  })

  describe('accessibility font', () => {
    it('applies the dyslexic font and still resolves the theme', () => {
      const dataset = runThemeInit({
        [ACCESSIBILITY_KEY]: '{"isDyslexicFontEnabled":true}',
      })

      expect(dataset.font).toBe('dyslexic')
      expect(dataset.theme).toBe('light')
    })

    it('applies a stored dark theme together with the dyslexic font', () => {
      const dataset = runThemeInit({
        [THEME_KEY]: '{"globalTheme":{"mode":"dark","accent":"green"}}',
        [ACCESSIBILITY_KEY]: '{"isDyslexicFontEnabled":true}',
      })

      expect(dataset.theme).toBe('dark')
      expect(dataset.font).toBe('dyslexic')
    })

    it('sets no font when the dyslexic font is disabled', () => {
      const dataset = runThemeInit({
        [ACCESSIBILITY_KEY]: '{"isDyslexicFontEnabled":false}',
      })

      expect(dataset).not.toHaveProperty('font')
    })

    it('sets no font when the flag is not a boolean', () => {
      const dataset = runThemeInit({
        [ACCESSIBILITY_KEY]: '{"isDyslexicFontEnabled":"yes"}',
      })

      expect(dataset).not.toHaveProperty('font')
    })

    it('keeps the stored font when the theme payload is corrupt', () => {
      const dataset = runThemeInit({
        [THEME_KEY]: 'not json',
        [ACCESSIBILITY_KEY]: '{"isDyslexicFontEnabled":true}',
      })

      expect(dataset.theme).toBe('light')
      expect(dataset.font).toBe('dyslexic')
    })

    it('sets the light theme and no font when nothing is stored', () => {
      const dataset = runThemeInit({})

      expect(dataset.theme).toBe('light')
      expect(dataset).not.toHaveProperty('font')
    })
  })
})
