import type { ISessionData } from '../../types/demoState'

export const isAccountDisabled = (state: Pick<ISessionData, 'accounts' | 'creators'>, id: string) =>
  state.accounts[id]?.disabled ?? state.creators[id]?.disabled ?? false
