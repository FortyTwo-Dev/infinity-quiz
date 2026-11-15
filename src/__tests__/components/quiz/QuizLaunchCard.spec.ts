import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import QuizLaunchCard from '../../../components/quiz/card/QuizLaunchCard.vue'
import { ItBadge } from '@/components/itheme'

type LaunchProps = {
  id: string
  title: string
  description: string
  primaryTag?: string
  status?: 'not-attempted' | 'failed' | 'partial' | 'passed'
}

const baseProps: LaunchProps = {
  id: 'quiz-1',
  title: 'World capitals',
  description: 'Name the capital city of each country.',
}

function mountCard(props: Partial<LaunchProps> = {}) {
  return mount(QuizLaunchCard, { props: { ...baseProps, ...props } })
}

function button(wrapper: ReturnType<typeof mountCard>, label: string) {
  return wrapper.findAll('button').find((candidate) => candidate.text() === label)
}

describe('QuizLaunchCard', () => {
  it('shows the primary tag in the category badge', () => {
    const wrapper = mountCard({ primaryTag: 'Geography' })

    expect(wrapper.findComponent(ItBadge).text()).toBe('Geography')
  })

  it('falls back to Uncategorized when no primary tag is given', () => {
    const wrapper = mountCard()

    expect(wrapper.findComponent(ItBadge).text()).toBe('Uncategorized')
  })

  it('renders the title and the description', () => {
    const wrapper = mountCard()

    expect(wrapper.text()).toContain('World capitals')
    expect(wrapper.text()).toContain('Name the capital city of each country.')
  })

  it('emits click once when the card itself is clicked', async () => {
    const wrapper = mountCard()

    await wrapper.trigger('click')

    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('emits click once when the launch button is clicked', async () => {
    const wrapper = mountCard()

    await button(wrapper, 'Launch')?.trigger('click')

    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('emits info and no click when the details button is clicked', async () => {
    const wrapper = mountCard()

    await button(wrapper, 'Details')?.trigger('click')

    expect(wrapper.emitted('info')).toHaveLength(1)
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it.each([
    { status: 'not-attempted', label: 'Not attempted', dataStatus: 'neutral' },
    { status: 'failed', label: 'Failed', dataStatus: 'error' },
    { status: 'partial', label: 'Partial', dataStatus: 'warning' },
    { status: 'passed', label: 'Passed', dataStatus: 'success' },
  ])(
    'renders the $status status as $label with data-status $dataStatus',
    ({ status, label, dataStatus }) => {
      const wrapper = mountCard({ status })
      const statusLine = wrapper.find('[data-status]')

      expect(statusLine.exists()).toBe(true)
      expect(statusLine.text()).toBe(label)
      expect(statusLine.attributes('data-status')).toBe(dataStatus)
    },
  )

  it('renders no status line when no status is given', () => {
    const wrapper = mountCard()

    expect(wrapper.find('[data-status]').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('Not attempted')
    expect(wrapper.text()).not.toContain('Passed')
  })
})
