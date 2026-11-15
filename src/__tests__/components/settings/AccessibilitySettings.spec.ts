import { describe, it, expect, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import AccessibilitySettings from '../../../components/settings/AccessibilitySettings.vue'
import { useAccessibilityStore } from '../../../stores/accessibility-store'
import { setupTestPinia } from '../../stores/setup'
import { accessibleName } from '../../support/accessibility'
import { mountWithRouter } from '../../support/app-shell'

const LABEL = 'Use OpenDyslexic font'

function dyslexicCheckbox(wrapper: Awaited<ReturnType<typeof mountWithRouter>>['wrapper']) {
  return wrapper.get(`input[type="checkbox"]`)
}

describe('AccessibilitySettings', () => {
  beforeEach(() => {
    setupTestPinia()
    delete document.documentElement.dataset.font
  })

  it('renders the OpenDyslexic checkbox unchecked by default', async () => {
    const { wrapper } = await mountWithRouter(AccessibilitySettings)

    expect(wrapper.findAll('input[type="checkbox"]')).toHaveLength(1)
    const checkbox = dyslexicCheckbox(wrapper)
    expect(accessibleName(checkbox.element)).toBe(LABEL)
    expect((checkbox.element as HTMLInputElement).checked).toBe(false)
  })

  it('enables then disables the reading font from the checkbox', async () => {
    const { wrapper } = await mountWithRouter(AccessibilitySettings)
    const store = useAccessibilityStore()
    const checkbox = dyslexicCheckbox(wrapper)

    await checkbox.setValue(true)
    await nextTick()

    expect(store.isDyslexicFontEnabled).toBe(true)
    expect(document.documentElement.dataset.font).toBe('dyslexic')

    await checkbox.setValue(false)
    await nextTick()

    expect(store.isDyslexicFontEnabled).toBe(false)
    expect(document.documentElement.getAttribute('data-font')).toBeNull()
  })
})
