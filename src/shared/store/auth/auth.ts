import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { ISignUpInput } from '../../types/account'
import type { ActionResultType } from '../../types/actionResult'
import type { ISessionData } from '../../types/demoState'
import { ok } from '../../utils/actions/actionResults'
import { authenticate, prepareSignUp } from '../../utils/auth/credentials'
import { getDemoState, registerDemoStore, updateDemoState } from '../persistence/demo'
import { writeEntry } from '../utils'
import { createSetDataImmer } from '../zustandTypes'

export interface IAuthField {
  session: ISessionData['session']
}

interface IAuthState extends IAuthField {
  signIn: (id: string, password: string) => ActionResultType
  signOut: () => void
  signUp: (input: ISignUpInput) => ActionResultType
}

const initialState: IAuthField = {
  session: getDemoState().session,
}

export const useAuthStore = create<IAuthState>()(
  immer((set) => ({
    ...initialState,

    signIn(id, password) {
      const account = authenticate(getDemoState().accounts, id, password)
      if ('error' in account) {
        return account
      }

      createSetDataImmer<IAuthField>(set)('session', account.id)
      return ok
    },

    signOut() {
      createSetDataImmer<IAuthField>(set)('session', null)
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
  }))
)

registerDemoStore(initialState, useAuthStore)
