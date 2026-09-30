import { describe, it, expect } from 'vitest'
import { parseThemeBlock, buildThemeCss } from '../../utils/theme-import'

const VALID_BLOCK = `@plugin "daisyui/theme" {
  name: "mytheme";
  default: false;
  prefersdark: false;
  color-scheme: "dark";
  --color-base-100: oklch(14% 0.005 285.823);
  --color-primary: oklch(59% 0.24 277);
  --color-primary-content: oklch(96% 0.018 272.314);
  --radius-box: 1rem;
  --border: 2px;
  --depth: 1;
}`

describe('parseThemeBlock', () => {
  it('extracts name, color-scheme and every variable', () => {
    const parsed = parseThemeBlock(VALID_BLOCK)

    expect(parsed.name).toBe('mytheme')
    expect(parsed.colorScheme).toBe('dark')
    expect(parsed.variables['--color-base-100']).toBe('oklch(14% 0.005 285.823)')
    expect(parsed.variables['--color-primary']).toBe('oklch(59% 0.24 277)')
    expect(parsed.variables['--radius-box']).toBe('1rem')
    expect(parsed.variables['--border']).toBe('2px')
    expect(parsed.variables['--depth']).toBe('1')
  })

  it('defaults color-scheme to light when absent', () => {
    const parsed = parseThemeBlock(
      `@plugin "daisyui/theme" { name: "x"; --color-primary: oklch(59% 0.24 277); }`,
    )
    expect(parsed.colorScheme).toBe('light')
  })

  it('throws when name is missing', () => {
    expect(() => parseThemeBlock('@plugin "daisyui/theme" { --color-primary: oklch(1 0 0); }')).toThrow(
      'Theme name is missing or invalid',
    )
  })

  it('throws when name is invalid', () => {
    expect(() =>
      parseThemeBlock('@plugin "daisyui/theme" { name: "bad name!"; --color-primary: oklch(1 0 0); }'),
    ).toThrow('Theme name is missing or invalid')
  })

  it('throws when no color variable is present', () => {
    expect(() => parseThemeBlock('@plugin "daisyui/theme" { name: "x"; --radius-box: 1rem; }')).toThrow(
      'No color variables',
    )
  })
})

describe('buildThemeCss', () => {
  it('builds a data-theme rule with color-scheme and variables', () => {
    const css = buildThemeCss(parseThemeBlock(VALID_BLOCK))

    expect(css).toContain('[data-theme="mytheme"]')
    expect(css).toContain('color-scheme: dark;')
    expect(css).toContain('--color-primary: oklch(59% 0.24 277);')
  })
})
