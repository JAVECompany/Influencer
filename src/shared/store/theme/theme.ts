import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { isThemePreference } from '../../constants/theme/themePreferences'
import type { ThemePreferenceType } from '../../constants/theme/themePreferences'
import { createSetDataImmer } from '../zustandTypes'

export interface IThemeField {
  theme: ThemePreferenceType
}

interface IThemeState extends IThemeField {
  setTheme: (theme: ThemePreferenceType) => void
}

const initialState: IThemeField = {
  theme: 'system',
}

export const useThemeStore = create<IThemeState>()(
  persist(
    immer((set) => ({
      ...initialState,

      setTheme: (theme) => createSetDataImmer<IThemeField>(set)('theme', theme),
    })),
    {
      name: 'bamgyeol-theme-v1',
      partialize: ({ theme }) => ({ theme }),
      merge: (persisted, current) => {
        const theme = (persisted as Partial<IThemeField> | undefined)?.theme
        return isThemePreference(theme) ? { ...current, theme } : current
      },
    }
  )
)
