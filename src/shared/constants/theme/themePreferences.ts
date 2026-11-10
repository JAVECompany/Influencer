export const themeLabels = {
  system: '시스템 설정',
  dark: '다크',
  light: '라이트',
  orbit: '밤결',
  'liquid-glass': '리퀴드 글래스',
  periwinkle: '페리윙클',
  peach: '피치',
  mocha: '모카',
} as const

export type ThemePreference = keyof typeof themeLabels

export const isThemePreference = (value: unknown): value is ThemePreference =>
  typeof value === 'string' && Object.hasOwn(themeLabels, value)
