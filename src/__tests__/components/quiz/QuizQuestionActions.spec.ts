import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import QuizQuestionActions from '../../../components/quiz/card/QuizQuestionActions.vue'
import { accessibleName, buttonNamed, normalize } from '../../support/accessibility'

type ActionsProps = {
  hasPreviousQuestion: boolean
  hasNextQuestion: boolean
  canSkip: boolean
  remainingSkips: number | null
  hasFeedbackEnabled: boolean
  isCurrentQuestionVerified: boolean
  selectedAnswer: number | null
  hasTimeLimit: boolean
}

const baseProps: ActionsProps = {
  hasPreviousQuestion: true,
  hasNextQuestion: true,
  canSkip: false,
  remainingSkips: null,
  hasFeedbackEnabled: false,
  isCurrentQuestionVerified: false,
  selectedAnswer: 1,
  hasTimeLimit: false,
}

function mountActions(overrides: Partial<ActionsProps> = {}) {
  return mount(QuizQuestionActions, { props: { ...baseProps, ...overrides } })
}

/** Every control the bar exposes, by accessible name, in document order. */
function labels(wrapper: ReturnType<typeof mountActions>): string[] {
  return wrapper.findAll('button').map((candidate) => normalize(accessibleName(candidate.element)))
}

function skipControl(wrapper: ReturnType<typeof mountActions>) {
  return wrapper
    .findAll('button')
    .find((candidate) => normalize(accessibleName(candidate.element)).startsWith('Skip'))
}

describe('QuizQuestionActions', () => {
  describe('Previous', () => {
    it('is disabled without a previous question', () => {
      const wrapper = mountActions({ hasPreviousQuestion: false })

      expect(buttonNamed(wrapper, 'Previous').attributes('disabled')).toBeDefined()
    })

    it('is disabled when the question carries a time limit', () => {
      const wrapper = mountActions({ hasTimeLimit: true })

      expect(buttonNamed(wrapper, 'Previous').attributes('disabled')).toBeDefined()
    })

    it('is enabled with a previous question and no time limit', () => {
      const wrapper = mountActions({ hasPreviousQuestion: true, hasTimeLimit: false })

      expect(buttonNamed(wrapper, 'Previous').attributes('disabled')).toBeUndefined()
    })

    it('emits previous when pressed', async () => {
      const wrapper = mountActions()

      await buttonNamed(wrapper, 'Previous').trigger('click')

      expect(wrapper.emitted('previous')).toHaveLength(1)
    })
  })

  describe('Skip', () => {
    it('is not rendered when skipping is not allowed', () => {
      const wrapper = mountActions({ canSkip: false })

      expect(labels(wrapper).filter((label) => label.startsWith('Skip'))).toEqual([])
    })

    it('is labelled without a count when skips are unlimited', () => {
      const wrapper = mountActions({ canSkip: true, remainingSkips: null })

      expect(buttonNamed(wrapper, 'Skip')).toBeDefined()
    })

    it('carries the remaining count in its label', () => {
      const wrapper = mountActions({ canSkip: true, remainingSkips: 2 })

      expect(buttonNamed(wrapper, 'Skip (2)')).toBeDefined()
    })

    it('is enabled while skipping is allowed', () => {
      const wrapper = mountActions({ canSkip: true, remainingSkips: 3 })

      expect(skipControl(wrapper)?.attributes('disabled')).toBeUndefined()
    })

    it('emits skip when pressed', async () => {
      const wrapper = mountActions({ canSkip: true, remainingSkips: 2 })

      await buttonNamed(wrapper, 'Skip (2)').trigger('click')

      expect(wrapper.emitted('skip')).toHaveLength(1)
    })
  })

  describe('primary control', () => {
    it('reads Check with feedback on, an answer selected and the question not verified', () => {
      const wrapper = mountActions({
        hasFeedbackEnabled: true,
        selectedAnswer: 1,
        isCurrentQuestionVerified: false,
      })

      expect(buttonNamed(wrapper, 'Check')).toBeDefined()
    })

    it('emits verify when Check is pressed', async () => {
      const wrapper = mountActions({ hasFeedbackEnabled: true, selectedAnswer: 1 })

      await buttonNamed(wrapper, 'Check').trigger('click')

      expect(wrapper.emitted('verify')).toHaveLength(1)
    })

    it('does not read Check without feedback', () => {
      const wrapper = mountActions({ hasFeedbackEnabled: false, selectedAnswer: 1 })

      expect(labels(wrapper)).not.toContain('Check')
      expect(buttonNamed(wrapper, 'Next')).toBeDefined()
    })

    it('does not read Check without a selected answer', () => {
      const wrapper = mountActions({
        hasFeedbackEnabled: true,
        selectedAnswer: null,
      })

      expect(labels(wrapper)).not.toContain('Check')
      expect(buttonNamed(wrapper, 'Next')).toBeDefined()
    })

    it('does not read Check once the question is verified', () => {
      const wrapper = mountActions({
        hasFeedbackEnabled: true,
        selectedAnswer: 1,
        isCurrentQuestionVerified: true,
      })

      expect(labels(wrapper)).not.toContain('Check')
      expect(buttonNamed(wrapper, 'Next')).toBeDefined()
    })

    it('emits continue from the primary action after verification with feedback on', async () => {
      const wrapper = mountActions({
        hasFeedbackEnabled: true,
        selectedAnswer: 1,
        isCurrentQuestionVerified: true,
      })

      const primary = wrapper
        .findAll('button')
        .find((candidate) =>
          ['Next', 'Finish'].includes(normalize(accessibleName(candidate.element))),
        )

      expect(primary).toBeDefined()
      await primary!.trigger('click')

      expect(wrapper.emitted('continue')).toHaveLength(1)
      expect(wrapper.emitted('submit')).toBeUndefined()
    })

    it('emits continue from the Finish label on the last verified question', async () => {
      const wrapper = mountActions({
        hasFeedbackEnabled: true,
        hasNextQuestion: false,
        selectedAnswer: 1,
        isCurrentQuestionVerified: true,
      })

      await buttonNamed(wrapper, 'Finish').trigger('click')

      expect(wrapper.emitted('continue')).toHaveLength(1)
    })

    it.each([
      [true, 'Next'],
      [false, 'Finish'],
    ])('reads %s hasNextQuestion as %s without feedback', (hasNextQuestion, label) => {
      const wrapper = mountActions({
        hasNextQuestion,
        hasFeedbackEnabled: false,
        selectedAnswer: 1,
      })

      expect(buttonNamed(wrapper, label)).toBeDefined()
    })

    it.each([
      [true, 'Next'],
      [false, 'Finish'],
    ])(
      'emits submit from %s hasNextQuestion as %s without feedback',
      async (hasNextQuestion, label) => {
        const wrapper = mountActions({
          hasNextQuestion,
          hasFeedbackEnabled: false,
          selectedAnswer: 1,
        })

        await buttonNamed(wrapper, label).trigger('click')

        expect(wrapper.emitted('submit')).toHaveLength(1)
      },
    )

    it('is disabled while nothing is selected and the question is not verified', () => {
      const wrapper = mountActions({ selectedAnswer: null, isCurrentQuestionVerified: false })

      expect(buttonNamed(wrapper, 'Next').attributes('disabled')).toBeDefined()
    })

    it('is enabled with a selected answer', () => {
      const wrapper = mountActions({ selectedAnswer: 0 })

      expect(buttonNamed(wrapper, 'Next').attributes('disabled')).toBeUndefined()
    })

    it('is enabled once verified even without a selection', () => {
      const wrapper = mountActions({
        hasFeedbackEnabled: true,
        selectedAnswer: null,
        isCurrentQuestionVerified: true,
      })

      expect(buttonNamed(wrapper, 'Next').attributes('disabled')).toBeUndefined()
    })
  })
})
