import { useLayoutEffect } from 'react'
import { useThemeStore } from '../../store/theme/useThemeStore'

export function useThemeSync() {
  const theme = useThemeStore((state) => state.theme)

  useLayoutEffect(() => {
    const system = window.matchMedia('(prefers-color-scheme: dark)')
    const root = document.documentElement
    const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    const apply = () => {
      root.dataset.theme = theme === 'system' ? (system.matches ? 'dark' : 'light') : theme
      if (themeColor) themeColor.content = getComputedStyle(root).getPropertyValue('--theme-canvas').trim()
    }
    apply()

    if (theme === 'system') {
      system.addEventListener('change', apply)
      return () => system.removeEventListener('change', apply)
    }
  }, [theme])
}
