import type { SessionData } from '../../types/demoState'
import { isPublic } from '../creator/creatorSelectors'

export const hasSubscription = (state: SessionData, customer: string, creator: string) =>
  state.accounts[customer]?.role === 'customer' &&
  !state.accounts[customer].disabled &&
  isPublic(state, creator) &&
  (state.subscriptions[customer] ?? []).includes(creator)

export const subscriberCount = (state: SessionData, creator: string) =>
  (state.creators[creator]?.fans ?? 0) +
  Object.keys(state.subscriptions).filter((customer) => hasSubscription(state, customer, creator)).length
