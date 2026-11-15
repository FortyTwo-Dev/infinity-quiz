import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import QuizSearchBar from '../../../components/quiz/QuizSearchBar.vue'

type SearchBarProps = {
  searchTerm: string
  categories: string[]
  tags: string[]
  selectedCategory: string | null
  selectedTag: string | null
}

function mountSearchBar(overrides: Partial<SearchBarProps> = {}) {
  return mount(QuizSearchBar, {
    props: {
      searchTerm: '',
      categories: ['Math', 'Science'],
      tags: ['easy', 'hard'],
      selectedCategory: null,
      selectedTag: null,
      ...overrides,
    },
  })
}

function searchInput(wrapper: ReturnType<typeof mountSearchBar>) {
  return wrapper.get('[aria-label="Search quizzes"]')
}

function categorySelect(wrapper: ReturnType<typeof mountSearchBar>) {
  return wrapper.get('[aria-label="Filter by category"]')
}

function tagSelect(wrapper: ReturnType<typeof mountSearchBar>) {
  return wrapper.get('[aria-label="Filter by tag"]')
}

function clearButton(wrapper: ReturnType<typeof mountSearchBar>) {
  return wrapper.findAll('button').find((button) => button.text().trim() === 'Clear')
}

describe('QuizSearchBar', () => {
  it('shows the search term in an input named "Search quizzes"', () => {
    const wrapper = mountSearchBar({ searchTerm: 'capitals' })

    const input = searchInput(wrapper)
    expect((input.element as HTMLInputElement).value).toBe('capitals')
    expect(input.attributes('aria-label')).toBe('Search quizzes')
  })

  it('emits update:searchTerm with the typed value', async () => {
    const wrapper = mountSearchBar()

    await searchInput(wrapper).setValue('geography')

    expect(wrapper.emitted('update:searchTerm')?.[0]).toEqual(['geography'])
  })

  it('follows the searchTerm prop when it changes', async () => {
    const wrapper = mountSearchBar({ searchTerm: 'math' })

    await wrapper.setProps({ searchTerm: 'science' })

    expect((searchInput(wrapper).element as HTMLInputElement).value).toBe('science')
  })

  it('offers "All categories" first, then one option per category', () => {
    const wrapper = mountSearchBar()

    const labels = categorySelect(wrapper)
      .findAll('option')
      .map((option) => option.text())
    expect(labels).toEqual(['All categories', 'Math', 'Science'])
  })

  it('offers "All tags" first, then one option per tag', () => {
    const wrapper = mountSearchBar()

    const labels = tagSelect(wrapper)
      .findAll('option')
      .map((option) => option.text())
    expect(labels).toEqual(['All tags', 'easy', 'hard'])
  })

  it('emits update:selectedCategory with the chosen category', async () => {
    const wrapper = mountSearchBar()

    await categorySelect(wrapper).setValue('Science')

    expect(wrapper.emitted('update:selectedCategory')?.[0]).toEqual(['Science'])
  })

  it('emits null when "All categories" is chosen', async () => {
    const wrapper = mountSearchBar({ selectedCategory: 'Math' })

    await categorySelect(wrapper).setValue('')

    expect(wrapper.emitted('update:selectedCategory')?.[0]).toEqual([null])
  })

  it('emits update:selectedTag with the chosen tag', async () => {
    const wrapper = mountSearchBar()

    await tagSelect(wrapper).setValue('hard')

    expect(wrapper.emitted('update:selectedTag')?.[0]).toEqual(['hard'])
  })

  it('emits null when "All tags" is chosen', async () => {
    const wrapper = mountSearchBar({ selectedTag: 'easy' })

    await tagSelect(wrapper).setValue('')

    expect(wrapper.emitted('update:selectedTag')?.[0]).toEqual([null])
  })

  it('disables Clear while the term is empty and both filters are null', () => {
    const clear = clearButton(mountSearchBar())

    expect(clear).toBeDefined()
    expect(clear?.attributes('disabled')).toBeDefined()
  })

  it.each<[string, Partial<SearchBarProps>]>([
    ['a search term', { searchTerm: 'math' }],
    ['a selected category', { selectedCategory: 'Math' }],
    ['a selected tag', { selectedTag: 'easy' }],
  ])('enables Clear with %s', (_label, overrides) => {
    const clear = clearButton(mountSearchBar(overrides))

    expect(clear?.attributes('disabled')).toBeUndefined()
  })

  it('clears the term, both filters and emits clear', async () => {
    const wrapper = mountSearchBar({
      searchTerm: 'capital',
      selectedCategory: 'Math',
      selectedTag: 'hard',
    })

    await clearButton(wrapper)?.trigger('click')

    expect(wrapper.emitted('update:searchTerm')?.[0]).toEqual([''])
    expect(wrapper.emitted('update:selectedCategory')?.[0]).toEqual([null])
    expect(wrapper.emitted('update:selectedTag')?.[0]).toEqual([null])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })
})
