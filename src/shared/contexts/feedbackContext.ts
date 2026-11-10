import { createContext } from 'react'

export type FeedbackMessageType = { text: string; error: boolean }

export const FeedbackContext = createContext<FeedbackMessageType | null>(null)
