import { describe, it, expect, vi, afterEach } from 'vitest'
import { defineComponent, h, nextTick, type Ref } from 'vue'
import { mount } from '@vue/test-utils'
import {
  useCssVariable,
  useThemeColor,
  useThemeRadius,
  oklchWithAlpha,
} from '../../composables/useTheme'

/** Run a composable inside a mounted component, as a template would. */
function withComponent<T>(composable: () => T): { result: T; unmount: () => void } {
  let captured: T | undefined
  const Probe = defineComponent({
    setup() {
      captured = composable()
      return () => h('span')
    },
  })
  const wrapper = mount(Probe, { attachTo: document.body })
  return {
    result: captured as T,
    unmount: () => wrapper.unmount(),
  }
}

function mockThemeVars(vars: Record<string, string>) {
  return vi
    .spyOn(window, 'getComputedStyle')
    .mockReturnValue({
      getPropertyValue: (name: string) => vars[name] ?? '',
    } as CSSStyleDeclaration)
}

afterEach(() => {
  vi.restoreAllMocks()
  delete document.documentElement.dataset.theme
  delete document.documentElement.dataset.accent
})

describe('useCssVariable', () => {
  it('reads the property on mount', () => {
    mockThemeVars({ '--it-accent': 'oklch(54% 0.245 262.881)' })

    const { result, unmount } = withComponent(() => useCssVariable('--it-accent'))

    expect(result.value).toBe('oklch(54% 0.245 262.881)')
    unmount()
  })

  it('re-reads when the accent changes', async () => {
    const vars = { '--it-accent': 'oklch(54% 0.245 262.881)' }
    mockThemeVars(vars)

    const { result, unmount } = withComponent(() => useThemeColor('accent'))

    vars['--it-accent'] = 'oklch(85% 0.2 100)'
    document.documentElement.dataset.accent = 'yellow'
    await nextTick()
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(result.value).toBe('oklch(85% 0.2 100)')
    unmount()
  })

  it('re-reads when the mode changes', async () => {
    const vars = { '--it-danger': 'oklch(70% 0.191 22.216)' }
    mockThemeVars(vars)

    const { result, unmount } = withComponent(() => useThemeColor('danger'))

    vars['--it-danger'] = 'oklch(63% 0.237 25.331)'
    document.documentElement.dataset.theme = 'dark'
    await nextTick()
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(result.value).toBe('oklch(63% 0.237 25.331)')
    unmount()
  })

  it('stops observing once unmounted', async () => {
    const vars = { '--it-accent': 'first' }
    mockThemeVars(vars)

    const { result, unmount } = withComponent(() => useCssVariable('--it-accent'))
    unmount()

    vars['--it-accent'] = 'second'
    document.documentElement.dataset.accent = 'red'
    await nextTick()
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(result.value).toBe('first')
  })
})

describe('useThemeRadius', () => {
  function radiusFor(value: string): number {
    mockThemeVars({ '--it-radius': value })
    const { result, unmount } = withComponent(() => useThemeRadius())
    const radius = (result as Ref<number>).value
    unmount()
    vi.restoreAllMocks()
    return radius
  }

  it('converts a rem radius to pixels', () => {
    expect(radiusFor('0.25rem')).toBe(4)
  })

  it('reports zero for a unitless zero, the default of the package', () => {
    expect(radiusFor('0rem')).toBe(0)
    expect(radiusFor('')).toBe(0)
  })
})

describe('oklchWithAlpha', () => {
  it('appends an alpha channel to an oklch color', () => {
    expect(oklchWithAlpha('oklch(54% 0.245 262.881)', 0.1)).toBe('oklch(54% 0.245 262.881 / 0.1)')
  })

  it('replaces an existing alpha channel', () => {
    expect(oklchWithAlpha('oklch(54% 0.245 262.881 / 0.4)', 0.1)).toBe(
      'oklch(54% 0.245 262.881 / 0.1)',
    )
  })

  it('returns a value without parentheses untouched', () => {
    expect(oklchWithAlpha('rebeccapurple', 0.1)).toBe('rebeccapurple')
  })
})
