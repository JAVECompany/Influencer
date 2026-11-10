import { useState } from 'react'
import { canRead, isStoryAvailable } from '../../../shared/utils/content/contentAccess'
import { hasSubscription } from '../../../shared/utils/subscription/subscriptionAccess'
import { isPublic } from '../../../shared/utils/creator/creatorAccess'
import { useContentAccessData } from '../../../shared/hooks/content/useContentAccessData'
import { useContentStore } from '../../../shared/store/content/content'
import type { Account } from '../../../shared/types/account'
import { byRecent } from '../../../shared/utils/content/contentOrder'

export function useHomeFeed(account: Account) {
  const access = useContentAccessData()
  const { accounts, creators } = access
  const posts = useContentStore((state) => state.posts)
  const [preview, setPreview] = useState<string | null>(null)
  const [owner, setOwner] = useState('')
  const [limit, setLimit] = useState(8)
  const staff = account.role === 'admin'
  const readable = posts.filter(
    (p) => creators[p.owner] && (!owner || p.owner === owner) && canRead(access, p)
  )
  const feed = readable.filter((p) => p.kind === 'post').sort(byRecent)
  const stories = readable
    .filter((p) => p.kind !== 'post' && (staff || isStoryAvailable(p)))
    .sort((a, b) => Number(b.kind === 'live') - Number(a.kind === 'live') || byRecent(a, b))
  const spotlight = Object.values(creators)
    .filter((c) => isPublic(access, c.id) && !hasSubscription(access, account.id, c.id))
    .sort((a, b) => b.fans - a.fans)
    .slice(0, 4)
  const reviewCreators = staff
    ? Object.values(creators)
        .filter((c) => c.status === 'approved')
        .sort((a, b) => a.name.localeCompare(b.name, 'ko'))
    : []
  const previewPost = posts.find((post) => post.id === preview)
  const changeOwner = (id: string) => {
    setOwner(id)
    setLimit(8)
  }
  const loadMore = () => setLimit(limit + 8)

  return {
    accounts,
    creators,
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
