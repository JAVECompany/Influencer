import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { coinPacks } from '../../constants/coinPacks'
import type { ActionResultType, SpendResultType } from '../../types/actionResult'
import type { IShippingAddress, SpendType } from '../../types/commerce'
import type { ISessionData } from '../../types/demoState'
import { fail, ok } from '../../utils/actions/actionResults'
import { getActiveAccount } from '../../utils/auth/session'
import { createTransaction } from '../../utils/transactions/createTransaction'
import { preparePurchase } from '../../utils/wallet/purchase'
import { getDemoState, registerDemoStore } from '../persistence/demo'
import { writeEntry } from '../utils'

export interface IWalletField {
  balances: ISessionData['balances']
  transactions: ISessionData['transactions']
}

interface IWalletState extends IWalletField {
  topUpCoins: (coins: number) => ActionResultType
  spendCoins: (
    creator: string,
    type: SpendType,
    productId?: string,
    address?: IShippingAddress
  ) => SpendResultType
}

const initialState: IWalletField = {
  balances: getDemoState().balances,
  transactions: getDemoState().transactions,
}

export const useWalletStore = create<IWalletState>()(
  immer((set) => ({
    ...initialState,

    topUpCoins(coins) {
      const state = getDemoState()
      const account = getActiveAccount(state)
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

    spendCoins(creator, type, productId, address) {
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
