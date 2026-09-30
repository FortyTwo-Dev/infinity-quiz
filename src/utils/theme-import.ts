import { isValidThemeName } from '../constants/themes'

export interface ParsedThemeBlock {
  name: string
  colorScheme: 'light' | 'dark'
  variables: Record<string, string>
}

/**
 * Parse a daisyUI theme block produced by the Theme Generator:
 * `@plugin "daisyui/theme" { name: "x"; ... --color-primary: oklch(...); }`.
 * Captures every `--var: value;` declaration plus the optional color-scheme.
 */
export function parseThemeBlock(css: string): ParsedThemeBlock {
  const nameMatch = css.match(/\bname\s*:\s*["']?([A-Za-z0-9_-]+)["']?\s*;/)
  const name = nameMatch?.[1]
  if (!name || !isValidThemeName(name)) {
    throw new Error('Theme name is missing or invalid (letters, digits, "-", "_" only)')
  }

  const schemeMatch = css.match(/\bcolor-scheme\s*:\s*["'](light|dark)["']\s*;/)
  const colorScheme: 'light' | 'dark' = schemeMatch?.[1] === 'dark' ? 'dark' : 'light'

  const variables: Record<string, string> = {}
  const varRegex = /(--[A-Za-z0-9-]+)\s*:\s*([^;]+)\s*;/g
  let match: RegExpExecArray | null
  while ((match = varRegex.exec(css)) !== null) {
    variables[match[1]!] = match[2]!.trim()
  }

  if (!Object.keys(variables).some((key) => key.startsWith('--color-'))) {
    throw new Error('No color variables (--color-*) found in the theme block')
  }

  return { name, colorScheme, variables }
}

/** Build the `[data-theme="name"] { ... }` rule that daisyUI would generate. */
export function buildThemeCss(parsed: ParsedThemeBlock): string {
  const declarations = Object.entries(parsed.variables)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n')

  return `[data-theme="${parsed.name}"] {\n  color-scheme: ${parsed.colorScheme};\n${declarations}\n}`
}
