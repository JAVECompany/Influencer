import { useAccountStore } from '../../store/account/account'
import { useAuthStore } from '../../store/auth/auth'
import { useCreatorStore } from '../../store/creator/creator'
import { useSubscriptionStore } from '../../store/subscription/subscription'

export function useContentAccessData() {
  const accounts = useAccountStore((state) => state.accounts)
  const session = useAuthStore((state) => state.session)
  const creators = useCreatorStore((state) => state.creators)
  const subscriptions = useSubscriptionStore((state) => state.subscriptions)

  return { accounts, session, creators, subscriptions }
}
