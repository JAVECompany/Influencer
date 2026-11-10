import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { isThemePreference } from '../../constants/theme/themePreferences'
import type { ThemePreference } from '../../constants/theme/themePreferences'

interface ThemeState {
  theme: ThemePreference
  setTheme: (theme: ThemePreference) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'system',
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'bamgyeol-theme-v1',
      partialize: ({ theme }) => ({ theme }),
      merge: (persisted, current) => {
        const theme = (persisted as Partial<ThemeState> | undefined)?.theme
        return isThemePreference(theme) ? { ...current, theme } : current
      },
    }
  )
)
