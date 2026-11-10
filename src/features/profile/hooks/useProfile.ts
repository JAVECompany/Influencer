import { useState } from 'react'
import { useAccountStore } from '../../../shared/store/account/account'
import { useAuthStore } from '../../../shared/store/auth/auth'
import { useCreatorStore } from '../../../shared/store/creator/creator'
import { useSubscriptionStore } from '../../../shared/store/subscription/subscription'
import { subscriptionsForCustomer } from '../../../shared/utils/subscription/subscriptionAccess'
import type { Creator, ProfileChanges } from '../../../shared/types/account'
import type { PageProps } from '../../../shared/types/navigation'

export function useProfile({ account, notify }: Pick<PageProps, 'account' | 'notify'>) {
  const accounts = useAccountStore((state) => state.accounts)
  const creators = useCreatorStore((state) => state.creators)
  const subscriptions = useSubscriptionStore((state) => state.subscriptions)
  const updateProfile = useAccountStore((state) => state.profile)
  const unsubscribeFromCreator = useSubscriptionStore((state) => state.unsubscribe)
  const signOut = useAuthStore((state) => state.signOut)
  const [dialog, setDialog] = useState<'profile' | 'password' | 'payment' | Creator | null>(null)
  const creator = creators[account.id]
  const subs = subscriptionsForCustomer({ subscriptions }, account.id)
    .map((id) => creators[id])
    .filter(Boolean)
  const save = (changes: ProfileChanges, message: string) => {
    const result = updateProfile(changes)
    notify(result, message)
    if (!result.error) {
      setDialog(null)
    }
  }
  const closeDialog = () => setDialog(null)
  const toggleNotifications = () =>
    notify(updateProfile({ notifications: !account.notifications }), '알림 설정을 저장했어요.')
  const unsubscribe = (id: string) => {
    notify(unsubscribeFromCreator(id), '구독을 해지했어요.')
    closeDialog()
  }

  return {
    accounts,
    creator,
    subs,
    dialog,
    setDialog,
    closeDialog,
    save,
    toggleNotifications,
    unsubscribe,
    signOut,
  }
}
