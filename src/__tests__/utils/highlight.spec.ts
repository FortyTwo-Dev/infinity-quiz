import { describe, expect, it } from 'vitest'
import type { ThemedToken } from 'shiki'
import { highlightCode, languageIdFor, tokensToHtml } from '../../utils/highlight'

/**
 * The highlighter is exercised at two levels: the pure token to HTML mapping,
 * pinned on exact markup, and the real Shiki call, pinned on the properties a
 * reader and the caller rely on.
 */

function token(
  content: string,
  style: Partial<Pick<ThemedToken, 'color' | 'fontStyle'>> = {},
): ThemedToken {
  return { content, offset: 0, ...style }
}

describe('languageIdFor', () => {
  it.each([
    { fence: 'javascript', expected: 'javascript' },
    { fence: 'typescript', expected: 'typescript' },
    { fence: 'jsx', expected: 'jsx' },
    { fence: 'tsx', expected: 'tsx' },
    { fence: 'json', expected: 'json' },
    { fence: 'html', expected: 'html' },
    { fence: 'css', expected: 'css' },
    { fence: 'bash', expected: 'bash' },
    { fence: 'python', expected: 'python' },
    { fence: 'java', expected: 'java' },
    { fence: 'js', expected: 'javascript' },
    { fence: 'ts', expected: 'typescript' },
    { fence: 'py', expected: 'python' },
    { fence: 'sh', expected: 'bash' },
    { fence: 'shell', expected: 'bash' },
    { fence: 'zsh', expected: 'bash' },
    { fence: 'htm', expected: 'html' },
    { fence: 'JS', expected: 'javascript' },
    { fence: '  js  ', expected: 'javascript' },
    { fence: 'js title="x"', expected: 'javascript' },
  ])('resolves $fence to $expected', ({ fence, expected }) => {
    expect(languageIdFor(fence)).toBe(expected)
  })

  it.each(['rust', 'nope'])('returns undefined for the unknown language %j', (fence) => {
    expect(languageIdFor(fence)).toBeUndefined()
  })

  it.each(['', '   '])('returns undefined for the blank fence %j', (fence) => {
    expect(languageIdFor(fence)).toBeUndefined()
  })

  it('returns undefined for a missing fence', () => {
    expect(languageIdFor(undefined)).toBeUndefined()
  })
})

describe('tokensToHtml', () => {
  it('wraps one token in a coloured span', () => {
    const html = tokensToHtml([[token('const', { color: '#ffffff' })]])

    expect(html).toBe('<span style="color:#ffffff">const</span>')
  })

  it('escapes the token content', () => {
    const html = tokensToHtml([[token('<b>')]])

    expect(html).toContain('&lt;b&gt;')
    expect(html).not.toContain('<b>')
  })

  it('falls back to an inherited colour when the token has none', () => {
    expect(tokensToHtml([[token('plain')]])).toMatch(/color:\s*inherit/)
  })

  it.each([
    [1, 'font-style:italic'],
    [2, 'font-weight:700'],
    [4, 'text-decoration:underline'],
  ])('maps the font style bit %i to %s', (fontStyle, declaration) => {
    expect(tokensToHtml([[token('styled', { fontStyle })]])).toContain(declaration)
  })

  it('adds no style declaration for the zero font style', () => {
    const html = tokensToHtml([[token('plain', { fontStyle: 0 })]])

    expect(html).not.toContain('font-style:italic')
    expect(html).not.toContain('font-weight:700')
    expect(html).not.toContain('text-decoration:underline')
  })

  it('joins two lines with a newline', () => {
    const html = tokensToHtml([[token('a')], [token('b')]])

    expect(html).toContain('</span>\n<span')
  })

  it('emits no span for an empty line', () => {
    const html = tokensToHtml([[token('a')], [], [token('b')]])

    expect(html.match(/<span/g)).toHaveLength(2)
    expect(html.split('\n')).toHaveLength(3)
  })
})

describe('highlightCode', () => {
  it('highlights JavaScript through the real Shiki pipeline', async () => {
    const html = await highlightCode('const a = 1', 'js')

    expect(html).toBeTruthy()
    expect(html).toContain('<span')
    expect(html).toContain('color:')
    expect(html).toContain('const')
  })

  it('returns the same markup for the same input', async () => {
    const first = await highlightCode('const a = 1', 'js')
    const second = await highlightCode('const a = 1', 'js')

    expect(second).toBe(first)
  })

  it('returns null for an unknown language', async () => {
    await expect(highlightCode('x', 'nope')).resolves.toBeNull()
  })

  it('returns null when no language is given', async () => {
    await expect(highlightCode('x', undefined)).resolves.toBeNull()
  })
})
