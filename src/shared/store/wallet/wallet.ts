import { coinPacks } from '../../constants/coinPacks'
import type { ActionResult, SpendResult } from '../../types/actionResult'
import type { ShippingAddress, SpendType } from '../../types/commerce'
import { fail, ok } from '../../utils/actions/actionResults'
import { actor } from '../../utils/auth/session'
import { createTransaction } from '../../utils/transactions/createTransaction'
import { preparePurchase } from '../../utils/wallet/purchase'
import type { AppStoreSlice } from '../types'
import { writeEntry } from '../utils'

export interface WalletActions {
  topUp: (coins: number) => ActionResult
  spend: (creator: string, type: SpendType, productId?: string, address?: ShippingAddress) => SpendResult
}

export const createWalletSlice: AppStoreSlice<WalletActions> = (set, get) => ({
  topUp(coins) {
    const state = get()
    const account = actor(state)
    const pack = coinPacks.find((item) => item.coins === coins)
    if (account?.role !== 'customer' || !pack) return fail('충전할 수 없는 묶음입니다.')
    const transaction = createTransaction('topup', null, account.id, { coins, won: pack.won })
    const balance = Object.hasOwn(state.balances, account.id) ? state.balances[account.id] : 0
    set((draft) => {
      draft.balances = writeEntry(draft.balances, account.id, (balance ?? 0) + coins)
      draft.transactions.unshift(transaction)
    })
    return ok
  },

  spend(creator, type, productId, address) {
    const purchase = preparePurchase(get(), creator, type, productId, address)
    if ('error' in purchase) return purchase
    const { balance, transaction, reward, rewardIndex } = purchase
    set((draft) => {
      draft.balances = writeEntry(draft.balances, transaction.customer, balance)
      draft.transactions.unshift(transaction)
    })
    return { success: true, reward, rewardIndex }
  },
})
