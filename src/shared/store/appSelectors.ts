import type { Content } from '../types/content'
import type { SessionData } from '../types/demoState'

export const actor = (state: SessionData) => {
  const account = state.session ? state.accounts[state.session] : undefined
  return account?.disabled ? undefined : account
}

export const isAccountDisabled = (state: SessionData, id: string) =>
  state.accounts[id]?.disabled ?? state.creators[id]?.disabled ?? false

export const isPublic = (state: SessionData, id: string) =>
  state.creators[id]?.status === 'approved' && !isAccountDisabled(state, id)

export const hasSubscription = (state: SessionData, customer: string, creator: string) =>
  state.accounts[customer]?.role === 'customer' &&
  !state.accounts[customer].disabled &&
  isPublic(state, creator) &&
  (state.subscriptions[customer] ?? []).includes(creator)

export const subscriberCount = (state: SessionData, creator: string) =>
  (state.creators[creator]?.fans ?? 0) +
  Object.keys(state.subscriptions).filter((customer) => hasSubscription(state, customer, creator)).length

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
