import type { SessionData } from '../../types/demoState'
import { isPublic } from '../creator/creatorAccess'

type SubscriptionData = Pick<SessionData, 'accounts' | 'creators' | 'subscriptions'>

export const subscriptionsForCustomer = (
  { subscriptions }: Pick<SubscriptionData, 'subscriptions'>,
  customer: string
) => (Object.hasOwn(subscriptions, customer) ? subscriptions[customer] ?? [] : [])

export const hasSubscription = (state: SubscriptionData, customer: string, creator: string) =>
  state.accounts[customer]?.role === 'customer' &&
  !state.accounts[customer].disabled &&
  isPublic(state, creator) &&
  subscriptionsForCustomer(state, customer).includes(creator)

export const subscriberCount = (state: SubscriptionData, creator: string) =>
  (state.creators[creator]?.fans ?? 0) +
  Object.keys(state.subscriptions).filter((customer) => hasSubscription(state, customer, creator)).length
