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

/** The DOM the browser builds from the renderer's HTML. */
function domOf(html: string): HTMLDivElement {
  const container = document.createElement('div')
  container.innerHTML = html
  return container
}

/** The `<code>` element of the single fenced block the source renders. */
function codeOf(html: string): HTMLElement {
  const code = domOf(html).querySelector('pre > code')
  if (!code) throw new Error('no fenced code block rendered')
  return code as HTMLElement
}

interface MarkdownCase {
  name: string
  source: string
  expected: string[]
  text?: string[]
}

describe('renderMarkdown', () => {
  it.each<MarkdownCase>([
    { name: 'renders bold text', source: '**bold**', expected: ['<strong>bold</strong>'] },
    {
      name: 'renders emphasis, strikethrough and inline code',
      source: '*em* ~~del~~ `code`',
      expected: ['<em>em</em>', '<del>del</del>', '<code>code</code>'],
    },
    {
      name: 'renders a fenced code block and keeps its text',
      source: '```\nconst answer = 42\n```',
      expected: ['<pre>', '<code>', 'const answer = 42'],
    },
    {
      name: 'renders a list',
      source: '- one\n- two',
      expected: ['<ul>', '<li>one</li>', '<li>two</li>'],
    },
    {
      name: 'renders a table with a header and cells',
      source: '| A | B |\n| - | - |\n| 1 | 2 |',
      expected: ['<table>', '<thead>', '<th>', '<td>'],
      text: ['1'],
    },
    {
      name: 'keeps emphasis inside a blockquote as HTML',
      source: '> A **quoted** line',
      expected: ['<blockquote>', '<strong>quoted</strong>'],
    },
  ])('$name', ({ source, expected, text }) => {
    const html = renderMarkdown(source)

    for (const fragment of expected) {
      expect(html).toContain(fragment)
    }
    for (const fragment of text ?? []) {
      expect(textOf(html)).toContain(fragment)
    }
  })

  it('keeps emphasis inside a paragraph as HTML', () => {
    const html = renderMarkdown('An **important** sentence.')

    expect(html).toContain('<strong>important</strong>')
    expect(textOf(html)).toBe('An important sentence.')
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

  it('labels a fenced block with its language', () => {
    const code = codeOf(renderMarkdown('```js\nconst a = 1\n```'))

    expect(code.getAttribute('data-lang')).toBe('js')
    expect(code.textContent).toContain('const a = 1')
  })

  it('lowercases the language of a fenced block', () => {
    expect(codeOf(renderMarkdown('```JS\nconst a = 1\n```')).getAttribute('data-lang')).toBe('js')
  })

  it('takes the first word of the info string as the language', () => {
    const code = codeOf(renderMarkdown('```js title="x"\nconst a = 1\n```'))

    expect(code.getAttribute('data-lang')).toBe('js')
    expect(code.getAttribute('data-lang')).not.toContain('title')
  })

  it('leaves data-lang off a fence with no language', () => {
    expect(codeOf(renderMarkdown('```\nconst a = 1\n```')).hasAttribute('data-lang')).toBe(false)
  })

  it('escapes markup inside a fenced block', () => {
    const html = renderMarkdown('```\n<script>alert(1)</script>\n```')
    const container = domOf(html)

    expect(container.querySelector('script')).toBeNull()
    expect(codeOf(html).textContent).toContain('<script>alert(1)</script>')
  })

  it('cannot break out of data-lang with a hostile fence name', () => {
    const html = renderMarkdown('```"><img src=x onerror=alert(1)>\nconst a = 1\n```')
    const container = domOf(html)
    const code = codeOf(html)

    expect(container.querySelector('img')).toBeNull()
    expect(container.querySelector('[onerror]')).toBeNull()
    expect(code.children).toHaveLength(0)
    for (const attribute of Array.from(code.attributes)) {
      expect(attribute.name).toBe('data-lang')
    }
  })
})
