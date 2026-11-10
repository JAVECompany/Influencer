import type { SignUpInput } from '../../types/account'
import type { ActionResult } from '../../types/actionResult'
import { sameName } from '../account/accountName'
import { fail, ok } from '../core/actionResults'
import type { AppStoreSlice } from '../core/appStoreTypes'

export interface AuthActions {
  signIn: (id: string, password: string) => ActionResult
  signOut: () => void
  signUp: (input: SignUpInput) => ActionResult
}

export const createAuthSlice: AppStoreSlice<AuthActions> = (set, get) => ({
  signIn(id, password) {
    const account = get().accounts[id.trim().toLowerCase()]
    if (!account || account.password !== password) return fail('아이디와 비밀번호를 확인해 주세요.')
    if (account.disabled) return fail('이용이 정지된 계정입니다.')
    set({ session: account.id })
    return ok
  },

  signOut() {
    set({ session: null })
  },

  signUp({ id, password, name, terms, adult, role }) {
    const state = get()
    const key = id.trim().toLowerCase()
    const nickname = name.trim()
    if (!terms || !adult) return fail('약관 동의와 모의 성인 확인이 필요합니다.')
    if (
      !/^[a-z0-9_]{4,24}$/.test(key) ||
      Object.hasOwn(state.accounts, key) ||
      Object.hasOwn(state.creators, key)
    )
      return fail('사용할 수 없는 아이디입니다.')
    if (password.length < 6 || password.length > 72) return fail('비밀번호는 6~72자로 입력해 주세요.')
    if (
      !nickname ||
      nickname.length > 20 ||
      Object.values(state.accounts).some((a) => sameName(a.name, nickname)) ||
      Object.values(state.creators).some((c) => sameName(c.name, nickname))
    )
      return fail('중복되지 않는 닉네임을 입력해 주세요.')
    if (role !== 'customer' && role !== 'influencer') return fail('가입 유형을 선택해 주세요.')
    set({
      accounts: {
        ...state.accounts,
        [key]: {
          id: key,
          name: nickname,
          password,
          role,
          avatar: '',
          payment: '',
          notifications: true,
          disabled: false,
        },
      },
      session: key,
    })
    return ok
  },
})
