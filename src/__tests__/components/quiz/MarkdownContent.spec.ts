import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MarkdownContent from '../../../components/quiz/content/MarkdownContent.vue'

function mountContent(source: string) {
  return mount(MarkdownContent, { props: { source } })
}

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
})
