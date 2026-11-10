import { useState } from 'react'
import { hasSubscription, isPublic, subscriberCount } from '../../../shared/store/appSelectors'
import { useAppStore } from '../../../shared/store/useAppStore'
import type { Account } from '../../../shared/types/account'

export function useDiscoverCreators(account: Account) {
  const state = useAppStore()
  const [query, setQuery] = useState('')
  const term = query.trim().replace(/^@/, '').toLowerCase()
  const items = Object.values(state.creators)
    .filter((creator) => isPublic(state, creator.id))
    .map((creator) => ({
      creator,
      account: state.accounts[creator.id],
      count: subscriberCount(state, creator.id),
      subscribed: hasSubscription(state, account.id, creator.id),
    }))
    .sort((a, b) => b.count - a.count)
  const matches = items.filter(
    ({ creator }) => creator.name.toLowerCase().includes(term) || creator.handle.toLowerCase().includes(term)
  )
  const peak = items[0]?.count || 1

  return { query, setQuery, term, items, matches, peak }
}
