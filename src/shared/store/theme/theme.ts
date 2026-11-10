import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { isThemePreference } from '../../constants/theme/themePreferences'
import type { ThemePreference } from '../../constants/theme/themePreferences'
import { createSetDataImmer } from '../zustandTypes'

export interface ThemeField {
  theme: ThemePreference
}

interface ThemeState extends ThemeField {
  setTheme: (theme: ThemePreference) => void
}

const initialState: ThemeField = {
  theme: 'system',
}

export const useThemeStore = create<ThemeState>()(
  persist(
    immer((set) => {
      const setData = createSetDataImmer<ThemeField>(set)

      return {
        ...initialState,

        setTheme: (theme) => setData('theme', theme),
      }
    }),
    {
      name: 'bamgyeol-theme-v1',
      partialize: ({ theme }) => ({ theme }),
      merge: (persisted, current) => {
        const theme = (persisted as Partial<ThemeField> | undefined)?.theme
        return isThemePreference(theme) ? { ...current, theme } : current
      },
    }
  )
)
