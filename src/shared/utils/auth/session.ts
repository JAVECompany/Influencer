import type { ISessionData } from '../../types/demoState'

export const getActiveAccount = (state: Pick<ISessionData, 'accounts' | 'session'>) => {
  const account = state.session ? state.accounts[state.session] : undefined
  return account?.disabled ? undefined : account
}
