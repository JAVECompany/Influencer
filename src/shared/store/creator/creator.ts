import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { IApplicationInput } from '../../types/account'
import type { ActionResultType } from '../../types/actionResult'
import type { ISessionData } from '../../types/demoState'
import { fail, ok } from '../../utils/actions/actionResults'
import { getActiveAccount } from '../../utils/auth/session'
import { getApprovedCreatorAccount } from '../../utils/creator/creatorAccess'
import { prepareApplication } from '../../utils/creator/creatorApplication'
import { isAmountInRange } from '../../utils/validation/isAmountInRange'
import { getDemoState, registerDemoStore } from '../persistence/demo'
import { writeEntry } from '../utils'

export interface ICreatorField {
  creators: ISessionData['creators']
}

interface ICreatorState extends ICreatorField {
  applyForCreator: (input: IApplicationInput) => ActionResultType
  reviewCreatorApplication: (id: string, status: 'approved' | 'rejected', reason?: string) => ActionResultType
  editCreator: (price: number, bio: string) => ActionResultType
}

const initialState: ICreatorField = {
  creators: getDemoState().creators,
}

export const useCreatorStore = create<ICreatorState>()(
  immer((set) => ({
    ...initialState,

    applyForCreator(input) {
      const state = getDemoState()
      const account = getActiveAccount(state)
      const current = account && state.creators[account.id]
      if (account?.role !== 'influencer' || current?.status === 'approved' || current?.status === 'pending') {
        return fail('현재 입점 신청을 변경할 수 없습니다.')
      }

      const application = prepareApplication(state, account, input)
      if ('error' in application) {
        return application
      }

      set((draft) => {
        draft.creators = writeEntry(draft.creators, account.id, application)
      })
      return ok
    },

    reviewCreatorApplication(id, status, reason = '') {
      const state = getDemoState()
      const creator = state.creators[id]
      if (
        getActiveAccount(state)?.role !== 'admin' ||
        creator?.status !== 'pending' ||
        !['approved', 'rejected'].includes(status)
      ) {
        return fail('심사할 수 없는 신청입니다.')
      }
      if (status === 'rejected' && !reason.trim()) {
        return fail('반려 사유를 입력해 주세요.')
      }

      set((draft) => {
        draft.creators[id].status = status
        draft.creators[id].reason = reason.trim().slice(0, 180)
      })
      return ok
    },

    editCreator(price, bio) {
      const state = getDemoState()
      const a = getApprovedCreatorAccount(state)
      if (!a || !isAmountInRange(price, 1000, 100000) || !bio.trim()) {
        return fail('소개와 1,000~100,000원 사이의 월 구독료를 입력해 주세요.')
      }

      set((draft) => {
        draft.creators[a.id].price = price
        draft.creators[a.id].bio = bio.trim().slice(0, 240)
      })
      return ok
    },
  }))
)

registerDemoStore(initialState, useCreatorStore)
