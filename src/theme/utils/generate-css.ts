import type { ThemeTokens } from '@/types/theme'

export const generateThemeCSS = (theme: ThemeTokens): string => {
  const { colors, radius, shadows, spacing, transitions, typography } = theme

  return `:root[data-theme="${theme.name}"] {
  /* Colors */
  --color-primary: ${colors.primary};
  --color-primary-hover: ${colors.primaryHover};
  --color-primary-light: ${colors.primaryLight};
  --color-secondary: ${colors.secondary};
  --color-success: ${colors.success};
  --color-warning: ${colors.warning};
  --color-danger: ${colors.danger};
  --color-info: ${colors.info};
  --color-bg: ${colors.background};
  --color-bg-card: ${colors.backgroundCard};
  --color-text: ${colors.text};
  --color-text-secondary: ${colors.textSecondary};
  --color-text-inverse: ${colors.textInverse};
  --color-border: ${colors.border};
  --color-border-light: ${colors.borderLight};

  /* Border Radius */
  --radius-sm: ${radius.sm};
  --radius-md: ${radius.md};
  --radius-lg: ${radius.lg};
  --radius-xl: ${radius.xl};
  --radius-full: ${radius.full};

  /* Shadows */
  --shadow-sm: ${shadows.sm};
  --shadow-md: ${shadows.md};
  --shadow-lg: ${shadows.lg};

  /* Spacing */
  --space-xs: ${spacing.xs};
  --space-sm: ${spacing.sm};
  --space-md: ${spacing.md};
  --space-lg: ${spacing.lg};
  --space-xl: ${spacing.xl};

  /* Transitions */
  --transition-fast: ${transitions.fast};
  --transition-normal: ${transitions.normal};
  --transition-slow: ${transitions.slow};

  /* Typography */
  --font-family: ${typography.fontFamily};
  --font-family-fallback: ${typography.fontFamilyFallback};
}`
}
