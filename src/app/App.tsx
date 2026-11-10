import AuthScreen from '../features/auth/screens/AuthScreen'
import FeedbackToast from '../shared/components/ui/FeedbackToast'
import { ContentPrivacyContext } from '../shared/contexts/contentPrivacyContext'
import { FeedbackContext } from '../shared/contexts/feedbackContext'
import { usePagePrivacyMask } from '../shared/hooks/usePagePrivacyMask'
import { usePrintPrivacyMask } from '../shared/hooks/usePrintPrivacyMask'
import { actor } from '../shared/store/appSelectors'
import { useAppStore } from '../shared/store/useAppStore'
import WorkspaceLayout from './components/WorkspaceLayout'
import { useAppFeedback } from './hooks/useAppFeedback'

export default function App() {
  const account = useAppStore(actor)
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
