import { useState } from 'react'
import { useAppStore } from '../../../shared/store/app'
import { subscriptionsForCustomer } from '../../../shared/utils/subscription/subscriptionAccess'
import type { Creator, ProfileChanges } from '../../../shared/types/account'
import type { PageProps } from '../../../shared/types/navigation'

export function useProfile({ account, notify }: Pick<PageProps, 'account' | 'notify'>) {
  const state = useAppStore()
  const [dialog, setDialog] = useState<'profile' | 'password' | 'payment' | Creator | null>(null)
  const creator = state.creators[account.id]
  const subs = subscriptionsForCustomer(state, account.id)
    .map((id) => state.creators[id])
    .filter(Boolean)
  const save = (changes: ProfileChanges, message: string) => {
    const result = state.profile(changes)
    notify(result, message)
    if (!result.error) setDialog(null)
  }
  const closeDialog = () => setDialog(null)
  const toggleNotifications = () =>
    notify(state.profile({ notifications: !account.notifications }), '알림 설정을 저장했어요.')
  const unsubscribe = (id: string) => {
    notify(state.unsubscribe(id), '구독을 해지했어요.')
    closeDialog()
  }

  return {
    accounts: state.accounts,
    creator,
    subs,
    dialog,
    setDialog,
    closeDialog,
    save,
    toggleNotifications,
    unsubscribe,
    signOut: state.signOut,
  }
}
