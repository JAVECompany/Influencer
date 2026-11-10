import type { ProfileChanges } from '../../types/account'
import type { ActionResult } from '../../types/actionResult'
import { actor } from '../auth/authSelectors'
import { fail, ok } from '../core/actionResults'
import type { AppStoreSlice } from '../core/appStoreTypes'
import { sameName } from './accountName'

export interface AccountActions {
  profile: (changes: ProfileChanges) => ActionResult
  toggleAccount: (id: string) => ActionResult
}

export const createAccountSlice: AppStoreSlice<AccountActions> = (set, get) => ({
  profile(changes) {
    const state = get()
    const a = actor(state)
    if (!a) return fail('로그인이 필요합니다.')
    const update: ProfileChanges = {}
    if (typeof changes.name === 'string') {
      const name = changes.name.trim()
      const taken =
        Object.values(state.accounts).some((item) => item.id !== a.id && sameName(item.name, name)) ||
        Object.values(state.creators).some((item) => item.id !== a.id && sameName(item.name, name))
      if (!name || name.length > 20 || taken) return fail('중복되지 않는 닉네임을 입력해 주세요.')
      update.name = name
    }
    if (typeof changes.avatar === 'string') {
      if (
        changes.avatar.length > 400_000 ||
        (changes.avatar && !/^data:image\/(png|jpeg|webp);base64,/.test(changes.avatar))
      ) {
        return fail('PNG, JPG 또는 WEBP 이미지를 280 KB 이하로 선택해 주세요.')
      }
      update.avatar = changes.avatar
    }
    if (typeof changes.notifications === 'boolean') update.notifications = changes.notifications
    if (typeof changes.payment === 'string') update.payment = changes.payment.trim().slice(0, 24)
    if (changes.password) {
      if (a.password !== changes.current) return fail('현재 비밀번호를 확인해 주세요.')
      if (changes.password.length < 6 || changes.password.length > 72)
        return fail('비밀번호는 6~72자로 입력해 주세요.')
      update.password = changes.password
    }
    const creator = state.creators[a.id]
    set({
      accounts: { ...state.accounts, [a.id]: { ...a, ...update } },
      creators:
        creator && update.name
          ? { ...state.creators, [a.id]: { ...creator, name: update.name } }
          : state.creators,
    })
    return ok
  },

  toggleAccount(id) {
    const state = get()
    const target = state.accounts[id]
    if (actor(state)?.role !== 'admin' || target?.role === 'admin')
      return fail('계정 상태를 변경할 수 없습니다.')
    if (target) {
      set({ accounts: { ...state.accounts, [id]: { ...target, disabled: !target.disabled } } })
      return ok
    }

    const creator = state.creators[id]
    if (creator?.status !== 'approved') return fail('계정 상태를 변경할 수 없습니다.')
    set({ creators: { ...state.creators, [id]: { ...creator, disabled: !creator.disabled } } })
    return ok
  },
})
