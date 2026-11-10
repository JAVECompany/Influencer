import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { ActionResult } from '../../types/actionResult'
import type { SessionData } from '../../types/demoState'
import { fail, ok } from '../../utils/actions/actionResults'
import { actor } from '../../utils/auth/session'
import { isAmountInRange } from '../../utils/validation/isAmountInRange'
import { getDemoState, registerDemoStore } from '../persistence/demo'
import { writeEntry } from '../utils'

export interface SettlementField {
  settlement: SessionData['settlement']
}

interface SettlementState extends SettlementField {
  configureSettlement: (coinWon: number, feeBps: number) => ActionResult
  overrideSettlementCoins: (periodKey: string, id: string, coins: number | null) => ActionResult
}

const initialState: SettlementField = {
  settlement: getDemoState().settlement,
}

export const useSettlementStore = create<SettlementState>()(
  immer((set) => ({
    ...initialState,

    configureSettlement(coinWon, feeBps) {
      const state = getDemoState()
      if (actor(state)?.role !== 'admin') {
        return fail('관리자만 정산 기준을 설정할 수 있습니다.')
      }
      if (!isAmountInRange(coinWon, 1, 10000) || !isAmountInRange(feeBps, 0, 10000)) {
        return fail('코인 단가와 0~100% 수수료를 확인해 주세요.')
      }

      set((draft) => {
        draft.settlement.coinWon = coinWon
        draft.settlement.feeBps = feeBps
      })
      return ok
    },

    overrideSettlementCoins(periodKey, id, coins) {
      const state = getDemoState()
      if (
        actor(state)?.role !== 'admin' ||
        !state.creators[id] ||
        !/^\d{4}-\d{2}-\d{2}\/\d{4}-\d{2}-\d{2}$/.test(periodKey)
      ) {
        return fail('정산 기간과 크리에이터를 확인해 주세요.')
      }
      if (coins !== null && !isAmountInRange(coins, 0, 10_000_000)) {
        return fail('0~10,000,000 사이의 정수 코인을 입력해 주세요.')
      }

      set((draft) => {
        const overrides = draft.settlement.overrides
        if (coins !== null) {
          overrides[periodKey] = writeEntry(overrides[periodKey] ?? {}, id, coins)
        } else {
          const manual = overrides[periodKey]
          if (!manual) {
            return
          }

          delete manual[id]
          if (!Object.keys(manual).length) {
            delete overrides[periodKey]
          }
        }
      })
      return ok
    },
  }))
)

registerDemoStore(initialState, useSettlementStore)
