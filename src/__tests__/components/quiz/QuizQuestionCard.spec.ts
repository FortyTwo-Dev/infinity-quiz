import { describe, it, expect } from 'vitest'
import { mount, type DOMWrapper, type VueWrapper } from '@vue/test-utils'
import QuizQuestionCard from '../../../components/quiz/card/QuizQuestionCard.vue'

type Question = {
  id: string
  text: string
  options: string[]
  correctAnswerIndex: number
  timeLimit?: number
  context?: string
}

type CardProps = {
  question: Question
  questionOptions: { option: string; originalIndex: number }[]
  selectedAnswer: number | null
  isAnswerVerified: boolean
  isCurrentQuestionVerified: boolean
  hasPreviousQuestion: boolean
  hasNextQuestion: boolean
  canSkip: boolean
  remainingSkips: number | null
  hasFeedbackEnabled: boolean
}

const baseQuestion: Question = {
  id: 'q1',
  text: 'What is 2 + 2?',
  options: ['3', '4'],
  correctAnswerIndex: 1,
}

const shuffledOptions = [
  { option: '4', originalIndex: 1 },
  { option: '3', originalIndex: 0 },
]

function mountCard(overrides: Partial<CardProps> = {}) {
  return mount(QuizQuestionCard, {
    props: {
      question: baseQuestion,
      questionOptions: shuffledOptions,
      selectedAnswer: null,
      isAnswerVerified: false,
      isCurrentQuestionVerified: false,
      hasPreviousQuestion: true,
      hasNextQuestion: true,
      canSkip: false,
      remainingSkips: null,
      hasFeedbackEnabled: false,
      ...overrides,
    },
  })
}

function radios(wrapper: VueWrapper) {
  return wrapper.findAll('input[type="radio"]')
}

function radioLabels(wrapper: VueWrapper): string[] {
  return radios(wrapper).map((radio) => {
    const element = radio.element as HTMLInputElement
    return element.labels?.[0]?.textContent?.trim() ?? ''
  })
}

function optionStates(wrapper: VueWrapper): { text: string; state: string | undefined }[] {
  return wrapper.findAll('[data-state]').map((element) => ({
    text: element.text().trim(),
    state: element.attributes('data-state'),
  }))
}

function button(wrapper: VueWrapper, label: string) {
  return wrapper.findAll('button').find((candidate) => candidate.text().trim() === label)
}

function cardTitle(wrapper: VueWrapper | DOMWrapper<Element>) {
  return wrapper
    .findAll('h1,h2,h3,h4,h5,h6')
    .find((heading) => heading.text() === baseQuestion.text)
}

describe('QuizQuestionCard', () => {
  it('renders the question text as the card title', () => {
    const wrapper = mountCard()

    expect(cardTitle(wrapper)).toBeDefined()
  })

  it('renders one radio per option, in the given order, with the option as its label', () => {
    const wrapper = mountCard()

    expect(radios(wrapper)).toHaveLength(2)
    expect(radioLabels(wrapper)).toEqual(['4', '3'])
  })

  it('gives each radio the original index as its value and the question id as its name', () => {
    const wrapper = mountCard()

    const inputs = radios(wrapper).map((radio) => radio.element as HTMLInputElement)
    expect(inputs.map((input) => input.value)).toEqual(['1', '0'])
    expect(inputs.map((input) => input.name)).toEqual(['q1', 'q1'])
  })

  it.each([
    [0, 1],
    [1, 0],
  ])(
    'emits select with the original index when radio %s is checked',
    async (position, expected) => {
      const wrapper = mountCard()

      await radios(wrapper)[position]!.setValue()

      expect(wrapper.emitted('select')?.[0]).toEqual([expected])
    },
  )

  it('marks the selected option while the answer is not verified', () => {
    const wrapper = mountCard({ selectedAnswer: 1 })

    expect(optionStates(wrapper)).toEqual([
      { text: '4', state: 'selected' },
      { text: '3', state: 'plain' },
    ])
  })

  it('marks every option plain when nothing is selected', () => {
    const wrapper = mountCard()

    expect(optionStates(wrapper)).toEqual([
      { text: '4', state: 'plain' },
      { text: '3', state: 'plain' },
    ])
  })

  it('marks the correct option and the wrongly selected one once verified', () => {
    const wrapper = mountCard({
      selectedAnswer: 0,
      isAnswerVerified: true,
      isCurrentQuestionVerified: true,
    })

    expect(optionStates(wrapper)).toEqual([
      { text: '4', state: 'correct' },
      { text: '3', state: 'wrong' },
    ])
  })

  it('leaves the unselected, incorrect options plain once verified', () => {
    const wrapper = mountCard({
      question: {
        id: 'q2',
        text: 'Pick C',
        options: ['A', 'B', 'C'],
        correctAnswerIndex: 2,
      },
      questionOptions: [
        { option: 'A', originalIndex: 0 },
        { option: 'C', originalIndex: 2 },
        { option: 'B', originalIndex: 1 },
      ],
      selectedAnswer: 0,
      isAnswerVerified: true,
      isCurrentQuestionVerified: true,
    })

    expect(optionStates(wrapper)).toEqual([
      { text: 'A', state: 'wrong' },
      { text: 'C', state: 'correct' },
      { text: 'B', state: 'plain' },
    ])
  })

  it('disables the radios once verified', () => {
    const wrapper = mountCard({
      selectedAnswer: 1,
      isAnswerVerified: true,
      isCurrentQuestionVerified: true,
    })

    for (const radio of radios(wrapper)) {
      expect(radio.attributes('disabled')).toBeDefined()
    }
  })

  it.each([
    [true, 'Next'],
    [false, 'Finish'],
  ])(
    'shows %s hasNextQuestion as %s and submits without feedback',
    async (hasNextQuestion, label) => {
      const wrapper = mountCard({ selectedAnswer: 1, hasNextQuestion })

      const primary = button(wrapper, label)
      expect(primary).toBeDefined()
      await primary?.trigger('click')

      expect(wrapper.emitted('submit')).toHaveLength(1)
    },
  )

  it('shows Check while feedback is on and the current answer is not verified', async () => {
    const wrapper = mountCard({ selectedAnswer: 1, hasFeedbackEnabled: true })

    const check = button(wrapper, 'Check')
    expect(check).toBeDefined()
    await check?.trigger('click')

    expect(wrapper.emitted('verify')).toHaveLength(1)
  })

  it.each([
    [true, 'Next'],
    [false, 'Finish'],
  ])('continues with %s hasNextQuestion as %s once verified', async (hasNextQuestion, label) => {
    const wrapper = mountCard({
      selectedAnswer: 1,
      hasFeedbackEnabled: true,
      isAnswerVerified: true,
      isCurrentQuestionVerified: true,
      hasNextQuestion,
    })

    const primary = button(wrapper, label)
    expect(primary).toBeDefined()
    await primary?.trigger('click')

    expect(wrapper.emitted('continue')).toHaveLength(1)
  })

  it('disables the primary action while nothing is selected and the question is not verified', () => {
    const wrapper = mountCard()

    expect(button(wrapper, 'Next')?.attributes('disabled')).toBeDefined()
  })

  it('keeps the primary action disabled without a selection even once verified when feedback is off', () => {
    const wrapper = mountCard({ isCurrentQuestionVerified: true })

    expect(button(wrapper, 'Next')?.attributes('disabled')).toBeDefined()
  })

  it('disables Previous without a previous question', () => {
    const wrapper = mountCard({ hasPreviousQuestion: false })

    expect(button(wrapper, 'Previous')?.attributes('disabled')).toBeDefined()
  })

  it('disables Previous when the question has its own time limit', () => {
    const wrapper = mountCard({ question: { ...baseQuestion, timeLimit: 30 } })

    expect(button(wrapper, 'Previous')?.attributes('disabled')).toBeDefined()
  })

  it('enables Previous with a previous question and no per-question time limit', () => {
    const wrapper = mountCard()

    expect(button(wrapper, 'Previous')?.attributes('disabled')).toBeUndefined()
  })

  it('hides Skip when skipping is not allowed', () => {
    const wrapper = mountCard({ canSkip: false })

    expect(
      wrapper.findAll('button').some((candidate) => candidate.text().trim().startsWith('Skip')),
    ).toBe(false)
  })

  it('labels Skip without a count when skips are unlimited', () => {
    const wrapper = mountCard({ canSkip: true, remainingSkips: null })

    expect(button(wrapper, 'Skip')).toBeDefined()
  })

  it('labels Skip with the remaining count', () => {
    const wrapper = mountCard({ canSkip: true, remainingSkips: 3 })

    expect(button(wrapper, 'Skip (3)')).toBeDefined()
  })

  it('emits skip when Skip is pressed', async () => {
    const wrapper = mountCard({ canSkip: true, remainingSkips: 2 })

    await button(wrapper, 'Skip (2)')?.trigger('click')

    expect(wrapper.emitted('skip')).toHaveLength(1)
  })

  it('renders the context as Markdown after the heading and before the options', () => {
    const wrapper = mountCard({
      question: {
        ...baseQuestion,
        context: '```ts\nconst answer = 42\n```',
      },
    })

    const html = wrapper.html()
    const heading = html.indexOf(baseQuestion.text)
    const prose = html.indexOf('quiz-prose')
    const firstOption = html.indexOf('type="radio"')

    expect(prose).toBeGreaterThan(heading)
    expect(prose).toBeLessThan(firstOption)
    expect(wrapper.find('.quiz-prose pre').exists()).toBe(true)
    expect(wrapper.find('.quiz-prose').text()).toContain('const answer = 42')
  })

  it('keeps the question text as the heading when a context is present', () => {
    const wrapper = mountCard({ question: { ...baseQuestion, context: 'Some context.' } })

    expect(cardTitle(wrapper)).toBeDefined()
  })

  it('renders no prose block without a context', () => {
    const wrapper = mountCard()

    expect(wrapper.find('.quiz-prose').exists()).toBe(false)
  })

  it('renders the options after the heading', () => {
    const wrapper = mountCard()
    const html = wrapper.html()

    expect(html.indexOf('type="radio"')).toBeGreaterThan(html.indexOf(baseQuestion.text))
  })

  it('keeps the heading, the context and the options inside the scroll area', () => {
    const wrapper = mountCard({ question: { ...baseQuestion, context: 'Some context.' } })

    const scroll = wrapper.find('.quiz-question-scroll')
    expect(scroll.exists()).toBe(true)
    expect(cardTitle(scroll)).toBeDefined()
    expect(scroll.find('.quiz-prose').exists()).toBe(true)
    expect(scroll.findAll('input[type="radio"]')).toHaveLength(2)
  })

  it('keeps the action controls outside the scroll area', () => {
    const wrapper = mountCard({ canSkip: true, remainingSkips: 2 })

    const scroll = wrapper.find('.quiz-question-scroll')

    for (const label of ['Previous', 'Skip (2)', 'Next']) {
      const action = button(wrapper, label)
      expect(action).toBeDefined()
      expect(scroll.element.contains(action!.element)).toBe(false)
    }
  })
})
