import type { SessionData } from '../../types/demoState'
import { isAccountDisabled } from '../account/accountStatus'
import { actor } from '../auth/session'

export const isPublic = (state: SessionData, id: string) =>
  state.creators[id]?.status === 'approved' && !isAccountDisabled(state, id)

export const getApprovedCreatorAccount = (state: SessionData) => {
  const account = actor(state)
  return account?.role === 'influencer' && isPublic(state, account.id) ? account : null
}
