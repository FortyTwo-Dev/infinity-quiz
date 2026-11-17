import DOMPurify from 'dompurify'
import { Marked, Renderer, type Tokens } from 'marked'

/**
 * The only place the application turns Markdown into HTML. The output is
 * sanitized here, so a component may bind it with `v-html`: nothing else does.
 */

/** What the theme package styles, and nothing more. */
const ALLOWED_TAGS = [
  'p',
  'br',
  'strong',
  'em',
  'del',
  'code',
  'pre',
  'blockquote',
  'ul',
  'ol',
  'li',
  'a',
  'hr',
  'table',
  'thead',
  'tbody',
  'tr',
  'th',
  'td',
]

const ALLOWED_ATTRIBUTES = ['href', 'title', 'target', 'rel']

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const markdown = new Marked({ async: false, breaks: true, gfm: true })

// `marked` merges a plain object of overrides into its default renderer; a
// `Renderer` subclass would be ignored, because only own properties are read.
markdown.use({
  renderer: {
    /** The prompt is the card's heading: a heading here would break the outline. */
    heading(this: Renderer, { tokens }: Tokens.Heading): string {
      return `<p><strong>${this.parser.parseInline(tokens)}</strong></p>\n`
    },

    /** Images wait for the account storage; the alt text beats a broken image. */
    image({ text }: Tokens.Image): string {
      return escapeHtml(text)
    },

    /** Every link leaves the application, so it opens in a new tab. */
    link({ href, title, text }: Tokens.Link): string {
      const titleAttribute = title ? ` title="${escapeHtml(title)}"` : ''
      return `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer"${titleAttribute}>${text}</a>`
    },
  },
})

/**
 * Render a Markdown fragment to sanitized HTML: no raw HTML survives, no
 * image, and every link opens in a new tab with the opener nulled. The
 * scheme policy is DOMPurify's default, which refuses `javascript:` and
 * `data:`; narrowing it further would also drop `target` and `rel`, which the
 * sanitizer treats as URI-valued attributes.
 */
export function renderMarkdown(source: string): string {
  const html = markdown.parse(source, { async: false })

  return DOMPurify.sanitize(html, {
    ALLOWED_ATTR: ALLOWED_ATTRIBUTES,
    ALLOWED_TAGS,
    ALLOW_DATA_ATTR: false,
  })
}
