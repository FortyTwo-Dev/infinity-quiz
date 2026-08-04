import { useQuizSessionStore } from '../stores'
import { useScore } from './useScore'
import { useFeedback } from './useFeedback'

export function useResults() {
  const sessionStore = useQuizSessionStore()

  const { percentage, formattedScore } = useScore(sessionStore.totalQuestions, sessionStore.score)
  const { feedback } = useFeedback(percentage)

  function restartQuiz() {
    sessionStore.restartQuiz()
  }

  function backToQuizList() {
    sessionStore.backToQuizList()
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
