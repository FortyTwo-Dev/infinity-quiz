import { describe, it, expect } from 'vitest'
import { nextTick } from 'vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import QuizInfoModal from '../../../components/quiz/modal/QuizInfoModal.vue'
import { ItBadge } from '@/components/itheme'
import { installDialogSupport } from '../../support/dialog'

installDialogSupport()

type ModalProps = {
  title: string
  description: string
  primaryTag?: string
  tags?: string[]
  status?: 'not-attempted' | 'failed' | 'partial' | 'passed'
  questionCount?: number
  timeLimit?: number
  hasIndividualQuestionTimeLimits?: boolean
  shuffleQuestions?: boolean
  shuffleAnswers?: boolean
  maxSkips?: number
  enableReviewMode?: boolean
  feedbackEnabled?: boolean
}

function mountModal(overrides: Partial<ModalProps> = {}) {
  return mount(QuizInfoModal, {
    props: {
      title: 'Capitals',
      description: 'A quiz about capitals.',
      ...overrides,
    },
  })
}

function dialogOf(wrapper: VueWrapper): HTMLDialogElement {
  return wrapper.get('dialog').element as HTMLDialogElement
}

async function openModal(wrapper: VueWrapper): Promise<void> {
  ;(wrapper.vm as unknown as { open: () => void }).open()
  await nextTick()
}

function stats(wrapper: VueWrapper): Record<string, string> {
  const result: Record<string, string> = {}
  for (const term of wrapper.findAll('dt')) {
    result[term.text().trim()] = term.element.nextElementSibling?.textContent?.trim() ?? ''
  }
  return result
}

function optionBadges(wrapper: VueWrapper) {
  return wrapper
    .findAllComponents(ItBadge)
    .filter((badge) => /^.+:\s*(Yes|No)$/.test(badge.text().trim()))
}

function badgeWithText(wrapper: VueWrapper, text: string) {
  return wrapper.findAllComponents(ItBadge).find((badge) => badge.text().trim() === text)
}

describe('QuizInfoModal', () => {
  it('renders closed initially', () => {
    const wrapper = mountModal()

    expect(dialogOf(wrapper).open).toBe(false)
  })

  it('shows the title and description once opened', async () => {
    const wrapper = mountModal()

    await openModal(wrapper)

    expect(dialogOf(wrapper).open).toBe(true)
    expect(wrapper.text()).toContain('Capitals')
    expect(wrapper.text()).toContain('A quiz about capitals.')
  })

  it('closes when the Close button is pressed', async () => {
    const wrapper = mountModal()
    await openModal(wrapper)

    await wrapper
      .findAll('button')
      .find((candidate) => candidate.text().trim() === 'Close')
      ?.trigger('click')

    expect(dialogOf(wrapper).open).toBe(false)
  })

  it('defaults the statistics to zero, none and unlimited', () => {
    const wrapper = mountModal()

    expect(stats(wrapper)).toMatchObject({
      Questions: '0',
      'Time limit': 'None',
      'Max skips': 'Unlimited',
    })
  })

  it('shows the given statistics', () => {
    const wrapper = mountModal({ questionCount: 12, timeLimit: 120, maxSkips: 4 })

    expect(stats(wrapper)).toMatchObject({
      Questions: '12',
      'Time limit': '120s',
      'Max skips': '4',
    })
  })

  it('reports every option as No when the booleans are omitted', () => {
    const wrapper = mountModal()

    const badges = optionBadges(wrapper)
    expect(badges).toHaveLength(5)
    for (const badge of badges) {
      expect(badge.text().trim()).toMatch(/:\s*No$/)
    }
  })

  it('reports every option as Yes when the booleans are set', () => {
    const wrapper = mountModal({
      hasIndividualQuestionTimeLimits: true,
      shuffleQuestions: true,
      shuffleAnswers: true,
      maxSkips: 3,
      enableReviewMode: true,
      feedbackEnabled: true,
    })

    const badges = optionBadges(wrapper)
    expect(badges).toHaveLength(5)
    for (const badge of badges) {
      expect(badge.text().trim()).toMatch(/:\s*Yes$/)
    }
  })

  it('reports only the set option as Yes', () => {
    const wrapper = mountModal({ shuffleQuestions: true })

    const badges = optionBadges(wrapper)
    expect(badges.filter((badge) => /:\s*Yes$/.test(badge.text().trim()))).toHaveLength(1)
    expect(badges.filter((badge) => /:\s*No$/.test(badge.text().trim()))).toHaveLength(4)
  })

  it('renders the primary tag and every tag as a badge', () => {
    const wrapper = mountModal({ primaryTag: 'Geography', tags: ['Europe', 'Asia'] })

    expect(badgeWithText(wrapper, 'Geography')).toBeDefined()
    expect(badgeWithText(wrapper, 'Europe')).toBeDefined()
    expect(badgeWithText(wrapper, 'Asia')).toBeDefined()
  })

  it.each<[ModalProps['status'], string]>([
    ['not-attempted', 'Not attempted'],
    ['failed', 'Failed'],
    ['partial', 'Partial'],
    ['passed', 'Passed'],
  ])('labels the status %s as %s', (status, label) => {
    const wrapper = mountModal({ status })

    expect(badgeWithText(wrapper, label)).toBeDefined()
  })

  it.each<[NonNullable<ModalProps['status']>, string, string]>([
    ['not-attempted', 'Not attempted', 'neutral'],
    ['failed', 'Failed', 'danger'],
    ['partial', 'Partial', 'warning'],
    ['passed', 'Passed', 'success'],
  ])('gives the %s status the %s label and %s variant', (status, label, variant) => {
    const wrapper = mountModal({ status })

    expect(badgeWithText(wrapper, label)?.props('variant')).toBe(variant)
  })

  it('omits the status section when no status is given', () => {
    const wrapper = mountModal()

    const text = wrapper.text()
    expect(text).not.toContain('Not attempted')
    expect(text).not.toContain('Failed')
    expect(text).not.toContain('Partial')
    expect(text).not.toContain('Passed')
  })
})
