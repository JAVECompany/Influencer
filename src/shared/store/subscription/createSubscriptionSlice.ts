import type { ActionResult } from '../../types/actionResult'
import { actor } from '../auth/authSelectors'
import { fail, ok } from '../core/actionResults'
import type { AppStoreSlice } from '../core/appStoreTypes'
import { isPublic } from '../creator/creatorSelectors'
import { createTransaction } from '../transactions/createTransaction'

export interface SubscriptionActions {
  subscribe: (id: string) => ActionResult
  unsubscribe: (id: string) => ActionResult
}

export const createSubscriptionSlice: AppStoreSlice<SubscriptionActions> = (set, get) => ({
  subscribe(id) {
    const state = get()
    const a = actor(state)
    if (a?.role !== 'customer' || !isPublic(state, id)) return fail('구독할 수 없는 계정입니다.')
    const list = state.subscriptions[a.id] ?? []
    if (list.includes(id)) return fail('이미 구독 중입니다.')
    const price = state.creators[id].price
    set({
      subscriptions: { ...state.subscriptions, [a.id]: [...list, id] },
      transactions: [createTransaction('subscribe', id, a.id, { won: price }), ...state.transactions],
    })
    return ok
  },

  unsubscribe(id) {
    const state = get()
    const a = actor(state)
    if (a?.role !== 'customer') return fail('구독 내역을 찾을 수 없습니다.')
    const list = state.subscriptions[a.id] ?? []
    if (!list.includes(id)) return fail('구독 내역을 찾을 수 없습니다.')
    set({
      subscriptions: { ...state.subscriptions, [a.id]: list.filter((item) => item !== id) },
      transactions: [createTransaction('unsubscribe', id, a.id, {}), ...state.transactions],
    })
    return ok
  },
})
