import { baseTokens } from '../tokens'
import type { ThemeTokens } from '@/types/theme'

export const lightTheme: ThemeTokens = {
  name: 'light',
  ...baseTokens,
  colors: {
    ...baseTokens.colors,
    background: '#f8fafc',
    backgroundCard: '#ffffff',
    text: '#1e293b',
    textSecondary: '#64748b',
    border: '#e2e8f0',
  },
  typography: {
    ...baseTokens.typography,
  },
}
