import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import QuizReviewCard from '../../../components/quiz/card/QuizReviewCard.vue'
import { ItBadge } from '@/components/itheme'

type Question = {
  id: string
  text: string
  options: string[]
  correctAnswerIndex: number
  context?: string
}

type QuestionResult = {
  question: Question
  userAnswer: number | null
  isCorrect: boolean
  isSkipped: boolean
}

const baseResult: QuestionResult = {
  question: {
    id: 'question-1',
    text: 'What is the capital of France?',
    options: ['Paris', 'Rome', 'Oslo'],
    correctAnswerIndex: 0,
  },
  userAnswer: 1,
  isCorrect: false,
  isSkipped: false,
}

function mountCard(
  overrides: Partial<QuestionResult> = {},
  props: { showFeedback?: boolean } = {},
) {
  return mount(QuizReviewCard, {
    props: { questionResult: { ...baseResult, ...overrides }, ...props },
  })
}

function optionRows(wrapper: ReturnType<typeof mountCard>) {
  return wrapper.findAll('[data-state]').filter((node) => node.element !== wrapper.element)
}

function optionStates(wrapper: ReturnType<typeof mountCard>) {
  return optionRows(wrapper).map((row) => row.attributes('data-state'))
}

function feedback(wrapper: ReturnType<typeof mountCard>) {
  return wrapper
    .findAll('p')
    .find((paragraph) => paragraph.text().startsWith('The correct answer was'))
}

describe('QuizReviewCard', () => {
  it.each([
    {
      state: 'skipped',
      overrides: { isSkipped: true, userAnswer: null },
      label: 'Skipped',
      variant: 'warning',
    },
    {
      state: 'correct',
      overrides: { isCorrect: true, userAnswer: 0 },
      label: 'Correct',
      variant: 'success',
    },
    {
      state: 'incorrect',
      overrides: { isCorrect: false, isSkipped: false, userAnswer: 1 },
      label: 'Incorrect',
      variant: 'danger',
    },
  ])('shows the $state state with variant $variant', ({ overrides, label, variant }) => {
    const wrapper = mountCard(overrides)

    expect(wrapper.findComponent(ItBadge).text()).toBe(label)
    expect(wrapper.findComponent(ItBadge).props('variant')).toBe(variant)
    expect(wrapper.attributes('data-state')).toBe(variant)
  })

  it('renders the question text', () => {
    const wrapper = mountCard()

    expect(wrapper.text()).toContain('What is the capital of France?')
  })

  it('renders every option in order, prefixed by its letter', () => {
    const wrapper = mountCard()
    const rows = optionRows(wrapper)

    expect(rows).toHaveLength(3)
    expect(rows[0]?.text()).toMatch(/^A\s*Paris$/)
    expect(rows[1]?.text()).toMatch(/^B\s*Rome$/)
    expect(rows[2]?.text()).toMatch(/^C\s*Oslo$/)
  })

  it('marks the correct option as correct even when the user picked it', () => {
    const wrapper = mountCard({ userAnswer: 0, isCorrect: true })

    expect(optionStates(wrapper)).toEqual(['correct', 'plain', 'plain'])
  })

  it('marks a wrong selection as wrong and the correct option as correct', () => {
    const wrapper = mountCard({ userAnswer: 1, isCorrect: false, isSkipped: false })

    expect(optionStates(wrapper)).toEqual(['correct', 'wrong', 'plain'])
  })

  it('marks a selection on a skipped question as skipped', () => {
    const wrapper = mountCard({ userAnswer: 1, isSkipped: true })

    expect(optionStates(wrapper)).toEqual(['correct', 'skipped', 'plain'])
  })

  it('renders the correct answer sentence by default', () => {
    const wrapper = mountCard()

    expect(feedback(wrapper)?.text()).toBe('The correct answer was Paris')
  })

  it('renders the correct answer sentence when feedback is explicitly shown', () => {
    const wrapper = mountCard({}, { showFeedback: true })

    expect(feedback(wrapper)?.text()).toBe('The correct answer was Paris')
  })

  it('hides the correct answer sentence when feedback is turned off', () => {
    const wrapper = mountCard({}, { showFeedback: false })

    expect(feedback(wrapper)).toBeUndefined()
    expect(wrapper.text()).not.toContain('The correct answer was')
  })

  it('hides the correct answer sentence on a skipped question', () => {
    const wrapper = mountCard({ isSkipped: true, userAnswer: null }, { showFeedback: true })

    expect(feedback(wrapper)).toBeUndefined()
    expect(wrapper.text()).not.toContain('The correct answer was')
  })

  it('hides the correct answer sentence on a correct answer', () => {
    const wrapper = mountCard({ isCorrect: true, userAnswer: 0 }, { showFeedback: true })

    expect(feedback(wrapper)).toBeUndefined()
    expect(wrapper.text()).not.toContain('The correct answer was')
  })

  it('renders the sentence with an empty answer when the correct index is out of range', () => {
    const wrapper = mountCard(
      {
        question: {
          id: 'question-1',
          text: 'What is the capital of France?',
          options: ['Paris', 'Rome'],
          correctAnswerIndex: 9,
        },
      },
      { showFeedback: true },
    )

    expect(feedback(wrapper)?.text()).toBe('The correct answer was')
    expect(optionStates(wrapper)).toEqual(['plain', 'wrong'])
  })

  it('renders the question context as Markdown between the title and the options', () => {
    const wrapper = mountCard({
      question: { ...baseResult.question, context: 'Remember **this** first.' },
    })

    const prose = wrapper.find('.quiz-prose')
    expect(prose.exists()).toBe(true)
    expect(prose.find('strong').text()).toBe('this')
    expect(wrapper.html().indexOf('quiz-prose')).toBeGreaterThan(
      wrapper.html().indexOf(baseResult.question.text),
    )
    expect(
      prose.element.compareDocumentPosition(optionRows(wrapper)[0]!.element) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    expect(prose.text()).not.toContain('**this**')
  })

  it('renders no prose block without a context', () => {
    const wrapper = mountCard()

    expect(wrapper.find('.quiz-prose').exists()).toBe(false)
  })
})
