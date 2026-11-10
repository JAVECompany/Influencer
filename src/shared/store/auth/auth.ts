import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { SignUpInput } from '../../types/account'
import type { ActionResult } from '../../types/actionResult'
import type { SessionData } from '../../types/demoState'
import { ok } from '../../utils/actions/actionResults'
import { authenticate, prepareSignUp } from '../../utils/auth/credentials'
import { getDemoState, registerDemoStore, updateDemoState } from '../persistence/demo'
import { writeEntry } from '../utils'
import { createSetDataImmer } from '../zustandTypes'

export interface AuthField {
  session: SessionData['session']
}

interface AuthState extends AuthField {
  signIn: (id: string, password: string) => ActionResult
  signOut: () => void
  signUp: (input: SignUpInput) => ActionResult
}

const initialState: AuthField = {
  session: getDemoState().session,
}

export const useAuthStore = create<AuthState>()(
  immer((set) => {
    const setData = createSetDataImmer<AuthField>(set)

    return {
      ...initialState,

      signIn(id, password) {
        const account = authenticate(getDemoState().accounts, id, password)
        if ('error' in account) {
          return account
        }

        setData('session', account.id)
        return ok
      },

      signOut() {
        setData('session', null)
      },

      signUp(input) {
        const account = prepareSignUp(getDemoState(), input)
        if ('error' in account) {
          return account
        }

        updateDemoState((draft) => {
          draft.accounts = writeEntry(draft.accounts, account.id, account)
          draft.session = account.id
        })
        return ok
      },
    }
  })
)

registerDemoStore(initialState, useAuthStore)
