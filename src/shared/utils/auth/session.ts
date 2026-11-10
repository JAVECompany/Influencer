import type { SessionData } from '../../types/demoState'

export const actor = (state: Pick<SessionData, 'accounts' | 'session'>) => {
  const account = state.session ? state.accounts[state.session] : undefined
  return account?.disabled ? undefined : account
}
