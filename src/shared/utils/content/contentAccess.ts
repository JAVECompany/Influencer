import type { IContent } from '../../types/content'
import type { ISessionData } from '../../types/demoState'
import { getActiveAccount } from '../auth/session'
import { hasSubscription } from '../subscription/subscriptionAccess'

export const canRead = (
  state: Pick<ISessionData, 'accounts' | 'creators' | 'session' | 'subscriptions'>,
  post: IContent | undefined
) => {
  const a = getActiveAccount(state)
  if (!a || !post) {
    return false
  }
  if (a.role === 'admin' || post.owner === a.id) {
    return true
  }

  return !post.hidden && a.role === 'customer' && hasSubscription(state, a.id, post.owner)
}

export const isStoryAvailable = (post: IContent) => post.kind !== 'story' || Date.now() - post.at < 86_400_000

export const tracksAudience = (post: IContent | undefined): post is IContent & { kind: 'story' | 'live' } =>
  post?.kind === 'story' || post?.kind === 'live'

export function getCreatorAudience(
  state: Pick<ISessionData, 'accounts' | 'session'>,
  post: IContent | undefined
) {
  const account = getActiveAccount(state)
  if (account?.role !== 'influencer' || !tracksAudience(post) || post.owner !== account.id) {
    return []
  }

  return [...new Set(post.viewers)]
    .map((id) => state.accounts[id])
    .filter((viewer) => viewer?.role === 'customer')
}
