import type { ISessionData } from '../../types/demoState'
import { isAccountDisabled } from '../account/accountStatus'
import { getActiveAccount } from '../auth/session'

export const isPublic = (state: Pick<ISessionData, 'accounts' | 'creators'>, id: string) =>
  state.creators[id]?.status === 'approved' && !isAccountDisabled(state, id)

export const getApprovedCreatorAccount = (state: Pick<ISessionData, 'accounts' | 'creators' | 'session'>) => {
  const account = getActiveAccount(state)
  return account?.role === 'influencer' && isPublic(state, account.id) ? account : null
}
