import { useState } from 'react'
import { useAccountStore } from '../../../shared/store/account/account'
import { useAuthStore } from '../../../shared/store/auth/auth'
import { useCreatorStore } from '../../../shared/store/creator/creator'
import { useSubscriptionStore } from '../../../shared/store/subscription/subscription'
import { getCustomerSubscriptions } from '../../../shared/utils/subscription/subscriptionAccess'
import type { ICreator, ProfileChangesType } from '../../../shared/types/account'
import type { IPageProps } from '../../../shared/types/navigation'

export function useProfile({ account, notify }: Pick<IPageProps, 'account' | 'notify'>) {
  const accounts = useAccountStore((s) => s.accounts)
  const creators = useCreatorStore((s) => s.creators)
  const subscriptions = useSubscriptionStore((s) => s.subscriptions)
  const updateProfile = useAccountStore((s) => s.updateProfile)
  const unsubscribeFromCreator = useSubscriptionStore((s) => s.unsubscribeFromCreator)
  const signOut = useAuthStore((s) => s.signOut)
  const [dialog, setDialog] = useState<'profile' | 'password' | 'payment' | ICreator | null>(null)
  const creator = creators[account.id]
  const subs = getCustomerSubscriptions({ subscriptions }, account.id)
    .map((id) => creators[id])
    .filter(Boolean)
  const save = (changes: ProfileChangesType, message: string) => {
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
