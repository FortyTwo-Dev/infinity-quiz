import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import MarkdownContent from '../../../components/quiz/content/MarkdownContent.vue'
import { highlightCode } from '@/utils/highlight'

vi.mock('@/utils/highlight', () => ({
  highlightCode: vi.fn<(source: string, fence?: string) => Promise<string | null>>(),
}))

const mockedHighlightCode = vi.mocked(highlightCode)

function mountContent(source: string) {
  return mount(MarkdownContent, { props: { source } })
}

beforeEach(() => {
  mockedHighlightCode.mockReset()
})

describe('MarkdownContent', () => {
  it('renders the prose root with a formatted bold run inside', () => {
    const wrapper = mountContent('**bold**')

    expect(wrapper.find('.quiz-prose').exists()).toBe(true)
    expect(wrapper.find('.quiz-prose strong').text()).toBe('bold')
  })

  it('renders the root but no block content for an empty source', () => {
    const wrapper = mountContent('')

    expect(wrapper.find('.quiz-prose').exists()).toBe(true)
    expect(wrapper.findAll('p')).toHaveLength(0)
    expect(wrapper.findAll('h1,h2,h3,h4,h5,h6')).toHaveLength(0)
  })

  it('renders the Markdown as HTML instead of the raw syntax', () => {
    const wrapper = mountContent('**bold**')

    expect(wrapper.text()).not.toContain('**bold**')
    expect(wrapper.html()).toContain('<strong>bold</strong>')
  })

  it('keeps the prose element as a top-level node, with no new wrapper', () => {
    const wrapper = mountContent('**bold**')
    const container = document.createElement('div')
    container.innerHTML = wrapper.html()

    const prose = container.querySelector('.quiz-prose')
    expect(prose).not.toBeNull()
    expect(prose?.parentElement).toBe(container)
  })

  it('shows the plain code immediately, then the highlighted markup', async () => {
    mockedHighlightCode.mockResolvedValue('<span style="color:red">hinted</span>')
    const wrapper = mountContent('```js\nconst hinted = 1\n```')

    expect(wrapper.get('code[data-lang="js"]').text()).toContain('const hinted = 1')
    expect(wrapper.get('code[data-lang="js"]').attributes('data-highlighted')).toBeUndefined()

    await flushPromises()
    await nextTick()

    const code = wrapper.get('code[data-lang="js"]')
    expect(code.attributes('data-highlighted')).toBe('true')
    expect(code.html()).toContain('<span')
  })

  it('leaves the code plain when the highlighter declines', async () => {
    mockedHighlightCode.mockResolvedValue(null)
    const wrapper = mountContent('```js\nconst plain = 1\n```')

    await flushPromises()
    await nextTick()

    const code = wrapper.get('code[data-lang="js"]')
    expect(code.text()).toContain('const plain = 1')
    expect(code.attributes('data-highlighted')).toBeUndefined()
    expect(code.html()).not.toContain('<span')
  })
})
