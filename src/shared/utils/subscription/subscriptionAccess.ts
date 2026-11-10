import type { SessionData } from '../../types/demoState'
import { isPublic } from '../creator/creatorAccess'

export const subscriptionsForCustomer = ({ subscriptions }: SessionData, customer: string) =>
  Object.hasOwn(subscriptions, customer) ? subscriptions[customer] ?? [] : []

export const hasSubscription = (state: SessionData, customer: string, creator: string) =>
  state.accounts[customer]?.role === 'customer' &&
  !state.accounts[customer].disabled &&
  isPublic(state, creator) &&
  subscriptionsForCustomer(state, customer).includes(creator)

export const subscriberCount = (state: SessionData, creator: string) =>
  (state.creators[creator]?.fans ?? 0) +
  Object.keys(state.subscriptions).filter((customer) => hasSubscription(state, customer, creator)).length
