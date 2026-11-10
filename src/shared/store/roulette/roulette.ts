import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { ActionResultType } from '../../types/actionResult'
import type { IReward } from '../../types/commerce'
import type { ISessionData } from '../../types/demoState'
import { fail, ok } from '../../utils/actions/actionResults'
import { getApprovedCreatorAccount } from '../../utils/creator/creatorAccess'
import { prepareRoulette } from '../../utils/roulette/configuration'
import { getDemoState, registerDemoStore } from '../persistence/demo'
import { writeEntry } from '../utils'

export interface IRouletteField {
  roulettes: ISessionData['roulettes']
}

interface IRouletteState extends IRouletteField {
  saveRoulette: (cost: number, rewards: IReward[], topPrizeCost?: number | null) => ActionResultType
}

const initialState: IRouletteField = {
  roulettes: getDemoState().roulettes,
}

export const useRouletteStore = create<IRouletteState>()(
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
