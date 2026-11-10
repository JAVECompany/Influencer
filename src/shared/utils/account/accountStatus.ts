import type { SessionData } from '../../types/demoState'

export const isAccountDisabled = (state: Pick<SessionData, 'accounts' | 'creators'>, id: string) =>
  state.accounts[id]?.disabled ?? state.creators[id]?.disabled ?? false
