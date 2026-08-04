import { baseTokens } from '../tokens'
import type { ThemeTokens } from '@/types/theme'

export const darkTheme: ThemeTokens = {
  name: 'dark',
  ...baseTokens,
  colors: {
    ...baseTokens.colors,
    primary: '#6366f1',
    primaryHover: '#4f46e5',
    primaryLight: '#312e81',
    background: '#0f172a',
    backgroundCard: '#1e293b',
    text: '#f1f5f9',
    textSecondary: '#94a3b8',
    textInverse: '#0f172a',
    border: '#334155',
    borderLight: '#1e293b',
  },
  typography: {
    ...baseTokens.typography,
  },
}
