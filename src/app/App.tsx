import AuthScreen from '../features/auth/screens/AuthScreen'
import FeedbackToast from '../shared/components/ui/feedback/FeedbackToast'
import { ContentPrivacyContext } from '../shared/contexts/contentPrivacyContext'
import { FeedbackContext } from '../shared/contexts/feedbackContext'
import { usePagePrivacyMask } from '../shared/hooks/privacy/usePagePrivacyMask'
import { usePrintPrivacyMask } from '../shared/hooks/privacy/usePrintPrivacyMask'
import { useThemeSync } from '../shared/hooks/theme/useThemeSync'
import { getActiveAccount } from '../shared/utils/auth/session'
import { useAccountStore } from '../shared/store/account/account'
import { useAuthStore } from '../shared/store/auth/auth'
import WorkspaceLayout from './components/WorkspaceLayout'
import { useAppFeedback } from './hooks/useAppFeedback'

export default function App() {
  useThemeSync()
  const session = useAuthStore((s) => s.session)
  const account = useAccountStore((s) => getActiveAccount({ accounts: s.accounts, session }))
  const inactive = usePagePrivacyMask()
  const printing = usePrintPrivacyMask()
  const { feedback, notify } = useAppFeedback(account?.id ?? null)
  return (
    <ContentPrivacyContext.Provider value={printing ? 'print' : inactive ? 'inactive' : null}>
      <FeedbackContext.Provider value={feedback}>
        {account ? (
          <WorkspaceLayout key={account.id} account={account} notify={notify} />
        ) : (
          <AuthScreen notify={notify} />
        )}
        {feedback && <FeedbackToast feedback={feedback} />}
      </FeedbackContext.Provider>
    </ContentPrivacyContext.Provider>
  )
}
