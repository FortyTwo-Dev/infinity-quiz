import { accessibleName, buttonNamed } from '../../support/accessibility'
import { describe, it, expect, beforeEach } from 'vitest'
import { mount, flushPromises, type VueWrapper } from '@vue/test-utils'
import ImportQuizCard from '../../../components/quiz-import-export/ImportQuizCard.vue'
import { useQuizStore } from '@/stores'
import { setupTestPinia } from '../../stores/setup'

const PLACEHOLDER = 'Paste your JSON here…'

const firstQuiz = {
  id: 'imported-one',
  title: 'First Quiz',
  description: 'The first imported quiz.',
  questions: [
    {
      id: 'imported-one-q1',
      text: 'Question one?',
      options: ['a', 'b'],
      correctAnswerIndex: 0,
    },
  ],
}

const secondQuiz = {
  id: 'imported-two',
  title: 'Second Quiz',
  description: 'The second imported quiz.',
  questions: [
    {
      id: 'imported-two-q1',
      text: 'Question two?',
      options: ['a', 'b'],
      correctAnswerIndex: 1,
    },
  ],
}

/** Let the file read and the resulting DOM update land, without a wall clock. */
async function settle(turns = 10): Promise<void> {
  for (let turn = 0; turn < turns; turn += 1) {
    await flushPromises()
    await new Promise((resolve) => {
      setTimeout(resolve, 0)
    })
  }
  await flushPromises()
}

function mountCard() {
  return mount(ImportQuizCard)
}

function textarea(wrapper: VueWrapper) {
  return wrapper.get('textarea')
}

function fileInput(wrapper: VueWrapper) {
  return wrapper.get('input[type="file"]')
}

function feedback(wrapper: VueWrapper): string {
  const alerts = wrapper.findAllComponents({ name: 'ItAlert' }).map((alert) => alert.text())
  const regions = wrapper
    .findAll('[role="alert"], [role="status"], [aria-live]')
    .map((region) => region.text())

  return [...alerts, ...regions].join(' ').replace(/\s+/g, ' ').trim()
}

async function paste(wrapper: VueWrapper, value: string): Promise<void> {
  await textarea(wrapper).setValue(value)
  await settle()
}

async function selectFile(wrapper: VueWrapper, content: string): Promise<void> {
  const input = fileInput(wrapper)
  const file = new File([content], 'quizzes.json', { type: 'application/json' })

  Object.defineProperty(input.element, 'files', { value: [file], configurable: true })
  await input.trigger('change')
  await settle()
}

describe('ImportQuizCard', () => {
  beforeEach(() => {
    setupTestPinia()
  })

  it('invites the user to paste JSON while the textarea is empty', () => {
    const wrapper = mountCard()

    expect(wrapper.text()).toContain(PLACEHOLDER)
  })

  it('previews the number of quizzes in an array', async () => {
    const wrapper = mountCard()

    await paste(wrapper, JSON.stringify([firstQuiz, secondQuiz]))

    expect(wrapper.text()).toContain('Ready to import 2 quizzes')
  })

  it('previews the title of a single quiz', async () => {
    const wrapper = mountCard()

    await paste(wrapper, JSON.stringify(firstQuiz))

    expect(wrapper.text()).toContain(`Ready to import: ${firstQuiz.title}`)
  })

  it('falls back to Untitled quiz for an object without a title', async () => {
    const wrapper = mountCard()
    const { title, ...untitled } = firstQuiz

    await paste(wrapper, JSON.stringify(untitled))

    expect(wrapper.text()).toContain('Ready to import: Untitled quiz')
    expect(wrapper.text()).not.toContain(`Ready to import: ${title}`)
  })

  it('reports malformed JSON as invalid', async () => {
    const wrapper = mountCard()

    await paste(wrapper, '{ not json')

    expect(wrapper.text()).toContain('Invalid JSON')
    expect(wrapper.text()).not.toContain('Ready to import')
  })

  it('disables Clear and Import while the textarea is empty', () => {
    const wrapper = mountCard()

    expect(buttonNamed(wrapper, 'Clear').attributes('disabled')).toBeDefined()
    expect(buttonNamed(wrapper, 'Import').attributes('disabled')).toBeDefined()
  })

  it('enables Clear and Import once the text parses', async () => {
    const wrapper = mountCard()

    await paste(wrapper, JSON.stringify([firstQuiz, secondQuiz]))

    expect(buttonNamed(wrapper, 'Clear').attributes('disabled')).toBeUndefined()
    expect(buttonNamed(wrapper, 'Import').attributes('disabled')).toBeUndefined()
  })

  it('keeps Import disabled while the text is invalid', async () => {
    const wrapper = mountCard()

    await paste(wrapper, '[{ "id": ')

    expect(buttonNamed(wrapper, 'Clear').attributes('disabled')).toBeUndefined()
    expect(buttonNamed(wrapper, 'Import').attributes('disabled')).toBeDefined()
  })

  it('empties the textarea when Clear is pressed', async () => {
    const wrapper = mountCard()
    await paste(wrapper, JSON.stringify(firstQuiz))

    await buttonNamed(wrapper, 'Clear').trigger('click')

    const value = (textarea(wrapper).element as HTMLTextAreaElement).value
    expect(value).toBe('')
    expect(wrapper.text()).toContain(PLACEHOLDER)
  })

  it('imports a valid array through the Import button', async () => {
    const wrapper = mountCard()
    await paste(wrapper, JSON.stringify([firstQuiz, secondQuiz]))

    await buttonNamed(wrapper, 'Import').trigger('click')
    await settle()

    const store = useQuizStore()
    expect(store.quizzes).toHaveLength(2)
    expect(store.quizzes.map((quiz) => quiz.title)).toEqual(['First Quiz', 'Second Quiz'])
    expect(feedback(wrapper)).not.toBe('')
  })

  it('names the file control', () => {
    const wrapper = mountCard()

    expect(accessibleName(fileInput(wrapper).element)).toBe('Select a JSON file')
  })

  it('imports a valid quiz array chosen from a file', async () => {
    const wrapper = mountCard()

    await selectFile(wrapper, JSON.stringify([firstQuiz, secondQuiz]))

    const store = useQuizStore()
    expect(store.quizzes.map((quiz) => quiz.title)).toEqual(['First Quiz', 'Second Quiz'])
  })

  it('leaves the catalogue untouched and reports an error for a malformed file', async () => {
    const wrapper = mountCard()

    await selectFile(wrapper, '{ "id": "broken", ')

    expect(useQuizStore().quizzes).toEqual([])
    expect(feedback(wrapper)).not.toBe('')
  })
})
