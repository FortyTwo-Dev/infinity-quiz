import { isValidThemeName } from '../constants/themes'

export interface ParsedThemeBlock {
  name: string
  colorScheme: 'light' | 'dark'
  variables: Record<string, string>
}

const NAME_REGEX = /\bname\s*:\s*["']?([A-Za-z0-9_-]+)["']?\s*;/
const SCHEME_REGEX = /\bcolor-scheme\s*:\s*["'](light|dark)["']\s*;/
const VAR_REGEX = /(--[A-Za-z0-9-]+)\s*:\s*([^;]+);/g

function matchFirstGroup(regex: RegExp, input: string): string | undefined {
  return regex.exec(input)?.[1]
}

/**
 * Parse a daisyUI theme block produced by the Theme Generator:
 * `@plugin "daisyui/theme" { name: "x"; ... --color-primary: oklch(...); }`.
 * Captures every `--var: value;` declaration plus the optional color-scheme.
 */
export function parseThemeBlock(css: string): ParsedThemeBlock {
  const name = matchFirstGroup(NAME_REGEX, css)
  if (!name || !isValidThemeName(name)) {
    throw new Error('Theme name is missing or invalid (letters, digits, "-", "_" only)')
  }

  const colorScheme: 'light' | 'dark' =
    matchFirstGroup(SCHEME_REGEX, css) === 'dark' ? 'dark' : 'light'

  const variables: Record<string, string> = {}
  let match: RegExpExecArray | null
  while ((match = VAR_REGEX.exec(css)) !== null) {
    variables[match[1]!] = match[2]!.trim()
  }

  if (!Object.keys(variables).some((key) => key.startsWith('--color-'))) {
    throw new Error('No color variables (--color-*) found in the theme block')
  }

  return { name, colorScheme, variables }
}

export function buildThemeCss(parsed: ParsedThemeBlock): string {
  const declarations = Object.entries(parsed.variables)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n')

  return `[data-theme="${parsed.name}"] {\n  color-scheme: ${parsed.colorScheme};\n${declarations}\n}`
}
