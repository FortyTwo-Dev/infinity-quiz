import type { VueWrapper } from '@vue/test-utils'

/**
 * The class vocabulary of the theme widgets (`it-*`) and of the layout
 * primitives (`l-*`) is their observable contract: these components exist to
 * map props onto those names. Everything else about the root element is
 * ignored, so a spec asserts on this list and on nothing else.
 *
 * Sorted, so the expectation reads as a set rather than as source order.
 */
export function themeClasses(wrapper: VueWrapper): string[] {
  return wrapper
    .classes()
    .filter((name) => name.startsWith('it-') || name.startsWith('l-'))
    .sort()
}
