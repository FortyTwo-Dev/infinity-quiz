import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { nextTick } from 'vue'
import type { VueWrapper } from '@vue/test-utils'
import AppLayout from '../../../components/layout/AppLayout.vue'
import { setupTestPinia } from '../../stores/setup'
import { accessibleName } from '../../support/accessibility'
import { installMatchMedia, mountWithRouter, type MatchMediaHandle } from '../../support/app-shell'

const DESKTOP = true
const MOBILE = false

const ROUTE_TITLES = [
  { path: '/', title: 'Home' },
  { path: '/statistics', title: 'Statistics' },
  { path: '/manage', title: 'Management' },
  { path: '/create', title: 'Create' },
  { path: '/import-export', title: 'Import / Export' },
  { path: '/settings', title: 'Settings' },
  { path: '/results', title: 'Results' },
  { path: '/edit/abc', title: 'Edit' },
  { path: '/unknown', title: 'IQuiz' },
] as const

let media: MatchMediaHandle | undefined
let wrapper: VueWrapper | undefined

async function mountLayout(matches: boolean, route = '/') {
  media = installMatchMedia(matches)
  const mounted = await mountWithRouter(AppLayout, {
    route,
    stubs: { teleport: true },
  })
  wrapper = mounted.wrapper
  return mounted
}

function sidebarAside(wrapper: VueWrapper) {
  const aside = wrapper
    .findAll('aside')
    .find((candidate) => accessibleName(candidate.element) === 'Main navigation')
  if (!aside) throw new Error('No aside labelled "Main navigation"')
  return aside
}

function sidebar(wrapper: VueWrapper) {
  return wrapper.get('[data-collapsed]')
}

function toggle(wrapper: VueWrapper) {
  return wrapper.get('[aria-controls="app-sidebar"]')
}

function backdrop(wrapper: VueWrapper) {
  return wrapper.findAll('[aria-label="Close navigation"], [title="Close navigation"]')[0]
}

function pressEscape() {
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
}

function flipBreakpoint(matches: boolean) {
  if (!media) throw new Error('No matchMedia stub installed')
  media.setMatches(matches)
}

describe('AppLayout', () => {
  beforeEach(() => {
    setupTestPinia()
  })

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
    media?.restore()
    media = undefined
  })

  it('skips to a main landmark that exists', async () => {
    const { wrapper: layout } = await mountLayout(DESKTOP)

    const skipLink = layout.get('a[href="#main-content"]')
    expect(skipLink.text()).not.toBe('')
    expect(layout.get('main#main-content').element.tagName).toBe('MAIN')
  })

  it('renders the open sidebar inside the navigation landmark on desktop', async () => {
    const { wrapper: layout } = await mountLayout(DESKTOP)

    expect(layout.attributes('data-sidebar')).toBe('open')
    expect(sidebarAside(layout).exists()).toBe(true)
    expect(sidebar(layout).attributes('data-collapsed')).toBe('false')
  })

  it('offers a collapse control on desktop, with no backdrop', async () => {
    const { wrapper: layout } = await mountLayout(DESKTOP)

    const control = toggle(layout)
    expect(accessibleName(control.element)).toBe('Collapse navigation')
    expect(control.attributes('aria-expanded')).toBe('true')
    expect(backdrop(layout)).toBeUndefined()
  })

  it('collapses the sidebar when the control is clicked on desktop', async () => {
    const { wrapper: layout } = await mountLayout(DESKTOP)

    await toggle(layout).trigger('click')

    expect(layout.attributes('data-sidebar')).toBe('closed')
    expect(sidebar(layout).attributes('data-collapsed')).toBe('true')
    expect(accessibleName(toggle(layout).element)).toBe('Expand navigation')
    expect(toggle(layout).attributes('aria-expanded')).toBe('false')
  })

  it('reopens the sidebar when the control is clicked again on desktop', async () => {
    const { wrapper: layout } = await mountLayout(DESKTOP)

    await toggle(layout).trigger('click')
    await toggle(layout).trigger('click')

    expect(layout.attributes('data-sidebar')).toBe('open')
    expect(sidebar(layout).attributes('data-collapsed')).toBe('false')
    expect(accessibleName(toggle(layout).element)).toBe('Collapse navigation')
    expect(toggle(layout).attributes('aria-expanded')).toBe('true')
  })

  it('starts the drawer closed, with no backdrop, on mobile', async () => {
    const { wrapper: layout } = await mountLayout(MOBILE)

    expect(layout.attributes('data-sidebar')).toBe('closed')
    expect(backdrop(layout)).toBeUndefined()
  })

  it('opens the drawer and its backdrop when the control is clicked on mobile', async () => {
    const { wrapper: layout } = await mountLayout(MOBILE)

    await toggle(layout).trigger('click')

    expect(layout.attributes('data-sidebar')).toBe('open')
    const scrim = backdrop(layout)
    expect(scrim).toBeDefined()
    expect(accessibleName(scrim?.element as Element)).toBe('Close navigation')
  })

  it('closes the drawer when the backdrop is clicked on mobile', async () => {
    const { wrapper: layout } = await mountLayout(MOBILE)
    await toggle(layout).trigger('click')
    expect(layout.attributes('data-sidebar')).toBe('open')

    await backdrop(layout)?.trigger('click')

    expect(layout.attributes('data-sidebar')).toBe('closed')
    expect(backdrop(layout)).toBeUndefined()
  })

  it('closes the open drawer on Escape on mobile', async () => {
    const { wrapper: layout } = await mountLayout(MOBILE)
    await toggle(layout).trigger('click')
    expect(layout.attributes('data-sidebar')).toBe('open')

    pressEscape()
    await nextTick()

    expect(layout.attributes('data-sidebar')).toBe('closed')
  })

  it('closes the sidebar when the viewport leaves desktop', async () => {
    const { wrapper: layout } = await mountLayout(DESKTOP)
    expect(layout.attributes('data-sidebar')).toBe('open')

    flipBreakpoint(MOBILE)
    await nextTick()

    expect(layout.attributes('data-sidebar')).toBe('closed')
    expect(sidebar(layout).attributes('data-collapsed')).toBe('true')
  })

  it('reopens the sidebar when the viewport returns to desktop', async () => {
    const { wrapper: layout } = await mountLayout(DESKTOP)

    flipBreakpoint(MOBILE)
    await nextTick()
    expect(layout.attributes('data-sidebar')).toBe('closed')

    flipBreakpoint(DESKTOP)
    await nextTick()

    expect(layout.attributes('data-sidebar')).toBe('open')
    expect(sidebar(layout).attributes('data-collapsed')).toBe('false')
  })

  it.each(ROUTE_TITLES)('titles the top bar "$title" on $path', async ({ path, title }) => {
    const { wrapper: layout } = await mountLayout(DESKTOP, path)

    expect(layout.get('h1').text()).toBe(title)
  })

  it('drops the shell chrome and goes full screen on the quiz route', async () => {
    const { wrapper: layout } = await mountLayout(DESKTOP, '/quiz/abc')

    expect(layout.attributes('data-sidebar')).toBeDefined()
    expect(layout.findAll('aside')).toHaveLength(0)
    expect(layout.findAll('h1')).toHaveLength(0)
    expect(backdrop(layout)).toBeUndefined()
    expect(layout.find('a[href="#main-content"]').exists()).toBe(true)
    expect(layout.find('main#main-content').exists()).toBe(true)
    expect(layout.classes()).toContain('app-shell-fullscreen')
  })
})
