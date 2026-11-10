import type { SessionData } from '../../types/demoState'
import { isAccountDisabled } from '../account/accountStatus'
import { actor } from '../auth/session'

export const isPublic = (state: Pick<SessionData, 'accounts' | 'creators'>, id: string) =>
  state.creators[id]?.status === 'approved' && !isAccountDisabled(state, id)

export const getApprovedCreatorAccount = (state: Pick<SessionData, 'accounts' | 'creators' | 'session'>) => {
  const account = actor(state)
  return account?.role === 'influencer' && isPublic(state, account.id) ? account : null
}
