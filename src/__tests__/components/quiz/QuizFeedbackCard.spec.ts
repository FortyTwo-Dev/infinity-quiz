import { describe, it, expect, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import QuizFeedbackCard from '../../../components/quiz/card/QuizFeedbackCard.vue'
import { ItAlert } from '@/components/itheme'
import { useQuizStore, useQuizSessionStore, useQuizVerificationStore } from '@/stores'
import type { Quiz } from '@/types'
import { setupTestPinia } from '../../stores/setup'

function buildQuiz(overrides: Partial<Quiz> = {}): Quiz {
  return {
    id: 'feedback-quiz',
    title: 'Feedback',
    description: 'One question with an explanation, one without',
    feedbackEnabled: true,
    questions: [
      { id: 'q1', text: 'Capital of France?', options: ['Paris', 'Lyon'], correctAnswerIndex: 0 },
      {
        id: 'q2',
        text: 'Capital of Italy?',
        options: ['Rome', 'Milan'],
        correctAnswerIndex: 0,
        explanation: 'Rome has been the capital since 1871.',
      },
    ],
    ...overrides,
  }
}

function mountCard() {
  return mount(QuizFeedbackCard)
}

function startQuiz(definition: Quiz = buildQuiz()) {
  useQuizStore().addQuiz(definition)
  const session = useQuizSessionStore()
  session.selectQuiz(definition.id)
  return session
}

/** Select an option, then verify it; the card reacts to the verification store. */
async function answerAndVerify(answerIndex: number) {
  const session = useQuizSessionStore()
  session.selectAnswer(answerIndex)
  await useQuizVerificationStore().verifyAnswer()
  await nextTick()
}

/**
 * The smallest element holding every given text: `findAll` walks the tree in
 * document order, so the last match is the tightest common container.
 */
function tightest(wrapper: ReturnType<typeof mountCard>, ...needles: string[]) {
  const matches = wrapper
    .findAll('*')
    .filter((node) => needles.every((needle) => node.text().includes(needle)))
  expect(matches.length).toBeGreaterThan(0)
  return matches[matches.length - 1]!
}

describe('QuizFeedbackCard', () => {
  beforeEach(() => {
    setupTestPinia()
  })

  it('renders nothing when no quiz is in progress', () => {
    const wrapper = mountCard()

    expect(wrapper.text().trim()).toBe('')
    expect(wrapper.findComponent(ItAlert).exists()).toBe(false)
  })

  it('renders nothing for a selected quiz whose answer is not verified yet', () => {
    const session = startQuiz()
    session.selectAnswer(0)

    const wrapper = mountCard()

    expect(wrapper.text().trim()).toBe('')
    expect(wrapper.text()).not.toContain('Correct!')
    expect(wrapper.text()).not.toContain('Almost')
  })

  it('confirms a correct answer with the correct option and no chosen-answer line', async () => {
    startQuiz()
    await answerAndVerify(0)

    const wrapper = mountCard()

    expect(wrapper.text()).toContain('Correct!')
    expect(tightest(wrapper, 'Correct answer:', 'Paris').text()).toMatch(/Correct answer:\s*Paris/)
    expect(wrapper.text()).not.toContain('You chose')
  })

  it('names the correct answer and the chosen answer after a wrong answer', async () => {
    startQuiz()
    await answerAndVerify(1)

    const wrapper = mountCard()

    expect(wrapper.text()).toContain('Almost…')
    expect(tightest(wrapper, 'Correct answer:', 'Paris').text()).toMatch(/Correct answer:\s*Paris/)
    expect(tightest(wrapper, 'You chose:', 'Lyon').text()).toMatch(/You chose:\s*Lyon/)
  })

  it('takes the correct answer from the question correctAnswerIndex', async () => {
    startQuiz(
      buildQuiz({
        questions: [
          {
            id: 'q1',
            text: 'Capital of France?',
            options: ['Paris', 'Lyon'],
            correctAnswerIndex: 1,
          },
        ],
      }),
    )
    await answerAndVerify(0)

    const wrapper = mountCard()

    expect(wrapper.text()).toContain('Almost…')
    expect(tightest(wrapper, 'Correct answer:', 'Lyon').text()).toMatch(/Correct answer:\s*Lyon/)
    expect(tightest(wrapper, 'You chose:', 'Paris').text()).toMatch(/You chose:\s*Paris/)
  })

  it('renders the explanation in an alert when the question has one', async () => {
    const session = startQuiz()
    await answerAndVerify(0)
    await session.nextQuestion()
    expect(session.currentQuestion?.id).toBe('q2')
    await answerAndVerify(0)

    const wrapper = mountCard()
    const alert = wrapper.findComponent(ItAlert)

    expect(alert.exists()).toBe(true)
    expect(alert.text()).toContain('Rome has been the capital since 1871.')
  })

  it('renders no alert when the question has no explanation', async () => {
    startQuiz()
    await answerAndVerify(0)

    const wrapper = mountCard()

    expect(wrapper.text()).toContain('Correct!')
    expect(wrapper.findComponent(ItAlert).exists()).toBe(false)
  })

  it('renders nothing when the quiz disables feedback', async () => {
    startQuiz(buildQuiz({ id: 'no-feedback-quiz', feedbackEnabled: false }))
    await answerAndVerify(0)

    const wrapper = mountCard()

    expect(wrapper.text().trim()).toBe('')
    expect(wrapper.text()).not.toContain('Correct!')
  })

  it('disappears once the attempt is reset', async () => {
    const session = startQuiz()
    await answerAndVerify(0)

    const wrapper = mountCard()
    expect(wrapper.text()).toContain('Correct!')

    session.backToQuizList()
    await nextTick()

    expect(wrapper.text().trim()).toBe('')
    expect(wrapper.findComponent(ItAlert).exists()).toBe(false)
  })
})
