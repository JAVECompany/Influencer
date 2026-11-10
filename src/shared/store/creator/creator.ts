import type { ApplicationInput } from '../../types/account'
import type { ActionResult } from '../../types/actionResult'
import { prepareApplication } from '../../utils/creator/creatorApplication'
import { actor } from '../../utils/auth/session'
import { fail, ok } from '../../utils/actions/actionResults'
import type { AppStoreSlice } from '../types'
import { writeEntry } from '../utils'
import { isAmountInRange } from '../../utils/validation/isAmountInRange'
import { getApprovedCreatorAccount } from '../../utils/creator/creatorAccess'

export interface CreatorActions {
  apply: (input: ApplicationInput) => ActionResult
  review: (id: string, status: 'approved' | 'rejected', reason?: string) => ActionResult
  editCreator: (price: number, bio: string) => ActionResult
}

export const createCreatorSlice: AppStoreSlice<CreatorActions> = (set, get) => ({
  apply(input) {
    const state = get()
    const account = actor(state)
    const current = account && state.creators[account.id]
    if (account?.role !== 'influencer' || current?.status === 'approved' || current?.status === 'pending')
      return fail('현재 입점 신청을 변경할 수 없습니다.')
    const application = prepareApplication(state, account, input)
    if ('error' in application) return application
    set((draft) => {
      draft.creators = writeEntry(draft.creators, account.id, application)
    })
    return ok
  },

  review(id, status, reason = '') {
    const state = get()
    const creator = state.creators[id]
    if (
      actor(state)?.role !== 'admin' ||
      creator?.status !== 'pending' ||
      !['approved', 'rejected'].includes(status)
    )
      return fail('심사할 수 없는 신청입니다.')
    if (status === 'rejected' && !reason.trim()) return fail('반려 사유를 입력해 주세요.')
    set((draft) => {
      draft.creators[id].status = status
      draft.creators[id].reason = reason.trim().slice(0, 180)
    })
    return ok
  },

  editCreator(price, bio) {
    const state = get()
    const a = getApprovedCreatorAccount(state)
    if (!a || !isAmountInRange(price, 1000, 100000) || !bio.trim())
      return fail('소개와 1,000~100,000원 사이의 월 구독료를 입력해 주세요.')
    set((draft) => {
      draft.creators[a.id].price = price
      draft.creators[a.id].bio = bio.trim().slice(0, 240)
    })
    return ok
  },
})
