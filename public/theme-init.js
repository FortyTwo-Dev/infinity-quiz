/*
 * Apply the stored theme and reading typeface before the first paint, so a
 * dark-mode reader never sees the light theme flash on load. Loaded from the
 * document head, before the stylesheet. The stores apply the same selection
 * again once Pinia rehydrates; this script only anticipates it.
 *
 * The stored payloads are untrusted, and one corrupt key must not disarm the
 * other: each is read independently, and anything unrecognised falls back to
 * the store's default, which is the light theme and the brand typeface.
 */
;(() => {
  const root = document.documentElement

  function read(key) {
    try {
      return JSON.parse(localStorage.getItem(key) || 'null')
    } catch {
      return null
    }
  }

  const theme = read('infinity-quiz-theme')
  const selection = theme && typeof theme === 'object' ? theme : {}

  // A payload written by the daisyUI build carries a theme name instead.
  const legacyName = selection.globalThemeName
  const legacyMode = typeof legacyName === 'string' && legacyName.endsWith('-dark') ? 'dark' : null
  const mode = selection.globalTheme?.mode

  root.dataset.theme = mode === 'dark' || mode === 'light' ? mode : legacyMode || 'light'

  const accessibility = read('infinity-quiz-accessibility')
  if (accessibility?.isDyslexicFontEnabled === true) {
    root.dataset.font = 'dyslexic'
  }
})()
