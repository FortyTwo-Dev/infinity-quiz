import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import QuizReviewStep from '../../../components/quiz/form/QuizReviewStep.vue'

type ReviewValues = {
  title: string
  description: string
  category?: string
  tags: string[]
  theme?: string
  timeLimit?: number
  maxSkips?: number
  shuffleQuestions: boolean
  shuffleAnswers: boolean
  enableReviewMode: boolean
  feedbackEnabled: boolean
  questions: Array<{
    text: string
    options: string[]
    correctAnswerIndex: number
    context?: string
  }>
}

const baseValues: ReviewValues = {
  title: 'World capitals',
  description: 'Name the capital city of each country.',
  category: 'Geography',
  tags: ['geography', 'capitals'],
  theme: 'light-green',
  timeLimit: 120,
  maxSkips: 4,
  shuffleQuestions: true,
  shuffleAnswers: false,
  enableReviewMode: true,
  feedbackEnabled: false,
  questions: [
    {
      text: 'What is the capital of France?',
      options: ['Paris', 'Lyon', 'Marseille', 'Nice', 'Bordeaux'],
      correctAnswerIndex: 0,
    },
    {
      text: 'What is the capital of Italy?',
      options: ['Rome', 'Milan'],
      correctAnswerIndex: 0,
    },
  ],
}

function mountStep(overrides: Partial<ReviewValues> = {}) {
  return mount(QuizReviewStep, { props: { values: { ...baseValues, ...overrides } } })
}

function text(wrapper: ReturnType<typeof mountStep>): string {
  return wrapper.text().replace(/\s+/g, ' ').trim()
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function hasRow(rendered: string, label: string, value: string): boolean {
  return new RegExp(`${escapeRegExp(label)}\\s*${escapeRegExp(value)}`).test(rendered)
}

const settingLabels = [
  'Time limit',
  'Max skips',
  'Shuffle questions',
  'Shuffle answers',
  'Review mode',
  'Immediate feedback',
  'Theme',
]

describe('QuizReviewStep', () => {
  it('renders the title and the description', () => {
    const rendered = text(mountStep())

    expect(rendered).toContain('World capitals')
    expect(rendered).toContain('Name the capital city of each country.')
  })

  it('shows the category as a badge', () => {
    expect(text(mountStep({ category: 'Geography' }))).toContain('Geography')
  })

  it('falls back to Uncategorized when the category is empty', () => {
    expect(text(mountStep({ category: '' }))).toContain('Uncategorized')
  })

  it('falls back to Uncategorized when the category is absent', () => {
    expect(text(mountStep({ category: undefined }))).toContain('Uncategorized')
  })

  it('renders every tag as a badge', () => {
    const rendered = text(mountStep({ tags: ['history', 'science'] }))

    expect(rendered).toContain('history')
    expect(rendered).toContain('science')
  })

  it('renders the seven setting rows in order', () => {
    const rendered = text(mountStep())

    const positions = settingLabels.map((label) => rendered.indexOf(label))
    expect(positions.every((position) => position >= 0)).toBe(true)
    expect(positions).toEqual([...positions].sort((left, right) => left - right))
  })

  it('renders the time limit in seconds', () => {
    expect(hasRow(text(mountStep({ timeLimit: 120 })), 'Time limit', '120s')).toBe(true)
  })

  it('renders the time limit as None when undefined', () => {
    expect(hasRow(text(mountStep({ timeLimit: undefined })), 'Time limit', 'None')).toBe(true)
  })

  it('renders a positive max skips count', () => {
    expect(hasRow(text(mountStep({ maxSkips: 4 })), 'Max skips', '4')).toBe(true)
  })

  it('renders zero max skips when skips are unlimited in practice', () => {
    expect(hasRow(text(mountStep({ maxSkips: 0 })), 'Max skips', '0')).toBe(true)
  })

  it('renders max skips as Unlimited when undefined', () => {
    expect(hasRow(text(mountStep({ maxSkips: undefined })), 'Max skips', 'Unlimited')).toBe(true)
  })

  it('renders the enabled toggles as Yes', () => {
    const rendered = text(
      mountStep({
        shuffleQuestions: true,
        shuffleAnswers: true,
        enableReviewMode: true,
        feedbackEnabled: true,
      }),
    )

    expect(hasRow(rendered, 'Shuffle questions', 'Yes')).toBe(true)
    expect(hasRow(rendered, 'Shuffle answers', 'Yes')).toBe(true)
    expect(hasRow(rendered, 'Review mode', 'Yes')).toBe(true)
    expect(hasRow(rendered, 'Immediate feedback', 'Yes')).toBe(true)
  })

  it('renders the disabled toggles as No', () => {
    const rendered = text(
      mountStep({
        shuffleQuestions: false,
        shuffleAnswers: false,
        enableReviewMode: false,
        feedbackEnabled: false,
      }),
    )

    expect(hasRow(rendered, 'Shuffle questions', 'No')).toBe(true)
    expect(hasRow(rendered, 'Shuffle answers', 'No')).toBe(true)
    expect(hasRow(rendered, 'Review mode', 'No')).toBe(true)
    expect(hasRow(rendered, 'Immediate feedback', 'No')).toBe(true)
  })

  it('renders the selected theme', () => {
    expect(hasRow(text(mountStep({ theme: 'dark-green' })), 'Theme', 'dark-green')).toBe(true)
  })

  it('renders the theme as Default when absent', () => {
    expect(hasRow(text(mountStep({ theme: undefined })), 'Theme', 'Default')).toBe(true)
  })

  it('renders the question count in the questions card title', () => {
    expect(text(mountStep())).toContain('Questions (2)')
  })

  it('numbers each question from one and renders its options by letter', () => {
    const rendered = text(mountStep())

    expect(rendered).toContain('1. What is the capital of France?')
    expect(rendered).toContain('2. What is the capital of Italy?')
    expect(new RegExp('A\\.\\s*Paris').test(rendered)).toBe(true)
    expect(new RegExp('B\\.\\s*Lyon').test(rendered)).toBe(true)
  })

  it('marks the correct option', () => {
    const rendered = text(mountStep())

    expect(new RegExp('A\\.\\s*Paris\\s*\\(correct\\)').test(rendered)).toBe(true)
    expect(new RegExp('B\\.\\s*Lyon\\s*\\(correct\\)').test(rendered)).toBe(false)
  })

  it('uses a question mark as the letter of an option beyond the fourth', () => {
    const rendered = text(mountStep())

    expect(new RegExp('\\?\\.\\s*Bordeaux').test(rendered)).toBe(true)
  })

  it('renders the question context as Markdown between the question line and its options', () => {
    const wrapper = mountStep({
      questions: [
        {
          text: 'What is the capital of France?',
          options: ['Paris', 'Lyon'],
          correctAnswerIndex: 0,
          context: 'Hint: it starts with **P**.',
        },
      ],
    })

    const prose = wrapper.find('.quiz-prose')
    expect(prose.exists()).toBe(true)
    expect(prose.find('strong').text()).toBe('P')
    expect(prose.text()).not.toContain('**P**')

    const rendered = text(wrapper)
    const question = rendered.indexOf('1. What is the capital of France?')
    const context = rendered.indexOf('Hint: it starts with P.')
    const options = rendered.indexOf('A. Paris')

    expect(question).toBeGreaterThanOrEqual(0)
    expect(context).toBeGreaterThan(question)
    expect(options).toBeGreaterThan(context)
  })

  it('renders no prose block when no question carries a context', () => {
    const wrapper = mountStep()

    expect(wrapper.find('.quiz-prose').exists()).toBe(false)
  })
})
