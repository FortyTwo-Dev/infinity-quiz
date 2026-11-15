import { describe, it, expect, beforeEach } from 'vitest'
import type { DOMWrapper, VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import AppSidebar from '../../../components/layout/AppSidebar.vue'
import { setupTestPinia } from '../../stores/setup'
import { accessibleName, buttonNamed, normalize } from '../../support/accessibility'
import { mountWithRouter } from '../../support/app-shell'
import { installDialogSupport } from '../../support/dialog'
import { APP_VERSION } from '../../../constants'

installDialogSupport()

interface NavLink {
  label: string
  href: string
}

/** A destination: something the navigation sends the user to. */
const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Management', href: '/manage' },
  { label: 'Create', href: '/create' },
  { label: 'Import / Export', href: '/import-export' },
  { label: 'Statistics', href: '/statistics' },
  { label: 'Settings', href: '/settings' },
]

const GROUP_TITLES = ['Management', 'Other']
const SOURCE_URL = 'https://github.com/FortyTwo-Dev/infinity-quiz'
const CREDITS_ENTRIES = [
  'Space Grotesk',
  'SIL Open Font License 1.1',
  'OpenDyslexic',
  'Bitstream Vera license',
]

type Rendered = DOMWrapper<Element>

function brandLink(wrapper: VueWrapper) {
  return wrapper.findAll('a').find((candidate) => normalize(candidate.text()) === 'IQuiz')
}

function navLandmarks(wrapper: VueWrapper) {
  return wrapper
    .findAll('nav')
    .filter((candidate) => accessibleName(candidate.element) === 'Sections')
}

function navLinks(wrapper: VueWrapper) {
  return wrapper.get('nav').findAll('a')
}

/**
 * The destination links of the navigation.
 *
 * The settings group also carries actions (credits, source code), which share
 * the list but do not lead anywhere inside the application: the link class
 * contract keeps the destination order assertion about destinations only.
 */
function destinationLinks(wrapper: VueWrapper) {
  return navLinks(wrapper).filter((candidate) => candidate.classes().includes('app-nav-link'))
}

/** The action links of the navigation (source code today). */
function actionLinks(wrapper: VueWrapper) {
  return navLinks(wrapper).filter((candidate) => candidate.classes().includes('app-nav-action'))
}

function versionMarker(wrapper: VueWrapper) {
  const title = `Infinity Quiz v${APP_VERSION}`
  const marker = wrapper
    .findAll('[title]')
    .find((candidate) => candidate.attributes('title') === title)
  if (!marker) throw new Error(`No version marker titled "${title}"`)
  return marker
}

/** True when `earlier` precedes `later` in the document. */
function precedes(earlier: Element, later: Element) {
  return Boolean(earlier.compareDocumentPosition(later) & Node.DOCUMENT_POSITION_FOLLOWING)
}

/**
 * The accessible name, resolved inside `root`.
 *
 * The shared helper resolves `aria-labelledby` through `document.getElementById`,
 * which cannot see a mount `@vue/test-utils` keeps detached from the document.
 */
function accessibleNameWithin(root: Element) {
  const aria = normalize(root.getAttribute('aria-label'))
  if (aria) return aria

  const labelledBy = root.getAttribute('aria-labelledby')
  if (labelledBy) {
    const text = labelledBy
      .split(/\s+/)
      .map((id) => root.querySelector(`[id="${id}"]`)?.textContent ?? '')
      .join(' ')
    if (normalize(text)) return normalize(text)
  }

  return accessibleName(root)
}

function dialogNamed(wrapper: VueWrapper, name: string) {
  const dialog = wrapper
    .findAll('dialog')
    .find((candidate) => accessibleNameWithin(candidate.element) === name)
  if (!dialog) throw new Error(`No dialog named "${name}"`)
  return dialog
}

function relTokens(link: Rendered) {
  return (link.attributes('rel') ?? '').split(/\s+/).filter(Boolean)
}

function expectExternalLink(link: Rendered | undefined) {
  expect(link).toBeDefined()
  expect(link?.attributes('target')).toBe('_blank')
  expect(relTokens(link as Rendered)).toEqual(expect.arrayContaining(['noopener', 'noreferrer']))
}

function typefaceLink(dialog: Rendered, name: string) {
  return dialog.findAll('a').find((candidate) => normalize(candidate.text()).includes(name))
}

async function openCredits(wrapper: VueWrapper) {
  await buttonNamed(wrapper, 'Credits').trigger('click')
  await nextTick()
  return dialogNamed(wrapper, 'Credits')
}

describe('AppSidebar', () => {
  beforeEach(() => {
    setupTestPinia()
  })

  it('brands the navigation with a link to home', async () => {
    const { wrapper } = await mountWithRouter(AppSidebar)

    const brand = brandLink(wrapper)
    expect(brand).toBeDefined()
    expect(brand?.attributes('href')).toBe('/')
  })

  it('renders exactly one navigation landmark, labelled Sections', async () => {
    const { wrapper } = await mountWithRouter(AppSidebar)

    expect(navLandmarks(wrapper)).toHaveLength(1)
  })

  it('renders the group titles of the navigation', async () => {
    const { wrapper } = await mountWithRouter(AppSidebar)

    const nav = navLandmarks(wrapper)[0]
    expect(nav).toBeDefined()
    for (const title of GROUP_TITLES) {
      expect(nav?.text()).toContain(title)
    }
  })

  it.each(NAV_LINKS)('renders the $label link to $href', async ({ label, href }) => {
    const { wrapper } = await mountWithRouter(AppSidebar)

    const link = destinationLinks(wrapper).find(
      (candidate) => normalize(candidate.text()) === label,
    )
    expect(link).toBeDefined()
    expect(link?.attributes('href')).toBe(href)
    expect(link?.attributes('aria-label')).toBe(label)
  })

  it('orders the destinations from home through management to the other sections', async () => {
    const { wrapper } = await mountWithRouter(AppSidebar)

    expect(destinationLinks(wrapper).map((link) => link.attributes('href'))).toEqual(
      NAV_LINKS.map((link) => link.href),
    )
    expect(destinationLinks(wrapper).map((link) => normalize(link.text()))).toEqual(
      NAV_LINKS.map((link) => link.label),
    )
  })

  it('offers a Credits button in the settings group', async () => {
    const { wrapper } = await mountWithRouter(AppSidebar)

    const credits = buttonNamed(wrapper, 'Credits')
    expect(credits.element.closest('nav')).not.toBeNull()
  })

  it('links to the source repository in a new tab', async () => {
    const { wrapper } = await mountWithRouter(AppSidebar)

    const link = actionLinks(wrapper).find(
      (candidate) => candidate.attributes('href') === SOURCE_URL,
    )
    expect(link).toBeDefined()
    expect(accessibleName(link!.element)).toBe('Source code (opens in a new tab)')
    expectExternalLink(link)
  })

  it('orders the settings group as Settings, Credits, Source code', async () => {
    const { wrapper } = await mountWithRouter(AppSidebar)

    const settings = destinationLinks(wrapper).find(
      (candidate) => normalize(candidate.text()) === 'Settings',
    )
    const credits = buttonNamed(wrapper, 'Credits')
    const source = actionLinks(wrapper).find(
      (candidate) => candidate.attributes('href') === SOURCE_URL,
    )

    expect(settings).toBeDefined()
    expect(source).toBeDefined()
    expect(precedes(settings!.element, credits.element)).toBe(true)
    expect(precedes(credits.element, source!.element)).toBe(true)
  })

  it('opens a Credits dialog listing the typefaces and their licences', async () => {
    const { wrapper } = await mountWithRouter(AppSidebar)
    expect((dialogNamed(wrapper, 'Credits').element as HTMLDialogElement).open).toBe(false)

    const dialog = await openCredits(wrapper)

    expect((dialog.element as HTMLDialogElement).open).toBe(true)
    const text = normalize(dialog.text())
    for (const entry of CREDITS_ENTRIES) {
      expect(text).toContain(entry)
    }
  })

  it('opens the typeface links in the Credits dialog as external links', async () => {
    const { wrapper } = await mountWithRouter(AppSidebar)

    const dialog = await openCredits(wrapper)

    expectExternalLink(typefaceLink(dialog, 'Space Grotesk'))
    expectExternalLink(typefaceLink(dialog, 'OpenDyslexic'))
  })

  it('closes the Credits dialog from its Close button', async () => {
    const { wrapper } = await mountWithRouter(AppSidebar)

    const dialog = await openCredits(wrapper)
    const close = dialog
      .findAll('button')
      .find((candidate) => accessibleName(candidate.element) === 'Close')
    expect(close).toBeDefined()

    await close?.trigger('click')
    await nextTick()

    expect((dialog.element as HTMLDialogElement).open).toBe(false)
  })

  it('displays the application version last, after Settings and Source code', async () => {
    const { wrapper } = await mountWithRouter(AppSidebar)

    const marker = versionMarker(wrapper)
    expect(normalize(marker.text())).toBe(`v${APP_VERSION}`)
    expect(marker.attributes('title')).toBe(`Infinity Quiz v${APP_VERSION}`)

    const settings = destinationLinks(wrapper).find(
      (candidate) => normalize(candidate.text()) === 'Settings',
    )
    const source = actionLinks(wrapper).find(
      (candidate) => candidate.attributes('href') === SOURCE_URL,
    )
    expect(settings).toBeDefined()
    expect(source).toBeDefined()
    expect(precedes(settings!.element, marker.element)).toBe(true)
    expect(precedes(source!.element, marker.element)).toBe(true)

    // Nothing is rendered after it outside the closed dialog, which a user
    // never sees on the settings screen.
    const renderedAfter = Array.from(wrapper.element.querySelectorAll('*')).filter(
      (element) => !element.closest('dialog') && precedes(marker.element, element),
    )
    expect(renderedAfter.map((element) => normalize(element.textContent)).filter(Boolean)).toEqual(
      [],
    )
  })
})
