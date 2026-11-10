import type { SignUpInput } from '../../types/account'
import type { ActionResult } from '../../types/actionResult'
import { ok } from '../../utils/actions/actionResults'
import { authenticate, prepareSignUp } from '../../utils/auth/credentials'
import type { AppStoreSlice } from '../types'
import { writeEntry } from '../utils'

export interface AuthActions {
  signIn: (id: string, password: string) => ActionResult
  signOut: () => void
  signUp: (input: SignUpInput) => ActionResult
}

export const createAuthSlice: AppStoreSlice<AuthActions> = (set, get) => ({
  signIn(id, password) {
    const account = authenticate(get().accounts, id, password)
    if ('error' in account) return account
    set((draft) => {
      draft.session = account.id
    })
    return ok
  },

  signOut() {
    set((draft) => {
      draft.session = null
    })
  },

  signUp(input) {
    const account = prepareSignUp(get(), input)
    if ('error' in account) return account
    set((draft) => {
      draft.accounts = writeEntry(draft.accounts, account.id, account)
      draft.session = account.id
    })
    return ok
  },
})
