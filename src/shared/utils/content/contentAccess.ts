import type { Content } from '../../types/content'
import type { SessionData } from '../../types/demoState'
import { actor } from '../auth/session'
import { hasSubscription } from '../subscription/subscriptionAccess'

export const canRead = (state: SessionData, post: Content | undefined) => {
  const a = actor(state)
  if (!a || !post) return false
  if (a.role === 'admin' || post.owner === a.id) return true
  return !post.hidden && a.role === 'customer' && hasSubscription(state, a.id, post.owner)
}

export const isStoryAvailable = (post: Content) => post.kind !== 'story' || Date.now() - post.at < 86_400_000

export const tracksAudience = (post: Content | undefined): post is Content & { kind: 'story' | 'live' } =>
  post?.kind === 'story' || post?.kind === 'live'

export function audienceForCreator(state: SessionData, post: Content | undefined) {
  const account = actor(state)
  if (account?.role !== 'influencer' || !tracksAudience(post) || post.owner !== account.id) return []
  return [...new Set(post.viewers)]
    .map((id) => state.accounts[id])
    .filter((viewer) => viewer?.role === 'customer')
}
