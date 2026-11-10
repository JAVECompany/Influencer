import type { ActionResult } from '../../types/actionResult'
import type { Reward } from '../../types/commerce'
import { prepareRoulette } from '../../utils/roulette/configuration'
import { fail, ok } from '../../utils/actions/actionResults'
import type { AppStoreSlice } from '../types'
import { writeEntry } from '../utils'
import { getApprovedCreatorAccount } from '../../utils/creator/creatorAccess'

export interface RouletteActions {
  saveRoulette: (cost: number, rewards: Reward[], topPrizeCost?: number | null) => ActionResult
}

export const createRouletteSlice: AppStoreSlice<RouletteActions> = (set, get) => ({
  saveRoulette(cost, rewards, topPrizeCost = null) {
    const state = get()
    const a = getApprovedCreatorAccount(state)
    if (!a) return fail('룰렛을 설정할 권한이 없습니다.')
    const roulette = prepareRoulette(cost, rewards, topPrizeCost)
    if ('error' in roulette) return roulette
    set((draft) => {
      draft.roulettes = writeEntry(draft.roulettes, a.id, roulette)
    })
    return ok
  },
})
