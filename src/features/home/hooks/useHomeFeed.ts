import { useState } from 'react'
import { canRead, isStoryAvailable } from '../../../shared/store/content/contentSelectors'
import { hasSubscription } from '../../../shared/store/subscription/subscriptionSelectors'
import { isPublic } from '../../../shared/store/creator/creatorSelectors'
import { useAppStore } from '../../../shared/store/core/useAppStore'
import type { Account } from '../../../shared/types/account'
import { byRecent } from '../../../shared/utils/content/contentOrder'

export function useHomeFeed(account: Account) {
  const state = useAppStore()
  const [preview, setPreview] = useState<string | null>(null)
  const [owner, setOwner] = useState('')
  const [limit, setLimit] = useState(8)
  const staff = account.role === 'admin'
  const readable = state.posts.filter(
    (p) => state.creators[p.owner] && (!owner || p.owner === owner) && canRead(state, p)
  )
  const feed = readable.filter((p) => p.kind === 'post').sort(byRecent)
  const stories = readable
    .filter((p) => p.kind !== 'post' && (staff || isStoryAvailable(p)))
    .sort((a, b) => Number(b.kind === 'live') - Number(a.kind === 'live') || byRecent(a, b))
  const spotlight = Object.values(state.creators)
    .filter((c) => isPublic(state, c.id) && !hasSubscription(state, account.id, c.id))
    .sort((a, b) => b.fans - a.fans)
    .slice(0, 4)
  const reviewCreators = staff
    ? Object.values(state.creators)
        .filter((c) => c.status === 'approved')
        .sort((a, b) => a.name.localeCompare(b.name, 'ko'))
    : []
  const previewPost = state.posts.find((post) => post.id === preview)
  const changeOwner = (id: string) => {
    setOwner(id)
    setLimit(8)
  }
  const loadMore = () => setLimit(limit + 8)

  return {
    accounts: state.accounts,
    creators: state.creators,
    previewPost,
    preview,
    setPreview,
    owner,
    changeOwner,
    limit,
    loadMore,
    staff,
    feed,
    stories,
    spotlight,
    reviewCreators,
  }
}
