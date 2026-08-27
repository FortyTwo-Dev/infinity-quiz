# Composables Conventions

This file groups Vue composable-specific rules: when to use, naming, and best practices.

---

## When to Use a Composable

Use a composable for:
- Reusable stateful logic (e.g., timer, drag-and-drop, UI interactions)
- Logic that depends on lifecycle (e.g., event listeners, subscriptions)
- Logic that needs to be shared between multiple components
- Encapsulating API calls with state management

Do NOT use a composable for:
- Pure logic without state - use a utility function in `utils/`
- Logic specific to only one component - keep it in the component
- Global state management - use a Pinia store

---

## Naming

- Always prefix with `use`: `useTimer()`, `useQuiz()`, `useLocalStorage()`
- Use camelCase: `useTimer`, not `UseTimer` or `use-timer`
- Be descriptive: `useQuizTimer` rather than `useTimer` if quiz-specific

Examples:
| Good | Bad |
|------|-----|
| `useTimer.ts` | `timer.ts` |
| `useLocalStorage.ts` | `localStorage.ts` |
| `useQuizNavigation.ts` | `quizNavigation.ts` |

---

## Structure

```typescript
// src/composables/useTimer.ts
import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Composable to manage a timer with pause/resume
 */
export function useTimer(initialSeconds: number) {
  const secondsLeft = ref<number>(initialSeconds)
  const isRunning = ref<boolean>(false)
  let intervalId: number | null = null

  function start() {
    if (isRunning.value) return
    
    isRunning.value = true
    intervalId = window.setInterval(() => {
      secondsLeft.value--
      if (secondsLeft.value <= 0) {
        stop()
      }
    }, 1000)
  }

  function stop() {
    if (intervalId) {
      window.clearInterval(intervalId)
      intervalId = null
    }
    isRunning.value = false
  }

  function reset(newSeconds?: number) {
    stop()
    secondsLeft.value = newSeconds ?? initialSeconds
  }

  onUnmounted(() => {
    stop()
  })

  return {
    secondsLeft,
    isRunning,
    start,
    stop,
    reset,
  }
}
```

---

## Best Practices

### Lifecycle Management
- Always clean up side effects in `onUnmounted`
- Avoid memory leaks (timers, subscriptions, event listeners)

### Reactivity
- Use `ref` or `reactive` for shared state
- Expose only what is necessary (don't return internal state)
- Document reactive values returned

### Parameters
- Type all parameters with TypeScript
- Validate parameters if needed
- Provide default values for optional parameters

### Composition
- Compose multiple composables to create complex functionality
- Avoid circular dependencies between composables

### Documentation
- Always add JSDoc comment explaining the composable purpose
- Document parameters, returns, and usage examples

---

## Avoid

- Global state in composables - use Pinia for global state
- Uncleaned side effects - always clean up in `onUnmounted`
- Overly generic composables - prefer focused composables
- Order-dependent composables - composables should be independent
- Exposing internal state - return only public interface
