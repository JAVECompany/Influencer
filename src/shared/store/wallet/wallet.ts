import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { coinPacks } from '../../constants/coinPacks'
import type { ActionResult, SpendResult } from '../../types/actionResult'
import type { ShippingAddress, SpendType } from '../../types/commerce'
import type { SessionData } from '../../types/demoState'
import { fail, ok } from '../../utils/actions/actionResults'
import { actor } from '../../utils/auth/session'
import { createTransaction } from '../../utils/transactions/createTransaction'
import { preparePurchase } from '../../utils/wallet/purchase'
import { getDemoState, registerDemoStore } from '../persistence/demo'
import { writeEntry } from '../utils'

export interface WalletField {
  balances: SessionData['balances']
  transactions: SessionData['transactions']
}

interface WalletState extends WalletField {
  topUp: (coins: number) => ActionResult
  spend: (creator: string, type: SpendType, productId?: string, address?: ShippingAddress) => SpendResult
}

const initialState: WalletField = {
  balances: getDemoState().balances,
  transactions: getDemoState().transactions,
}

export const useWalletStore = create<WalletState>()(
  immer((set) => ({
    ...initialState,

    topUp(coins) {
      const state = getDemoState()
      const account = actor(state)
      const pack = coinPacks.find((item) => item.coins === coins)
      if (account?.role !== 'customer' || !pack) {
        return fail('충전할 수 없는 묶음입니다.')
      }

      const transaction = createTransaction('topup', null, account.id, { coins, won: pack.won })
      const balance = Object.hasOwn(state.balances, account.id) ? state.balances[account.id] : 0
      set((draft) => {
        draft.balances = writeEntry(draft.balances, account.id, (balance ?? 0) + coins)
        draft.transactions.unshift(transaction)
      })
      return ok
    },

    spend(creator, type, productId, address) {
      const purchase = preparePurchase(getDemoState(), creator, type, productId, address)
      if ('error' in purchase) {
        return purchase
      }

      const { balance, transaction, reward, rewardIndex } = purchase
      set((draft) => {
        draft.balances = writeEntry(draft.balances, transaction.customer, balance)
        draft.transactions.unshift(transaction)
      })
      return { success: true, reward, rewardIndex }
    },
  }))
)

registerDemoStore(initialState, useWalletStore)
