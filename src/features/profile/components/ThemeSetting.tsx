import { ChevronDown, Palette } from 'lucide-react'
import { isThemePreference, themeLabels } from '../../../shared/constants/theme/themePreferences'
import { useThemeStore } from '../../../shared/store/theme/theme'

export default function ThemeSetting() {
  const theme = useThemeStore((s) => s.theme)
  const setTheme = useThemeStore((s) => s.setTheme)

  return (
    <label className="flex min-w-0 items-center justify-between gap-3 px-5 py-3">
      <span className="flex items-center gap-3 text-sm font-bold">
        <Palette size={18} className="shrink-0 text-muted" aria-hidden="true" />
        테마 설정
      </span>
      <span className="relative">
        <select
          value={theme}
          onChange={(event) => {
            const value = event.currentTarget.value
            if (isThemePreference(value)) {
              setTheme(value)
            }
          }}
          className="w-36 appearance-none rounded-lg border border-line bg-canvas py-2.5 pr-8 pl-3 text-sm font-semibold text-foreground hover:border-accent/50 sm:w-44"
        >
          {Object.entries(themeLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={15}
          className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-muted"
          aria-hidden="true"
        />
      </span>
    </label>
  )
}
