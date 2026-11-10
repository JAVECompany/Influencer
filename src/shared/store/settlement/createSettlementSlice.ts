import type { ActionResult } from '../../types/actionResult'
import { actor } from '../auth/authSelectors'
import { fail, ok } from '../core/actionResults'
import type { AppStoreSlice } from '../core/appStoreTypes'
import { isAmountInRange } from '../core/isAmountInRange'

export interface SettlementActions {
  configureSettlement: (coinWon: number, feeBps: number) => ActionResult
  overrideSettlementCoins: (periodKey: string, id: string, coins: number | null) => ActionResult
}

export const createSettlementSlice: AppStoreSlice<SettlementActions> = (set, get) => ({
  configureSettlement(coinWon, feeBps) {
    const state = get()
    if (actor(state)?.role !== 'admin') return fail('관리자만 정산 기준을 설정할 수 있습니다.')
    if (!isAmountInRange(coinWon, 1, 10000) || !isAmountInRange(feeBps, 0, 10000))
      return fail('코인 단가와 0~100% 수수료를 확인해 주세요.')
    set({ settlement: { ...state.settlement, coinWon, feeBps } })
    return ok
  },

  overrideSettlementCoins(periodKey, id, coins) {
    const state = get()
    if (
      actor(state)?.role !== 'admin' ||
      !state.creators[id] ||
      !/^\d{4}-\d{2}-\d{2}\/\d{4}-\d{2}-\d{2}$/.test(periodKey)
    ) {
      return fail('정산 기간과 크리에이터를 확인해 주세요.')
    }
    if (coins !== null && !isAmountInRange(coins, 0, 10_000_000))
      return fail('0~10,000,000 사이의 정수 코인을 입력해 주세요.')
    const overrides = { ...state.settlement.overrides }
    const manual = { ...overrides[periodKey] }
    if (coins === null) delete manual[id]
    else manual[id] = coins
    if (Object.keys(manual).length) overrides[periodKey] = manual
    else delete overrides[periodKey]
    set({ settlement: { ...state.settlement, overrides } })
    return ok
  },
})
