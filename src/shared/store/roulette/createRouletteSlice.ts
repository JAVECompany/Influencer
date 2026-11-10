import type { ActionResult } from '../../types/actionResult'
import type { Reward } from '../../types/commerce'
import { rouletteConfigurationError } from '../../utils/roulette/roulette'
import { fail, ok } from '../core/actionResults'
import type { AppStoreSlice } from '../core/appStoreTypes'
import { getApprovedCreatorAccount } from '../creator/creatorSelectors'

export interface RouletteActions {
  saveRoulette: (cost: number, rewards: Reward[], topPrizeCost?: number | null) => ActionResult
}

export const createRouletteSlice: AppStoreSlice<RouletteActions> = (set, get) => ({
  saveRoulette(cost, rewards, topPrizeCost = null) {
    const state = get()
    const a = getApprovedCreatorAccount(state)
    if (!a) return fail('룰렛을 설정할 권한이 없습니다.')
    const error = rouletteConfigurationError(cost, rewards, topPrizeCost)
    if (error) return fail(error)
    set({
      roulettes: {
        ...state.roulettes,
        [a.id]: {
          cost,
          topPrizeCost,
          rewards: rewards.map((r) => ({
            name: r.name.trim().slice(0, 60),
            chance: r.chance,
          })),
        },
      },
    })
    return ok
  },
})
