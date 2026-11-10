import { coinPacks } from '../../constants/coinPacks'
import type { ActionResult, SpendResult } from '../../types/actionResult'
import type { SpendType } from '../../types/commerce'
import { drawRewardIndex } from '../../utils/roulette/roulette'
import { actor } from '../auth/authSelectors'
import { fail, ok } from '../core/actionResults'
import type { AppStoreSlice } from '../core/appStoreTypes'
import { hasSubscription } from '../subscription/subscriptionSelectors'
import { createTransaction } from '../transactions/createTransaction'

export interface WalletActions {
  topUp: (coins: number) => ActionResult
  spend: (creator: string, type: SpendType, productId?: string) => SpendResult
}

export const createWalletSlice: AppStoreSlice<WalletActions> = (set, get) => ({
  topUp(coins) {
    const state = get()
    const a = actor(state)
    const pack = coinPacks.find((item) => item.coins === coins)
    if (a?.role !== 'customer' || !pack) return fail('충전할 수 없는 묶음입니다.')
    set({
      balances: { ...state.balances, [a.id]: (state.balances[a.id] ?? 0) + coins },
      transactions: [createTransaction('topup', null, a.id, { coins, won: pack.won }), ...state.transactions],
    })
    return ok
  },

  spend(creator, type, productId) {
    const state = get()
    const a = actor(state)
    if (a?.role !== 'customer' || !hasSubscription(state, a.id, creator))
      return fail('구독 중인 고객만 이용할 수 있습니다.')
    const guaranteed = type === 'roulette-guaranteed'
    const product =
      type === 'product'
        ? state.products.find((p) => p.id === productId && p.owner === creator && !p.archived)
        : undefined
    const roulette = type === 'roulette' || guaranteed ? state.roulettes[creator] : undefined
    const cost = guaranteed ? roulette?.topPrizeCost : (product || roulette)?.cost
    const balance = state.balances[a.id] ?? 0
    if (!cost) return fail('판매가 종료되었습니다.')
    if (product && state.transactions.some((t) => t.productId === productId && t.customer === a.id))
      return fail('이미 구매한 상품입니다.')
    if (balance < cost) return fail('코인이 부족합니다. 스토어에서 충전할 수 있어요.')
    const rewardIndex = roulette ? (guaranteed ? 0 : drawRewardIndex(roulette.rewards)) : undefined
    const reward = roulette && rewardIndex !== undefined ? roulette.rewards[rewardIndex]?.name : product?.name
    if (!reward) return fail('상품을 찾을 수 없습니다.')
    set({
      balances: { ...state.balances, [a.id]: balance - cost },
      transactions: [
        createTransaction(roulette ? 'roulette' : 'product', creator, a.id, {
          coins: cost,
          productId,
          reward,
          guaranteed,
        }),
        ...state.transactions,
      ],
    })
    return { success: true, reward, rewardIndex }
  },
})
