# Vue.js Conventions

This file groups Vue.js-specific rules: component structure, template, props, emits, slots, lifecycle hooks, and reactivity.

---

## Component Structure

- Use `<script setup>` syntax (Composition API)
- Section order: `<script setup>`, `<template>`, `<style>`
- Group related logic with comments in script section
- Use `defineProps`, `defineEmits`, `defineExpose` for type safety
- Avoid using `this` (Composition API only)

---

## Template

### Syntax
- Use kebab-case for HTML attributes
- Use camelCase for Vue directives (`v-on:click` or `@click`)
- Use shorthand syntax for `v-on` (`@click` instead of `v-on:click`)
- Use shorthand syntax for `v-bind` (`:prop` instead of `v-bind:prop`)

### Best Practices
- Limit template logic: move complex expressions to computed properties or methods
- Use `v-for` with `:key` attribute (prefer unique IDs)
- Use `v-if` for conditional rendering, `v-show` for display toggling
- Avoid using `v-if` and `v-for` on the same element (use computed property to filter)

---

## Props

- Always define prop types with TypeScript
- Use `required: true` for mandatory props
- Provide default values for optional props
- Document props with JSDoc comments for complex components
- Use `withDefaults` for default prop values in `<script setup>`

Example:
```vue
<script setup lang="ts">
interface Props {
  questionText: string
  currentIndex: number
  isDisabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isDisabled: false
})
</script>
```

---

## Emits

- Emit events for parent-child communication
- Use descriptive event names (verbs)
- Document emitted events
- Avoid emitting too many events from a single component

Example:
```vue
<script setup lang="ts">
const emit = defineEmits<{
  (e: 'submit', answer: string): void
  (e: 'next'): void
  (e: 'prev'): void
  (e: 'complete'): void
}>()

function handleSubmit(answer: string) {
  emit('submit', answer)
}
</script>
```

---

## Slots

- Use slots for content distribution
- Name slots descriptively
- Provide fallback content when possible
- Use scoped slots for passing data to slot content

Example:
```vue
<!-- MyComponent.vue -->
<template>
  <div class="card">
    <div class="header">
      <slot name="header">Default Header</slot>
    </div>
    <div class="content">
      <slot :data="internalData"></slot>
    </div>
    <div class="footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
```

---

## Lifecycle Hooks

- Use `onMounted`, `onUpdated`, `onUnmounted` from `vue`
- Clean up resources in `onUnmounted` (timers, subscriptions, event listeners)
- Avoid side effects in `setup()`

Example:
```vue
<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

let intervalId: number

onMounted(() => {
  intervalId = window.setInterval(() => {
    // do something
  }, 1000)
})

onUnmounted(() => {
  window.clearInterval(intervalId)
})
</script>
```

---

## Reactivity

- Use `ref` for primitive values
- Use `reactive` for objects
- Use `computed` for derived state
- Use `watch` and `watchEffect` sparingly
- Prefer `computed` over `watch` when possible

Example:
```vue
<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const count = ref(0)
const double = computed(() => count.value * 2)

watch(count, (newValue) => {
  console.log(`Count changed to: ${newValue}`)
})
</script>
```
