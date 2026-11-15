import { useRouter } from 'vue-router'
import { useQuizStore } from '../stores'

export function useQuizList() {
  const router = useRouter()
  const quizStore = useQuizStore()

  function startQuiz(quizId: string) {
    // The session is initialized by useQuiz on the quiz route, so the URL
    // seed can be resolved before the first shuffle.
    router.push({ name: 'quiz', params: { quizId } })
  }

  return {
    quizzes: quizStore.quizzes,
    getQuizById: quizStore.getQuizById,
    startQuiz,
  }
}
