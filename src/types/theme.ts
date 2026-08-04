export interface ThemeColors {
  primary: string
  primaryHover: string
  primaryLight: string
  secondary: string
  success: string
  warning: string
  danger: string
  info: string
  background: string
  backgroundCard: string
  text: string
  textSecondary: string
  textInverse: string
  border: string
  borderLight: string
}

export interface ThemeRadius {
  sm: string
  md: string
  lg: string
  xl: string
  full: string
}

export interface ThemeShadows {
  sm: string
  md: string
  lg: string
}

export interface ThemeSpacing {
  xs: string
  sm: string
  md: string
  lg: string
  xl: string
}

export interface ThemeTransitions {
  fast: string
  normal: string
  slow: string
}

export interface ThemeTypography {
  fontFamily: string
  fontFamilyFallback: string
}

export interface ThemeTokens {
  name: string
  colors: ThemeColors
  radius: ThemeRadius
  shadows: ThemeShadows
  spacing: ThemeSpacing
  transitions: ThemeTransitions
  typography: ThemeTypography
}

export type BuiltInThemeName = 'light' | 'dark'
export type ThemeName = BuiltInThemeName | string
