import { useEffect, useState } from 'react'
import type { FeedbackMessage } from '../../shared/contexts/feedbackContext'
import { useAuthStore } from '../../shared/store/auth/auth'
import type { Notify } from '../../shared/types/actionResult'

export function useAppFeedback(accountId: string | null) {
  const [message, setMessage] = useState<(FeedbackMessage & { accountId: string | null }) | null>(null)
  const notify: Notify = (result, success) => {
    const text = result.error || success
    setMessage(
      text ? { text, error: Boolean(result.error), accountId: useAuthStore.getState().session } : null
    )
  }
  useEffect(() => {
    if (!message) {
      return
    }

    const timeout = setTimeout(() => setMessage(null), 4400)
    return () => clearTimeout(timeout)
  }, [message])
  const feedback = message?.accountId === accountId ? message : null

  return { feedback, notify }
}
