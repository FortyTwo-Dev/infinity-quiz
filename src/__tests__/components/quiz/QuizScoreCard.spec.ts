import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import QuizScoreCard from '../../../components/quiz/card/QuizScoreCard.vue'
import { ItBadge, ItProgress } from '@/components/itheme'

type ScoreProps = {
  score: number
  totalQuestions: number
  percentage: number
  passed: boolean
}

const baseProps: ScoreProps = {
  score: 7,
  totalQuestions: 10,
  percentage: 70,
  passed: true,
}

function mountCard(props: Partial<ScoreProps> = {}, slots: Record<string, string> = {}) {
  return mount(QuizScoreCard, { props: { ...baseProps, ...props }, slots })
}

function paragraphTexts(wrapper: ReturnType<typeof mountCard>) {
  return wrapper.findAll('p').map((paragraph) => paragraph.text())
}

function statValues(wrapper: ReturnType<typeof mountCard>) {
  return wrapper.findAll('dd').map((value) => value.text())
}

describe('QuizScoreCard', () => {
  it('reads the score over the number of questions', () => {
    const wrapper = mountCard()

    expect(paragraphTexts(wrapper)).toContain('7/10')
  })

  it('displays the percentage', () => {
    const wrapper = mountCard()

    expect(paragraphTexts(wrapper).filter((text) => text === '70%')).toHaveLength(1)
  })

  it('repeats the percentage in the accuracy row', () => {
    const wrapper = mountCard()

    expect(statValues(wrapper)[0]).toBe('70%')
  })

  it('reads Passed in the result row when the quiz is passed', () => {
    const wrapper = mountCard({ passed: true })

    expect(statValues(wrapper)[1]).toBe('Passed')
  })

  it('reads Failed in the result row when the quiz is failed', () => {
    const wrapper = mountCard({ score: 3, percentage: 30, passed: false })

    expect(statValues(wrapper)[1]).toBe('Failed')
  })

  it('feeds the score into the progress bar', () => {
    const wrapper = mountCard()
    const bar = wrapper.findComponent(ItProgress)

    expect(bar.props('value')).toBe(7)
    expect(bar.props('max')).toBe(10)
    expect(bar.props('label')).toBe('Correct answers')
  })

  it.each([
    { result: 'passed', passed: true, variant: 'success' },
    { result: 'failed', passed: false, variant: 'danger' },
  ])('uses variant $variant for the progress bar when $result', ({ passed, variant }) => {
    const wrapper = mountCard({ passed })

    expect(wrapper.findComponent(ItProgress).props('variant')).toBe(variant)
  })

  it.each([
    { result: 'passed', passed: true, variant: 'success' },
    { result: 'failed', passed: false, variant: 'danger' },
  ])('uses variant $variant for the badge when $result', ({ passed, variant }) => {
    const wrapper = mountCard({ passed })

    expect(wrapper.findComponent(ItBadge).props('variant')).toBe(variant)
  })

  it.each([
    { result: 'passed', passed: true, label: 'Congratulations!' },
    { result: 'failed', passed: false, label: 'Try again' },
  ])('shows $label in the badge when $result', ({ passed, label }) => {
    const wrapper = mountCard({ passed })

    expect(wrapper.findComponent(ItBadge).text()).toBe(label)
  })

  it('overrides the success message with the success slot', () => {
    const wrapper = mountCard({ passed: true }, { 'success-message': 'Nailed it, all ten' })

    expect(wrapper.findComponent(ItBadge).text()).toBe('Nailed it, all ten')
    expect(wrapper.text()).not.toContain('Congratulations!')
  })

  it('overrides the failure message with the failure slot', () => {
    const wrapper = mountCard(
      { score: 2, percentage: 20, passed: false },
      { 'failure-message': 'One more try' },
    )

    expect(wrapper.findComponent(ItBadge).text()).toBe('One more try')
    expect(wrapper.text()).not.toContain('Try again')
  })

  it('renders 0/0 without throwing when the quiz has no questions', () => {
    const wrapper = mountCard({ score: 0, totalQuestions: 0, percentage: 0, passed: false })
    const bar = wrapper.findComponent(ItProgress)

    expect(paragraphTexts(wrapper)).toContain('0/0')
    expect(bar.props('value')).toBe(0)
    expect(bar.props('max')).toBe(0)
    expect(statValues(wrapper)[1]).toBe('Failed')
  })
})
