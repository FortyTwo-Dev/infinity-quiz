import { useRouter } from 'vue-router'
import { useQuizSessionStore } from '../stores'
import { useScore } from './useScore'
import { useFeedback } from './useFeedback'

export function useResults() {
  const router = useRouter()
  const sessionStore = useQuizSessionStore()

  const { percentage, formattedScore } = useScore(sessionStore.totalQuestions, sessionStore.score)
  const { feedback } = useFeedback(percentage)

  function restartQuiz() {
    sessionStore.restartQuiz()
    if (sessionStore.currentQuizId) {
      router.push({ name: 'quiz', params: { quizId: sessionStore.currentQuizId } })
    }
  }

  function backToQuizList() {
    sessionStore.backToQuizList()
    router.push({ name: 'quiz-list' })
  }

  return {
    currentQuiz: sessionStore.currentQuiz,
    score: sessionStore.score,
    totalQuestions: sessionStore.totalQuestions,
    percentage,
    formattedScore,
    feedback,
    restartQuiz,
    backToQuizList,
  }
}
