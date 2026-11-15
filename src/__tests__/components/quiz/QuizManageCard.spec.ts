import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import QuizManageCard from '../../../components/quiz/card/QuizManageCard.vue'
import { ItBadge } from '@/components/itheme'

type Quiz = {
  id: string
  title: string
  description: string
  category?: string
  tags?: string[]
  questions: unknown[]
}

const baseQuiz: Quiz = {
  id: 'quiz-1',
  title: 'World capitals',
  description: 'Name the capital city of each country.',
  category: 'Geography',
  tags: ['geo'],
  questions: [{ id: 'q1' }, { id: 'q2' }, { id: 'q3' }],
}

function mountCard(quiz: Partial<Quiz> = {}) {
  return mount(QuizManageCard, { props: { quiz: { ...baseQuiz, ...quiz } } })
}

function button(wrapper: ReturnType<typeof mountCard>, label: string) {
  return wrapper.findAll('button').find((candidate) => candidate.text() === label)
}

describe('QuizManageCard', () => {
  it('shows the quiz category in the category badge', () => {
    const wrapper = mountCard()

    expect(wrapper.findComponent(ItBadge).text()).toBe('Geography')
  })

  it('falls back to Uncategorized when the quiz has no category', () => {
    const wrapper = mountCard({ category: undefined })

    expect(wrapper.findComponent(ItBadge).text()).toBe('Uncategorized')
  })

  it('reads the question count for three questions', () => {
    const wrapper = mountCard()

    expect(wrapper.text()).toContain('3 questions')
  })

  it('reads zero questions for a quiz without questions', () => {
    const wrapper = mountCard({ questions: [] })

    expect(wrapper.text()).toContain('0 questions')
    expect(wrapper.text()).not.toContain('3 questions')
  })

  it('renders the title and the description', () => {
    const wrapper = mountCard()

    expect(wrapper.text()).toContain('World capitals')
    expect(wrapper.text()).toContain('Name the capital city of each country.')
  })

  it('emits edit with the quiz id when the edit button is clicked', async () => {
    const wrapper = mountCard()

    await button(wrapper, 'Edit')?.trigger('click')

    expect(wrapper.emitted('edit')).toEqual([['quiz-1']])
  })

  it('names the duplicate control after the quiz and emits duplicate with its id', async () => {
    const wrapper = mountCard()
    const duplicate = wrapper.get('[aria-label="Duplicate World capitals"]')

    await duplicate.trigger('click')

    expect(wrapper.emitted('duplicate')).toEqual([['quiz-1']])
  })

  it('names the delete control after the quiz and emits delete with its id', async () => {
    const wrapper = mountCard()
    const remove = wrapper.get('[aria-label="Delete World capitals"]')

    await remove.trigger('click')

    expect(wrapper.emitted('delete')).toEqual([['quiz-1']])
  })

  it('emits edit when the card body is clicked', async () => {
    const wrapper = mountCard()

    await wrapper.trigger('click')

    expect(wrapper.emitted('edit')).toEqual([['quiz-1']])
  })

  it('emits only duplicate when the duplicate control is clicked', async () => {
    const wrapper = mountCard()

    await wrapper.get('[aria-label="Duplicate World capitals"]').trigger('click')

    expect(wrapper.emitted('duplicate')).toEqual([['quiz-1']])
    expect(wrapper.emitted('edit')).toBeUndefined()
  })

  it('emits only delete when the delete control is clicked', async () => {
    const wrapper = mountCard()

    await wrapper.get('[aria-label="Delete World capitals"]').trigger('click')

    expect(wrapper.emitted('delete')).toEqual([['quiz-1']])
    expect(wrapper.emitted('edit')).toBeUndefined()
  })
})
