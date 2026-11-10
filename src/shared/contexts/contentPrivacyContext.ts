import { createContext } from 'react'

export const ContentPrivacyContext = createContext<'print' | 'inactive' | null>(null)
