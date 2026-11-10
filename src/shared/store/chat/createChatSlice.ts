import type { ActionResult } from '../../types/actionResult'
import { actor } from '../auth/authSelectors'
import { fail, ok } from '../core/actionResults'
import type { AppStoreSlice } from '../core/appStoreTypes'
import { hasSubscription } from '../subscription/subscriptionSelectors'

export interface ChatActions {
  sendMessage: (counterpart: string, text: string) => ActionResult
}

export const createChatSlice: AppStoreSlice<ChatActions> = (set, get) => ({
  sendMessage(counterpart, text) {
    const state = get()
    const a = actor(state)
    if (!a || !['customer', 'influencer'].includes(a.role) || !text.trim())
      return fail('메시지를 보낼 수 없습니다.')
    const customer = a.role === 'customer' ? a.id : counterpart
    const creator = a.role === 'influencer' ? a.id : counterpart
    if (!hasSubscription(state, customer, creator))
      return fail(
        a.role === 'influencer'
          ? '현재 내 콘텐츠를 구독 중인 고객에게만 메시지를 보낼 수 있어요.'
          : '구독 중인 크리에이터에게만 메시지를 보낼 수 있어요.'
      )
    set({
      messages: [
        ...state.messages,
        {
          id: crypto.randomUUID(),
          customer,
          creator,
          from: a.id,
          text: text.trim().slice(0, 500),
          at: Date.now(),
        },
      ],
    })
    return ok
  },
})
