import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { ActionResult } from '../../types/actionResult'
import type { Reward } from '../../types/commerce'
import type { SessionData } from '../../types/demoState'
import { fail, ok } from '../../utils/actions/actionResults'
import { getApprovedCreatorAccount } from '../../utils/creator/creatorAccess'
import { prepareRoulette } from '../../utils/roulette/configuration'
import { getDemoState, registerDemoStore } from '../persistence/demo'
import { writeEntry } from '../utils'

export interface RouletteField {
  roulettes: SessionData['roulettes']
}

interface RouletteState extends RouletteField {
  saveRoulette: (cost: number, rewards: Reward[], topPrizeCost?: number | null) => ActionResult
}

const initialState: RouletteField = {
  roulettes: getDemoState().roulettes,
}

export const useRouletteStore = create<RouletteState>()(
  immer((set) => ({
    ...initialState,

    saveRoulette(cost, rewards, topPrizeCost = null) {
      const state = getDemoState()
      const a = getApprovedCreatorAccount(state)
      if (!a) {
        return fail('룰렛을 설정할 권한이 없습니다.')
      }

      const roulette = prepareRoulette(cost, rewards, topPrizeCost)
      if ('error' in roulette) {
        return roulette
      }

      set((draft) => {
        draft.roulettes = writeEntry(draft.roulettes, a.id, roulette)
      })
      return ok
    },
  }))
)

registerDemoStore(initialState, useRouletteStore)
