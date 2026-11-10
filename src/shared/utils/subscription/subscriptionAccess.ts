import type { ISessionData } from '../../types/demoState'
import { isPublic } from '../creator/creatorAccess'

type SubscriptionDataType = Pick<ISessionData, 'accounts' | 'creators' | 'subscriptions'>

export const getCustomerSubscriptions = (
  { subscriptions }: Pick<SubscriptionDataType, 'subscriptions'>,
  customer: string
) => (Object.hasOwn(subscriptions, customer) ? subscriptions[customer] ?? [] : [])

export const hasSubscription = (state: SubscriptionDataType, customer: string, creator: string) =>
  state.accounts[customer]?.role === 'customer' &&
  !state.accounts[customer].disabled &&
  isPublic(state, creator) &&
  getCustomerSubscriptions(state, customer).includes(creator)

export const countSubscribers = (state: SubscriptionDataType, creator: string) =>
  (state.creators[creator]?.fans ?? 0) +
  Object.keys(state.subscriptions).filter((customer) => hasSubscription(state, customer, creator)).length
