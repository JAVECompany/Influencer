import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { ActionResultType } from '../../types/actionResult'
import type { ISessionData } from '../../types/demoState'
import { fail, ok } from '../../utils/actions/actionResults'
import { getActiveAccount } from '../../utils/auth/session'
import { hasSubscription } from '../../utils/subscription/subscriptionAccess'
import { getDemoState, registerDemoStore } from '../persistence/demo'

export interface IChatField {
  messages: ISessionData['messages']
}

interface IChatState extends IChatField {
  sendMessage: (counterpart: string, text: string) => ActionResultType
}

const initialState: IChatField = {
  messages: getDemoState().messages,
}

export const useChatStore = create<IChatState>()(
  immer((set) => ({
    ...initialState,

    sendMessage(counterpart, text) {
      const state = getDemoState()
      const a = getActiveAccount(state)
      if (!a || !['customer', 'influencer'].includes(a.role) || !text.trim()) {
        return fail('메시지를 보낼 수 없습니다.')
      }

      const customer = a.role === 'customer' ? a.id : counterpart
      const creator = a.role === 'influencer' ? a.id : counterpart
      if (!hasSubscription(state, customer, creator)) {
        return fail(
          a.role === 'influencer'
            ? '현재 내 콘텐츠를 구독 중인 고객에게만 메시지를 보낼 수 있어요.'
            : '구독 중인 크리에이터에게만 메시지를 보낼 수 있어요.'
        )
      }

      set((draft) => {
        draft.messages.push({
          id: crypto.randomUUID(),
          customer,
          creator,
          from: a.id,
          text: text.trim().slice(0, 500),
          at: Date.now(),
        })
      })
      return ok
    },
  }))
)

registerDemoStore(initialState, useChatStore)
