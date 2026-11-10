import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { ActionResult } from '../../types/actionResult'
import type { SessionData } from '../../types/demoState'
import { fail, ok } from '../../utils/actions/actionResults'
import { actor } from '../../utils/auth/session'
import { isPublic } from '../../utils/creator/creatorAccess'
import { subscriptionsForCustomer } from '../../utils/subscription/subscriptionAccess'
import { createTransaction } from '../../utils/transactions/createTransaction'
import { getDemoState, registerDemoStore, updateDemoState } from '../persistence/demo'
import { writeEntry } from '../utils'

export interface SubscriptionField {
  subscriptions: SessionData['subscriptions']
}

interface SubscriptionState extends SubscriptionField {
  subscribe: (id: string) => ActionResult
  unsubscribe: (id: string) => ActionResult
}

const initialState: SubscriptionField = {
  subscriptions: getDemoState().subscriptions,
}

export const useSubscriptionStore = create<SubscriptionState>()(
  immer(() => ({
    ...initialState,

    subscribe(id) {
      const state = getDemoState()
      const a = actor(state)
      if (a?.role !== 'customer' || !isPublic(state, id)) {
        return fail('구독할 수 없는 계정입니다.')
      }

      const list = subscriptionsForCustomer(state, a.id)
      if (list.includes(id)) {
        return fail('이미 구독 중입니다.')
      }

      const transaction = createTransaction('subscribe', id, a.id, { won: state.creators[id].price })
      updateDemoState((draft) => {
        draft.subscriptions = writeEntry(draft.subscriptions, a.id, [...list, id])
        draft.transactions.unshift(transaction)
      })
      return ok
    },

    unsubscribe(id) {
      const state = getDemoState()
      const a = actor(state)
      if (a?.role !== 'customer') {
        return fail('구독 내역을 찾을 수 없습니다.')
      }

      const list = subscriptionsForCustomer(state, a.id)
      if (!list.includes(id)) {
        return fail('구독 내역을 찾을 수 없습니다.')
      }

      const remaining = list.filter((item) => item !== id)
      const transaction = createTransaction('unsubscribe', id, a.id, {})
      updateDemoState((draft) => {
        draft.subscriptions = writeEntry(draft.subscriptions, a.id, remaining)
        draft.transactions.unshift(transaction)
      })
      return ok
    },
  }))
)

registerDemoStore(initialState, useSubscriptionStore)
