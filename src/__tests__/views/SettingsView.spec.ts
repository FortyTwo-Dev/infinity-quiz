import { describe, it, expect, beforeEach } from 'vitest'
import SettingsView from '../../views/SettingsView.vue'
import { setupTestPinia } from '../stores/setup'
import { accessibleName, normalize } from '../support/accessibility'
import { mountWithRouter } from '../support/app-shell'

const SECTION_HEADINGS = ['Accessibility', 'Account', 'Sync', 'Export data']
const COMING_SOON = 'Coming soon'

function headings(wrapper: Awaited<ReturnType<typeof mountWithRouter>>['wrapper']) {
  return wrapper.findAll('h1, h2, h3, h4, h5, h6').map((heading) => normalize(heading.text()))
}

describe('SettingsView', () => {
  beforeEach(() => {
    setupTestPinia()
    delete document.documentElement.dataset.font
  })

  it.each(SECTION_HEADINGS)('renders the %s section heading', async (title) => {
    const { wrapper } = await mountWithRouter(SettingsView)

    expect(headings(wrapper)).toContain(title)
  })

  it('announces the three planned sections as coming soon', async () => {
    const { wrapper } = await mountWithRouter(SettingsView)

    const text = normalize(wrapper.text())
    expect(text.match(new RegExp(COMING_SOON, 'g')) ?? []).toHaveLength(3)
  })

  it('exposes the OpenDyslexic checkbox as the only form control, with no buttons', async () => {
    const { wrapper } = await mountWithRouter(SettingsView)

    expect(wrapper.findAll('input')).toHaveLength(1)
    const checkbox = wrapper.get('input')
    expect(checkbox.attributes('type')).toBe('checkbox')
    expect(accessibleName(checkbox.element)).toBe('Use OpenDyslexic font')

    expect(wrapper.findAll('select')).toHaveLength(0)
    expect(wrapper.findAll('textarea')).toHaveLength(0)
    expect(wrapper.findAll('button')).toHaveLength(0)
  })

  it('links to the import / export route', async () => {
    const { wrapper } = await mountWithRouter(SettingsView)

    const link = wrapper
      .findAll('a')
      .find((candidate) => candidate.attributes('href') === '/import-export')
    expect(link).toBeDefined()
  })
})
