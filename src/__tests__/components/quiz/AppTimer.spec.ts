import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppTimer from '../../../components/quiz/AppTimer.vue'
import { ItProgress } from '@/components/itheme'

function mountTimer(timeLeft: number | null, timeLimit: number | null) {
  return mount(AppTimer, { props: { timeLeft, timeLimit } })
}

function timeText(wrapper: ReturnType<typeof mountTimer>): string {
  return wrapper.text().trim()
}

function progressValue(wrapper: ReturnType<typeof mountTimer>): number {
  return wrapper.findComponent(ItProgress).props('value') as number
}

describe('AppTimer', () => {
  it('shows 00:00 and no progress bar when timeLeft is null', () => {
    const wrapper = mountTimer(null, 120)

    expect(timeText(wrapper)).toBe('00:00')
    expect(wrapper.find('progress').exists()).toBe(false)
    expect(wrapper.attributes('data-low')).toBe('false')
  })

  it.each([
    [65, '01:05'],
    [5, '00:05'],
    [600, '10:00'],
    [0, '00:00'],
  ])('formats %s seconds as %s', (timeLeft, expected) => {
    expect(timeText(mountTimer(timeLeft, null))).toBe(expected)
  })

  it('renders a labelled progress bar when timeLimit and timeLeft are both given', () => {
    const wrapper = mountTimer(65, 120)

    const bar = wrapper.find('progress')
    expect(bar.exists()).toBe(true)
    expect(bar.attributes('aria-label')).toBe('Time remaining')
  })

  it.each([
    [65, null],
    [65, 0],
    [null, 120],
    [null, null],
  ])('renders no progress bar for timeLeft %s and timeLimit %s', (timeLeft, timeLimit) => {
    const wrapper = mountTimer(timeLeft, timeLimit)

    expect(wrapper.find('progress').exists()).toBe(false)
  })

  it.each([
    [600, 600, 0],
    [300, 600, 50],
    [0, 600, 100],
    [700, 600, 0],
    [65, 120, 45.83],
  ])('computes progress %s/%s as %s', (timeLeft, timeLimit, expected) => {
    expect(progressValue(mountTimer(timeLeft, timeLimit))).toBeCloseTo(expected, 2)
  })

  it.each([
    [12, 120, 'warning'],
    [10, 120, 'warning'],
    [13, 120, 'accent'],
    [65, 120, 'accent'],
    [60, 600, 'warning'],
    [61, 600, 'accent'],
  ])('uses variant $2 for timeLeft $0 and timeLimit $1', (timeLeft, timeLimit, expected) => {
    const wrapper = mountTimer(timeLeft, timeLimit)

    expect(wrapper.findComponent(ItProgress).props('variant')).toBe(expected)
  })

  it.each([
    [65, 120, 'false'],
    [13, 120, 'false'],
    [12, 120, 'true'],
    [10, 120, 'true'],
    [31, null, 'false'],
    [30, null, 'true'],
    [20, null, 'true'],
    [20, 0, 'true'],
    [0, 120, 'false'],
    [null, 120, 'false'],
    [-5, 120, 'false'],
  ])('marks low as $2 for timeLeft $0 and timeLimit $1', (timeLeft, timeLimit, expected) => {
    expect(mountTimer(timeLeft, timeLimit).attributes('data-low')).toBe(expected)
  })

  it('describes the 65 of 120 seconds case end to end', () => {
    const wrapper = mountTimer(65, 120)

    expect(timeText(wrapper)).toBe('01:05')
    expect(progressValue(wrapper)).toBeCloseTo(45.83, 2)
    expect(wrapper.attributes('data-low')).toBe('false')
    expect(wrapper.findComponent(ItProgress).props('variant')).toBe('accent')
  })

  it('marks the time low at the ten percent threshold and warns', () => {
    const wrapper = mountTimer(10, 120)

    expect(timeText(wrapper)).toBe('00:10')
    expect(wrapper.attributes('data-low')).toBe('true')
    expect(wrapper.findComponent(ItProgress).props('variant')).toBe('warning')
  })

  it('keeps the low state without a progress bar when timeLimit is missing', () => {
    const wrapper = mountTimer(20, null)

    expect(timeText(wrapper)).toBe('00:20')
    expect(wrapper.attributes('data-low')).toBe('true')
    expect(wrapper.find('progress').exists()).toBe(false)
  })

  it('treats zero seconds as exhausted but not low', () => {
    const wrapper = mountTimer(0, 120)

    expect(timeText(wrapper)).toBe('00:00')
    expect(progressValue(wrapper)).toBe(100)
    expect(wrapper.attributes('data-low')).toBe('false')
  })
})
