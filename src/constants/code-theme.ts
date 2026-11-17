import type { ThemeRegistrationRaw } from 'shiki'

/**
 * The syntax theme follows the application palette: every colour is a CSS
 * variable resolved when the highlighted HTML is rendered, so one theme serves
 * the light and the dark mode without a second stylesheet.
 *
 * The variables are declared in `src/css/brand.css`; the theme never carries a
 * literal colour.
 */
export const CODE_THEME_NAME = 'infinity-quiz'

export const CODE_THEME: ThemeRegistrationRaw = {
  name: CODE_THEME_NAME,
  type: 'dark',
  settings: [
    { settings: { foreground: 'var(--it-fg)' } },
    {
      scope: ['comment', 'punctuation.definition.comment'],
      settings: { foreground: 'var(--iq-code-comment)', fontStyle: 'italic' },
    },
    {
      scope: [
        'keyword',
        'keyword.control',
        'storage',
        'storage.type',
        'storage.modifier',
        'keyword.operator.new',
      ],
      settings: { foreground: 'var(--iq-code-keyword)' },
    },
    {
      scope: ['string', 'string.quoted', 'string.template', 'string.regexp'],
      settings: { foreground: 'var(--iq-code-string)' },
    },
    {
      scope: ['constant.numeric', 'constant.language', 'constant.character'],
      settings: { foreground: 'var(--iq-code-number)' },
    },
    {
      scope: ['entity.name.function', 'support.function', 'meta.function-call'],
      settings: { foreground: 'var(--iq-code-function)' },
    },
    {
      scope: [
        'entity.name.type',
        'entity.name.class',
        'support.type',
        'support.class',
        'variable.language',
      ],
      settings: { foreground: 'var(--iq-code-type)' },
    },
    {
      scope: ['entity.name.tag'],
      settings: { foreground: 'var(--iq-code-tag)' },
    },
    {
      scope: ['entity.other.attribute-name'],
      settings: { foreground: 'var(--iq-code-attribute)' },
    },
    {
      scope: ['keyword.operator', 'punctuation.accessor'],
      settings: { foreground: 'var(--iq-code-operator)' },
    },
    {
      scope: ['punctuation', 'meta.brace'],
      settings: { foreground: 'var(--iq-code-punctuation)' },
    },
    {
      scope: ['invalid', 'invalid.illegal'],
      settings: { foreground: 'var(--it-danger)', fontStyle: 'underline' },
    },
  ],
}
