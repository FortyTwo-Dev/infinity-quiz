// Daisy UI - Global Types

// Sizes - Shared across components
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

// Padding sizes
export type PaddingSize = 'none' | 'sm' | 'md' | 'lg'

// Justify alignment
export type Justify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'

// HTML heading tags
export type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

// Position types - Shared across components
export type Position = 'top' | 'middle' | 'bottom'

// Indicator specific types
export type IndicatorAlign = 'start' | 'center' | 'end'

// Color variants - Shared across components
export type ColorVariant =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'ghost'

// Button specific types
export type ButtonVariant = ColorVariant | 'link' | 'outline'
export type ButtonType = 'button' | 'submit' | 'reset'

// Input specific types
export type InputColor = ColorVariant
export type InputSize = Size

// Progress specific types - uses subset of ColorVariant (no ghost)
export type ProgressColor =
  'neutral' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error'

// Checkbox specific types - uses subset of ColorVariant (no ghost)
export type CheckboxVariant =
  'primary' | 'secondary' | 'accent' | 'neutral' | 'success' | 'warning' | 'info' | 'error'

// Label specific types
export type LabelVariant = 'input' | 'select' | 'floating-label'

// Card specific types
export type CardSize = 'sm' | 'md' | 'lg' | 'xl'
export type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'

// Steps specific types
export type Direction = 'horizontal' | 'vertical'
