import { useLayoutEffect } from 'react'
import { useThemeStore } from '../../store/theme/theme'

export function useThemeSync() {
  const theme = useThemeStore((s) => s.theme)

  useLayoutEffect(() => {
    const system = window.matchMedia('(prefers-color-scheme: dark)')
    const root = document.documentElement
    const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
    const apply = () => {
      const resolvedTheme = theme === 'system' ? (system.matches ? 'dark' : 'light') : theme
      root.dataset.theme = resolvedTheme
      if (favicon) {
        favicon.href = `${import.meta.env.BASE_URL}brand/logos/${resolvedTheme}.png`
      }
      if (themeColor) {
        themeColor.content = getComputedStyle(root).getPropertyValue('--theme-canvas').trim()
      }
    }
    apply()

    if (theme === 'system') {
      system.addEventListener('change', apply)
      return () => system.removeEventListener('change', apply)
    }
  }, [theme])
}
