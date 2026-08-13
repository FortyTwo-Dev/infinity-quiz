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
    // Phase 3 - Quiz Management Routes
    {
      path: '/manage',
      name: 'quiz-management',
      component: () => import('@/views/QuizManagementView.vue'),
    },
    {
      path: '/create',
      name: 'quiz-create',
      component: () => import('@/views/QuizFormView.vue'),
    },
    {
      path: '/edit/:quizId',
      name: 'quiz-edit',
      component: () => import('@/views/QuizFormView.vue'),
      props: true,
    },
    {
      path: '/import-export',
      name: 'quiz-import-export',
      component: () => import('@/views/QuizImportExportView.vue'),
    },
  ],
})

export default router
