import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { ProfileChanges } from '../../types/account'
import type { ActionResult } from '../../types/actionResult'
import type { SessionData } from '../../types/demoState'
import { prepareProfileChanges } from '../../utils/account/profileChanges'
import { fail, ok } from '../../utils/actions/actionResults'
import { actor } from '../../utils/auth/session'
import { getDemoState, registerDemoStore, updateDemoState } from '../persistence/demo'
import {createSetDataImmer, Setter} from "../zustandTypes";

interface IAccountField {
  accounts: SessionData['accounts']
}

interface IAccountState extends IAccountField {
  profile: (changes: ProfileChanges) => ActionResult
  toggleAccount: (id: string) => ActionResult
  setData: Setter<IAccountField>
}

const initialState: IAccountField = {
  accounts: getDemoState().accounts,
}

export const useAccountStore = create<IAccountState>()(
  immer((set) => ({
    ...initialState,

    setData: createSetDataImmer<IAccountField>(set),

    profile(changes) {
      const state = getDemoState()
      const a = actor(state)
      if (!a) {
        return fail('로그인이 필요합니다.')
      }

      const update = prepareProfileChanges(state, a, changes)
      if ('error' in update) {
        return update
      }

      updateDemoState((draft) => {
        Object.assign(draft.accounts[a.id], update)
        const creator = draft.creators[a.id]
        if (creator && update.name) {
          creator.name = update.name
        }
      })
      return ok
    },

    toggleAccount(id) {
      const state = getDemoState()
      const target = state.accounts[id]
      if (actor(state)?.role !== 'admin' || target?.role === 'admin') {
        return fail('계정 상태를 변경할 수 없습니다.')
      }
      if (target) {
        set((draft) => {
          draft.accounts[id].disabled = !target.disabled
        })
        return ok
      }

      const creator = state.creators[id]
      if (creator?.status !== 'approved') {
        return fail('계정 상태를 변경할 수 없습니다.')
      }

      updateDemoState((draft) => {
        draft.creators[id].disabled = !creator.disabled
      })
      return ok
    },
  }))
)

registerDemoStore(initialState, useAccountStore)
