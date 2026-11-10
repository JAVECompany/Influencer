import { useAccountStore } from '../../store/account/account'
import { useAuthStore } from '../../store/auth/auth'
import { useCreatorStore } from '../../store/creator/creator'
import { useSubscriptionStore } from '../../store/subscription/subscription'

export function useContentAccessData() {
  const accounts = useAccountStore((s) => s.accounts)
  const session = useAuthStore((s) => s.session)
  const creators = useCreatorStore((s) => s.creators)
  const subscriptions = useSubscriptionStore((s) => s.subscriptions)

  return { accounts, session, creators, subscriptions }
}
