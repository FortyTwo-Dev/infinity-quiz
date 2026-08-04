import { useRouter } from 'vue-router'
import { useQuizStore, useQuizSessionStore } from '../stores'

export function useQuizList() {
  const router = useRouter()
  const quizStore = useQuizStore()
  const sessionStore = useQuizSessionStore()

  function startQuiz(quizId: string) {
    sessionStore.selectQuiz(quizId)
    router.push({ name: 'quiz', params: { quizId } })
  }

  return {
    quizzes: quizStore.quizzes,
    startQuiz,
  }
}
