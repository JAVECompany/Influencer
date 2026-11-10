import type { ApplicationInput } from '../../types/account'
import type { ActionResult } from '../../types/actionResult'
import { sameName } from '../account/accountName'
import { actor } from '../auth/authSelectors'
import { fail, ok } from '../core/actionResults'
import type { AppStoreSlice } from '../core/appStoreTypes'
import { isAmountInRange } from '../core/isAmountInRange'
import { getApprovedCreatorAccount } from './creatorSelectors'

const validInstagram = (value: string) => {
  try {
    const url = new URL(value)
    return (
      url.protocol === 'https:' &&
      ['www.instagram.com', 'instagram.com'].includes(url.hostname) &&
      /^\/[a-z0-9_.]+\/?$/i.test(url.pathname) &&
      !['p', 'reels', 'reel', 'stories', 'accounts', 'explore', 'direct'].includes(
        url.pathname.split('/')[1].toLowerCase()
      )
    )
  } catch {
    return false
  }
}

export interface CreatorActions {
  apply: (input: ApplicationInput) => ActionResult
  review: (id: string, status: 'approved' | 'rejected', reason?: string) => ActionResult
  editCreator: (price: number, bio: string) => ActionResult
}

export const createCreatorSlice: AppStoreSlice<CreatorActions> = (set, get) => ({
  apply({ method, instagram, name, handle, email, bio }) {
    const state = get()
    const a = actor(state)
    const current = a && state.creators[a.id]
    if (a?.role !== 'influencer' || current?.status === 'approved' || current?.status === 'pending')
      return fail('현재 입점 신청을 변경할 수 없습니다.')
    if (method === 'link' && !validInstagram(instagram))
      return fail('https://www.instagram.com/사용자이름 형식으로 입력해 주세요.')
    const normalized =
      method === 'link'
        ? new URL(instagram).pathname.split('/')[1].toLowerCase()
        : handle.trim().toLowerCase()
    if (
      !/^[a-z0-9_.]{1,30}$/.test(normalized) ||
      Object.values(state.creators).some((c) => c.id !== a.id && c.handle === normalized)
    ) {
      return fail('사용 가능한 Instagram 핸들을 입력해 주세요.')
    }
    if (method === 'direct' && (!name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !bio.trim())) {
      return fail('표시 이름, 연락 이메일 및 소개를 입력해 주세요.')
    }
    const display = method === 'link' ? a.name : name.trim()
    if (
      display.length > 20 ||
      Object.values(state.creators).some((c) => c.id !== a.id && sameName(c.name, display)) ||
      Object.values(state.accounts).some((user) => user.id !== a.id && sameName(user.name, display))
    ) {
      return fail('중복되지 않는 표시 이름을 입력해 주세요.')
    }
    set({
      creators: {
        ...state.creators,
        [a.id]: {
          id: a.id,
          name: display,
          handle: normalized,
          bio: method === 'direct' ? bio.trim().slice(0, 240) : '밤결의 새로운 크리에이터.',
          email: method === 'direct' ? email.trim() : '',
          instagram: method === 'link' ? instagram.trim() : '',
          method,
          price: 5900,
          fans: 0,
          art: Object.keys(state.creators).length % 9,
          status: 'pending',
          reason: '',
        },
      },
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
    set({
      creators: { ...state.creators, [id]: { ...creator, status, reason: reason.trim().slice(0, 180) } },
    })
    return ok
  },

  editCreator(price, bio) {
    const state = get()
    const a = getApprovedCreatorAccount(state)
    if (!a || !isAmountInRange(price, 1000, 100000) || !bio.trim())
      return fail('소개와 1,000~100,000원 사이의 월 구독료를 입력해 주세요.')
    set({
      creators: {
        ...state.creators,
        [a.id]: { ...state.creators[a.id], price, bio: bio.trim().slice(0, 240) },
      },
    })
    return ok
  },
})
