import { describe, it, expect } from 'vitest'
import { renderMarkdown } from '../../utils/markdown'

/**
 * Assert on tags, attributes and text, never on the exact serialisation: the
 * renderer wraps output in its own paragraphs and whitespace.
 */

/** The text a reader would see, with the tags stripped by the DOM. */
function textOf(html: string): string {
  const container = document.createElement('div')
  container.innerHTML = html
  return (container.textContent ?? '').replace(/\s+/g, ' ').trim()
}

function links(html: string): HTMLAnchorElement[] {
  const container = document.createElement('div')
  container.innerHTML = html
  return Array.from(container.querySelectorAll('a'))
}

describe('renderMarkdown', () => {
  it('renders bold text', () => {
    expect(renderMarkdown('**bold**')).toContain('<strong>bold</strong>')
  })

  it('renders emphasis, strikethrough and inline code', () => {
    const html = renderMarkdown('*em* ~~del~~ `code`')

    expect(html).toContain('<em>em</em>')
    expect(html).toContain('<del>del</del>')
    expect(html).toContain('<code>code</code>')
  })

  it('renders a fenced code block and keeps its text', () => {
    const html = renderMarkdown('```\nconst answer = 42\n```')

    expect(html).toContain('<pre>')
    expect(html).toContain('<code>')
    expect(html).toContain('const answer = 42')
  })

  it('renders a list', () => {
    const html = renderMarkdown('- one\n- two')

    expect(html).toContain('<ul>')
    expect(html).toContain('<li>one</li>')
    expect(html).toContain('<li>two</li>')
  })

  it('renders a table with a header and cells', () => {
    const html = renderMarkdown('| A | B |\n| - | - |\n| 1 | 2 |')

    expect(html).toContain('<table>')
    expect(html).toContain('<thead>')
    expect(html).toContain('<th>')
    expect(html).toContain('<td>')
    expect(textOf(html)).toContain('1')
  })

  it('keeps emphasis inside a paragraph as HTML', () => {
    const html = renderMarkdown('An **important** sentence.')

    expect(html).toContain('<strong>important</strong>')
    expect(textOf(html)).toBe('An important sentence.')
  })

  it('keeps emphasis inside a blockquote as HTML', () => {
    const html = renderMarkdown('> A **quoted** line')

    expect(html).toContain('<blockquote>')
    expect(html).toContain('<strong>quoted</strong>')
  })

  it.each(['# Title', '## Sub'])('renders the heading %j as a bold paragraph', (source) => {
    const html = renderMarkdown(source)

    expect(html).toContain('<p><strong>')
    expect(html).not.toMatch(/<h[1-6][\s>]/)
    expect(textOf(html)).toBe(source.replace(/^#+\s*/, ''))
  })

  it('drops an image and keeps its alt text as text', () => {
    const html = renderMarkdown('![alt text](https://example.com/x.png)')

    expect(html).not.toContain('<img')
    expect(textOf(html)).toContain('alt text')
  })

  it('neutralises a script tag', () => {
    const html = renderMarkdown('<script>alert(1)</script>')

    expect(html).not.toContain('<script')
    expect(html).not.toMatch(/on\w+\s*=/i)
  })

  it('neutralises an image carrying an event handler', () => {
    const html = renderMarkdown('<img src=x onerror="alert(1)">')

    expect(html).not.toContain('<img')
    expect(html).not.toMatch(/onerror/i)
  })

  it('opens an http link in a new tab without exposing the opener', () => {
    const [link] = links(renderMarkdown('[example](https://example.com)'))

    expect(link).toBeDefined()
    expect(link?.getAttribute('href')).toBe('https://example.com')
    expect(link?.getAttribute('target')).toBe('_blank')
    expect(link?.getAttribute('rel')).toBe('noopener noreferrer')
  })

  it('drops the href of a javascript: link', () => {
    const html = renderMarkdown('[click me](javascript:alert(1))')

    expect(
      links(html).every((link) => !/^javascript:/i.test(link.getAttribute('href') ?? '')),
    ).toBe(true)
  })

  it('returns an empty string for an empty source', () => {
    expect(renderMarkdown('')).toBe('')
  })
})
