import type { ActionResult } from '../../types/actionResult'
import { fail, ok } from '../../utils/actions/actionResults'
import { actor } from '../../utils/auth/session'
import { isPublic } from '../../utils/creator/creatorAccess'
import { subscriptionsForCustomer } from '../../utils/subscription/subscriptionAccess'
import { createTransaction } from '../../utils/transactions/createTransaction'
import type { AppStoreSlice } from '../types'
import { writeEntry } from '../utils'

export interface SubscriptionActions {
  subscribe: (id: string) => ActionResult
  unsubscribe: (id: string) => ActionResult
}

export const createSubscriptionSlice: AppStoreSlice<SubscriptionActions> = (set, get) => ({
  subscribe(id) {
    const state = get()
    const a = actor(state)
    if (a?.role !== 'customer' || !isPublic(state, id)) return fail('구독할 수 없는 계정입니다.')
    const list = subscriptionsForCustomer(state, a.id)
    if (list.includes(id)) return fail('이미 구독 중입니다.')
    const transaction = createTransaction('subscribe', id, a.id, { won: state.creators[id].price })
    set((draft) => {
      draft.subscriptions = writeEntry(draft.subscriptions, a.id, [...list, id])
      draft.transactions.unshift(transaction)
    })
    return ok
  },

  unsubscribe(id) {
    const state = get()
    const a = actor(state)
    if (a?.role !== 'customer') return fail('구독 내역을 찾을 수 없습니다.')
    const list = subscriptionsForCustomer(state, a.id)
    if (!list.includes(id)) return fail('구독 내역을 찾을 수 없습니다.')
    const remaining = list.filter((item) => item !== id)
    const transaction = createTransaction('unsubscribe', id, a.id, {})
    set((draft) => {
      draft.subscriptions = writeEntry(draft.subscriptions, a.id, remaining)
      draft.transactions.unshift(transaction)
    })
    return ok
  },
})
