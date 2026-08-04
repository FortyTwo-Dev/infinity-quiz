import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'quiz-list',
      component: () => import('@/views/QuizListView.vue'),
    },
    {
      path: '/quiz/:quizId',
      name: 'quiz',
      component: () => import('@/views/QuizView.vue'),
      props: true,
    },
    {
      path: '/results',
      name: 'results',
      component: () => import('@/views/ResultsView.vue'),
    },
  ],
})

export default router
