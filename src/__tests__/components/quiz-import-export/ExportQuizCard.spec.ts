import { accessibleName, buttonNamed } from '../../support/accessibility'
import { describe, it, expect, beforeEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import ExportQuizCard from '../../../components/quiz-import-export/ExportQuizCard.vue'
import { useQuizStore } from '@/stores'
import { setupTestPinia } from '../../stores/setup'

const ALPHA_QUESTION = 'Capital of France?'
const BETA_QUESTION = 'Which river crosses Paris?'

const alphaQuiz = {
  id: 'quiz-alpha',
  title: 'World capitals',
  description: 'Name the capital city of each country.',
  questions: [
    {
      id: 'alpha-q1',
      text: ALPHA_QUESTION,
      options: ['Paris', 'Lyon'],
      correctAnswerIndex: 0,
    },
  ],
}

const betaQuiz = {
  id: 'quiz-beta',
  title: 'Rivers of Europe',
  description: 'Name the river that crosses each city.',
  questions: [
    {
      id: 'beta-q1',
      text: BETA_QUESTION,
      options: ['The Seine', 'The Loire'],
      correctAnswerIndex: 0,
    },
  ],
}

function mountCard() {
  return mount(ExportQuizCard)
}

function seed(...quizzes: Array<typeof alphaQuiz>) {
  const store = useQuizStore()
  for (const quiz of quizzes) store.addQuiz(quiz)
  return store
}

function selectControl(wrapper: VueWrapper) {
  return wrapper.get('select')
}

function optionNamed(wrapper: VueWrapper, name: string) {
  const option = wrapper.findAll('option').find((candidate) => candidate.text().trim() === name)
  if (!option) throw new Error(`No option named "${name}"`)
  return option
}

async function choose(wrapper: VueWrapper, name: string): Promise<void> {
  const option = optionNamed(wrapper, name)
  await selectControl(wrapper).setValue((option.element as HTMLOptionElement).value)
}

describe('ExportQuizCard', () => {
  beforeEach(() => {
    setupTestPinia()
  })

  it('labels the select Quiz to export', () => {
    const wrapper = mountCard()

    expect(accessibleName(selectControl(wrapper).element)).toBe('Quiz to export')
  })

  it('offers All quizzes first, then one option per quiz title', () => {
    seed(alphaQuiz, betaQuiz)

    const wrapper = mountCard()

    expect(wrapper.findAll('option').map((option) => option.text().trim())).toEqual([
      'All quizzes',
      'World capitals',
      'Rivers of Europe',
    ])
  })

  it('disables the select when the catalogue is empty', () => {
    const wrapper = mountCard()

    expect(selectControl(wrapper).attributes('disabled')).toBeDefined()
  })

  it('keeps Export selected disabled until a quiz is chosen', () => {
    seed(alphaQuiz, betaQuiz)

    const wrapper = mountCard()

    expect(buttonNamed(wrapper, 'Export selected').attributes('disabled')).toBeDefined()
  })

  it('emits export-single with the chosen quiz id', async () => {
    seed(alphaQuiz, betaQuiz)
    const wrapper = mountCard()

    await choose(wrapper, 'Rivers of Europe')
    const button = buttonNamed(wrapper, 'Export selected')
    expect(button.attributes('disabled')).toBeUndefined()

    await button.trigger('click')

    expect(wrapper.emitted('export-single')).toEqual([[betaQuiz.id]])
  })

  it('emits export-all from the Export all button', async () => {
    seed(alphaQuiz, betaQuiz)
    const wrapper = mountCard()

    await buttonNamed(wrapper, 'Export all').trigger('click')

    expect(wrapper.emitted('export-all')).toHaveLength(1)
  })

  it('emits copy with the chosen quiz id', async () => {
    seed(alphaQuiz, betaQuiz)
    const wrapper = mountCard()

    await choose(wrapper, 'World capitals')
    await buttonNamed(wrapper, 'Copy to clipboard').trigger('click')

    expect(wrapper.emitted('copy')).toEqual([[alphaQuiz.id]])
  })

  it('emits copy with null when All quizzes is selected', async () => {
    seed(alphaQuiz, betaQuiz)
    const wrapper = mountCard()

    await choose(wrapper, 'All quizzes')
    await buttonNamed(wrapper, 'Copy to clipboard').trigger('click')

    expect(wrapper.emitted('copy')).toEqual([[null]])
  })

  it('renders the preview only once a quiz is chosen', async () => {
    seed(alphaQuiz, betaQuiz)
    const wrapper = mountCard()

    expect(wrapper.text()).not.toContain(alphaQuiz.id)
    expect(wrapper.text()).not.toContain(ALPHA_QUESTION)

    await choose(wrapper, 'World capitals')

    expect(wrapper.text()).toContain(alphaQuiz.id)
    expect(wrapper.text()).toContain(ALPHA_QUESTION)
    expect(wrapper.text()).not.toContain(betaQuiz.id)
  })
})
