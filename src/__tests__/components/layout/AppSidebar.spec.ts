import { describe, it, expect, beforeEach } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import AppSidebar from '../../../components/layout/AppSidebar.vue'
import { setupTestPinia } from '../../stores/setup'
import { accessibleName, normalize } from '../../support/accessibility'
import { mountWithRouter } from '../../support/app-shell'

interface NavLink {
  label: string
  href: string
}

const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Management', href: '/manage' },
  { label: 'Create', href: '/create' },
  { label: 'Import / Export', href: '/import-export' },
  { label: 'Statistics', href: '/statistics' },
]

const GROUP_TITLES = ['Management', 'Other']

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

    const link = navLinks(wrapper).find((candidate) => normalize(candidate.text()) === label)
    expect(link).toBeDefined()
    expect(link?.attributes('href')).toBe(href)
    expect(link?.attributes('aria-label')).toBe(label)
  })

  it('orders the links from home through management to the other sections', async () => {
    const { wrapper } = await mountWithRouter(AppSidebar)

    expect(navLinks(wrapper).map((link) => link.attributes('href'))).toEqual(
      NAV_LINKS.map((link) => link.href),
    )
    expect(navLinks(wrapper).map((link) => normalize(link.text()))).toEqual(
      NAV_LINKS.map((link) => link.label),
    )
  })
})
