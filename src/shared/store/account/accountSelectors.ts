import type { SessionData } from '../../types/demoState'

export const isAccountDisabled = (state: SessionData, id: string) =>
  state.accounts[id]?.disabled ?? state.creators[id]?.disabled ?? false
