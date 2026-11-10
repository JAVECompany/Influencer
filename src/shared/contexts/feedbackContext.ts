import { createContext } from 'react'

export type FeedbackMessage = { text: string; error: boolean }

export const FeedbackContext = createContext<FeedbackMessage | null>(null)
