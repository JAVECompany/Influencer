import type { ProfileChanges } from '../../types/account'
import type { ActionResult } from '../../types/actionResult'
import { prepareProfileChanges } from '../../utils/account/profileChanges'
import { actor } from '../../utils/auth/session'
import { fail, ok } from '../../utils/actions/actionResults'
import type { AppStoreSlice } from '../types'

export interface AccountActions {
  profile: (changes: ProfileChanges) => ActionResult
  toggleAccount: (id: string) => ActionResult
}

export const createAccountSlice: AppStoreSlice<AccountActions> = (set, get) => ({
  profile(changes) {
    const state = get()
    const a = actor(state)
    if (!a) {
      return fail('로그인이 필요합니다.')
    }

    const update = prepareProfileChanges(state, a, changes)
    if ('error' in update) {
      return update
    }

    set((draft) => {
      Object.assign(draft.accounts[a.id], update)
      const creator = draft.creators[a.id]
      if (creator && update.name) {
        creator.name = update.name
      }
    })
    return ok
  },

  toggleAccount(id) {
    const state = get()
    const target = state.accounts[id]
    if (actor(state)?.role !== 'admin' || target?.role === 'admin')
      return fail('계정 상태를 변경할 수 없습니다.')
    if (target) {
      set((draft) => {
        draft.accounts[id].disabled = !target.disabled
      })
      return ok
    }

    const creator = state.creators[id]
    if (creator?.status !== 'approved') return fail('계정 상태를 변경할 수 없습니다.')
    set((draft) => {
      draft.creators[id].disabled = !creator.disabled
    })
    return ok
  },
})
