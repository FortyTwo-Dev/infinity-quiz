import { accessibleName } from '../../support/accessibility'
import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ThemeToggle from '../../../components/common/theme/ThemeToggle.vue'
import { useThemeStore } from '@/stores'
import { setupTestPinia } from '../../stores/setup'

const OTHER_MODE = {
  light: 'dark',
  dark: 'light',
} as const

function mountToggle() {
  return mount(ThemeToggle)
}

function toggleButton(wrapper: ReturnType<typeof mountToggle>) {
  return wrapper
    .findAll('button')
    .find((candidate) => /^Switch to (light|dark) mode$/.test(accessibleName(candidate.element)))
}

describe('ThemeToggle', () => {
  beforeEach(() => {
    setupTestPinia()
  })

  it('names the control after the mode a click switches to', () => {
    const store = useThemeStore()
    const startMode = store.globalTheme.mode
    const wrapper = mountToggle()

    expect(accessibleName(toggleButton(wrapper)?.element as Element)).toBe(
      `Switch to ${OTHER_MODE[startMode]} mode`,
    )
  })

  it('flips the mode and keeps the accent when clicked', async () => {
    const store = useThemeStore()
    const startTheme = { ...store.globalTheme }
    const wrapper = mountToggle()

    await toggleButton(wrapper)?.trigger('click')

    expect(store.globalTheme.mode).toBe(OTHER_MODE[startTheme.mode])
    expect(store.globalTheme.accent).toBe(startTheme.accent)
  })

  it('returns to the starting mode after two clicks', async () => {
    const store = useThemeStore()
    const startTheme = { ...store.globalTheme }
    const wrapper = mountToggle()

    await toggleButton(wrapper)?.trigger('click')
    expect(store.globalTheme.mode).toBe(OTHER_MODE[startTheme.mode])

    await toggleButton(wrapper)?.trigger('click')

    expect(store.globalTheme.mode).toBe(startTheme.mode)
    expect(store.globalTheme.accent).toBe(startTheme.accent)
  })

  it('renames the control once the mode changed', async () => {
    const store = useThemeStore()
    const startMode = store.globalTheme.mode
    const wrapper = mountToggle()

    await toggleButton(wrapper)?.trigger('click')

    expect(accessibleName(toggleButton(wrapper)?.element as Element)).toBe(
      `Switch to ${startMode} mode`,
    )
  })
})
