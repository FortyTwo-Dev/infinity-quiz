# Vue Router Conventions

This file groups Vue Router-specific rules.

---

## Naming

| Type | Convention | Examples |
|------|------------|----------|
| Route names | kebab-case | `home`, `quiz-list`, `quiz-detail`, `results` |
| Route paths | kebab-case | `/`, `/quizzes`, `/quiz/:id`, `/results` |
| Dynamic segments | colon prefix | `:id`, `:quizId` |

---

## Typical Structure

```typescript
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/quizzes',
      name: 'quiz-list',
      component: () => import('@/views/QuizListView.vue'),
    },
    {
      path: '/quiz/:id',
      name: 'quiz-detail',
      component: () => import('@/views/QuizView.vue'),
      props: true,
    },
  ],
})

export default router
```

---

## Best Practices

### Lazy Loading
Use dynamic imports for lazy loading components to improve performance:
```typescript
component: () => import('@/views/QuizView.vue')
```

### Navigation Guards
Use guards for route protection (auth, data validation):
```typescript
// In router
{
  path: '/dashboard',
  name: 'dashboard',
  component: () => import('@/views/DashboardView.vue'),
  meta: { requiresAuth: true },
},

// Global guard
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next({ name: 'login' })
  } else {
    next()
  }
})
```

### Passing Parameters
Prefer passing parameters as props:
```typescript
{
  path: '/quiz/:id',
  name: 'quiz-detail',
  component: () => import('@/views/QuizView.vue'),
  props: true, // Passes { id: route.params.id } as props
},
```

### Nested Routes
Use child routes for nested layouts:
```typescript
{
  path: '/admin',
  component: () => import('@/layouts/AdminLayout.vue'),
  children: [
    {
      path: 'users',
      name: 'admin-users',
      component: () => import('@/views/admin/UsersView.vue'),
    },
  ],
},
```

### Route Metadata
Use `meta` for additional route information:
```typescript
{
  path: '/quiz/:id',
  name: 'quiz-detail',
  component: () => import('@/views/QuizView.vue'),
  meta: {
    requiresAuth: true,
    title: 'Quiz Details',
    hideNavbar: false,
  },
},
```

### Redirects
Use `redirect` for automatic redirects:
```typescript
{
  path: '/old-path',
  redirect: { name: 'new-path' },
},
// or with function
{
  path: '/old-path/:id',
  redirect: (to) => ({ name: 'new-path', params: { id: to.params.id } }),
},
```

---

## Avoid

- Route names in camelCase - use kebab-case
- Synchronous component loading - use lazy loading
- No 404 handling - always have a catch-all route
- Duplicate routes - each route must have a unique name
- Untyped parameters - always type route parameters
