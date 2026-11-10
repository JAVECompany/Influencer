import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { ActionResultType } from '../../types/actionResult'
import type { ISessionData } from '../../types/demoState'
import { fail, ok } from '../../utils/actions/actionResults'
import { getActiveAccount } from '../../utils/auth/session'
import { isPublic } from '../../utils/creator/creatorAccess'
import { getCustomerSubscriptions } from '../../utils/subscription/subscriptionAccess'
import { createTransaction } from '../../utils/transactions/createTransaction'
import { getDemoState, registerDemoStore, updateDemoState } from '../persistence/demo'
import { writeEntry } from '../utils'

export interface ISubscriptionField {
  subscriptions: ISessionData['subscriptions']
}

interface ISubscriptionState extends ISubscriptionField {
  subscribeToCreator: (id: string) => ActionResultType
  unsubscribeFromCreator: (id: string) => ActionResultType
}

const initialState: ISubscriptionField = {
  subscriptions: getDemoState().subscriptions,
}

export const useSubscriptionStore = create<ISubscriptionState>()(
  immer(() => ({
    ...initialState,

    subscribeToCreator(id) {
      const state = getDemoState()
      const a = getActiveAccount(state)
      if (a?.role !== 'customer' || !isPublic(state, id)) {
        return fail('구독할 수 없는 계정입니다.')
      }

      const list = getCustomerSubscriptions(state, a.id)
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

    unsubscribeFromCreator(id) {
      const state = getDemoState()
      const a = getActiveAccount(state)
      if (a?.role !== 'customer') {
        return fail('구독 내역을 찾을 수 없습니다.')
      }

      const list = getCustomerSubscriptions(state, a.id)
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
