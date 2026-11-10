import type { SessionData } from '../../types/demoState'

export const actor = (state: SessionData) => {
  const account = state.session ? state.accounts[state.session] : undefined
  return account?.disabled ? undefined : account
}
