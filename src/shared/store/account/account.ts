import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { ProfileChangesType } from '../../types/account'
import type { ActionResultType } from '../../types/actionResult'
import type { ISessionData } from '../../types/demoState'
import { prepareProfileChanges } from '../../utils/account/profileChanges'
import { fail, ok } from '../../utils/actions/actionResults'
import { getActiveAccount } from '../../utils/auth/session'
import { getDemoState, registerDemoStore, updateDemoState } from '../persistence/demo'
import { createSetDataImmer } from '../zustandTypes'
import type { SetterType } from '../zustandTypes'

interface IAccountField {
  accounts: ISessionData['accounts']
}

interface IAccountState extends IAccountField {
  setData: SetterType<IAccountField>
  updateProfile: (changes: ProfileChangesType) => ActionResultType
  toggleAccount: (id: string) => ActionResultType
}

const initialState: IAccountField = {
  accounts: getDemoState().accounts,
}

export const useAccountStore = create<IAccountState>()(
  immer((set) => ({
    ...initialState,

    setData: createSetDataImmer<IAccountField>(set),

    updateProfile(changes) {
      const state = getDemoState()
      const account = getActiveAccount(state)
      if (!account) {
        return fail('로그인이 필요합니다.')
      }

      const update = prepareProfileChanges(state, account, changes)
      if ('error' in update) {
        return update
      }

      updateDemoState((draft) => {
        Object.assign(draft.accounts[account.id], update)
        const creator = draft.creators[account.id]
        if (creator && update.name) {
          creator.name = update.name
        }
      })
      return ok
    },

    toggleAccount(id) {
      const state = getDemoState()
      const target = state.accounts[id]
      if (getActiveAccount(state)?.role !== 'admin' || target?.role === 'admin') {
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
