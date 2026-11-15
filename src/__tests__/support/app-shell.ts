import { mount, type VueWrapper } from '@vue/test-utils'
import { getActivePinia } from 'pinia'
import { defineComponent, h, type Component, type Plugin } from 'vue'
import { createMemoryHistory, createRouter, type RouteRecordRaw, type Router } from 'vue-router'

/**
 * Harness shared by the app shell specs: a memory router carrying the real
 * route names, and a `matchMedia` stub.
 *
 * Both a route component and `matchMedia` are things the platform provides and
 * jsdom does not: nothing compiles a `template` string inside a `.ts` file, and
 * jsdom ships no `window.matchMedia`.
 */

const RouteStub = defineComponent({
  name: 'RouteStub',
  render: () => h('div'),
})

/**
 * The nine routes of the application, plus `unknown`: a route the shell does
 * not know, which is how the top bar falls back to the brand name.
 */
const routes: RouteRecordRaw[] = [
  { path: '/', name: 'quiz-list', component: RouteStub },
  { path: '/quiz/:quizId', name: 'quiz', component: RouteStub },
  { path: '/results', name: 'results', component: RouteStub },
  { path: '/statistics', name: 'statistics', component: RouteStub },
  { path: '/manage', name: 'quiz-management', component: RouteStub },
  { path: '/create', name: 'quiz-create', component: RouteStub },
  { path: '/edit/:quizId', name: 'quiz-edit', component: RouteStub },
  { path: '/import-export', name: 'quiz-import-export', component: RouteStub },
  { path: '/settings', name: 'settings', component: RouteStub },
  { path: '/unknown', name: 'unknown', component: RouteStub },
]

export function createAppShellRouter(): Router {
  return createRouter({ history: createMemoryHistory(), routes })
}

export interface MountWithRouterResult {
  wrapper: VueWrapper
  router: Router
}

interface MountWithRouterOptions {
  /** Path the router is already on when the component mounts. Defaults to `/`. */
  route?: string
  stubs?: Record<string, boolean>
}

/**
 * Mount a component whose setup uses `vue-router` (and possibly a store),
 * with the router already resolved on `options.route`.
 */
export async function mountWithRouter(
  component: Component,
  options: MountWithRouterOptions = {},
): Promise<MountWithRouterResult> {
  const router = createAppShellRouter()
  await router.push(options.route ?? '/')

  const plugins: Plugin[] = [router]
  const pinia = getActivePinia()
  if (pinia) plugins.push(pinia)

  const wrapper = mount(component, {
    global: { plugins, stubs: options.stubs },
  })
  await router.isReady()

  return { wrapper, router }
}

export interface MatchMediaHandle {
  /** Flip the media query value every stub answers, and notify its listeners. */
  setMatches(matches: boolean): void
  /** Put the original `window.matchMedia` back. */
  restore(): void
}

type MediaListener = (event: MediaQueryListEvent) => void

interface StubbedQueryList {
  media: string
  matches: boolean
  listeners: Set<MediaListener>
}

/**
 * Replace `window.matchMedia` with a stub driven by `setMatches`.
 *
 * Call it from `afterEach` through the returned handle: the stub is installed
 * globally, so it would otherwise leak into the next spec file.
 */
export function installMatchMedia(initialMatches: boolean): MatchMediaHandle {
  const original = window.matchMedia
  const lists: StubbedQueryList[] = []

  function createQueryList(query: string): MediaQueryList {
    const list: StubbedQueryList = {
      media: query,
      matches: initialMatches,
      listeners: new Set<MediaListener>(),
    }
    lists.push(list)

    return {
      get matches() {
        return list.matches
      },
      media: query,
      onchange: null,
      addEventListener: (type: string, listener: MediaListener) => {
        if (type === 'change') list.listeners.add(listener)
      },
      removeEventListener: (type: string, listener: MediaListener) => {
        if (type === 'change') list.listeners.delete(listener)
      },
      addListener: (listener: MediaListener) => {
        list.listeners.add(listener)
      },
      removeListener: (listener: MediaListener) => {
        list.listeners.delete(listener)
      },
      dispatchEvent: () => true,
    } as MediaQueryList
  }

  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: createQueryList,
  })

  return {
    setMatches(matches: boolean) {
      for (const list of lists) {
        list.matches = matches
        const event = { matches, media: list.media } as MediaQueryListEvent
        for (const listener of list.listeners) listener(event)
      }
    },
    restore() {
      Object.defineProperty(window, 'matchMedia', {
        configurable: true,
        writable: true,
        value: original,
      })
    },
  }
}
