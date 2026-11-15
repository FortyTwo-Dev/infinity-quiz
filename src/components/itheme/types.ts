/**
 * Shared prop vocabulary of the widgets in this folder.
 *
 * It follows the theme package: a variant names a semantic role, never a colour
 * value, and every widget resolves it through `it-*` tokens.
 */
export type WidgetVariant =
  'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'ghost'

export type WidgetSize = 'sm' | 'md' | 'lg'
