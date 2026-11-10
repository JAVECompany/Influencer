import { useState } from 'react'
import { hasSubscription, countSubscribers } from '../../../shared/utils/subscription/subscriptionAccess'
import { isPublic } from '../../../shared/utils/creator/creatorAccess'
import { useAccountStore } from '../../../shared/store/account/account'
import { useCreatorStore } from '../../../shared/store/creator/creator'
import { useSubscriptionStore } from '../../../shared/store/subscription/subscription'
import type { IAccount } from '../../../shared/types/account'

export function useDiscoverCreators(account: IAccount) {
  const accounts = useAccountStore((s) => s.accounts)
  const creators = useCreatorStore((s) => s.creators)
  const subscriptions = useSubscriptionStore((s) => s.subscriptions)
  const state = { accounts, creators, subscriptions }
  const [query, setQuery] = useState('')
  const term = query.trim().replace(/^@/, '').toLowerCase()
  const items = Object.values(state.creators)
    .filter((creator) => isPublic(state, creator.id))
    .map((creator) => ({
      creator,
      account: state.accounts[creator.id],
      count: countSubscribers(state, creator.id),
      subscribed: hasSubscription(state, account.id, creator.id),
    }))
    .sort((a, b) => b.count - a.count)
  const matches = items.filter(
    ({ creator }) => creator.name.toLowerCase().includes(term) || creator.handle.toLowerCase().includes(term)
  )
  const peak = items[0]?.count || 1

  return { query, setQuery, term, items, matches, peak }
}
