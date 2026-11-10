import type { Account, ApplicationInput, Creator } from '../../types/account'
import type { Failure } from '../../types/actionResult'
import type { AppData } from '../../types/demoState'
import { isNameTaken } from '../account/accountName'
import { fail } from '../actions/actionResults'

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

export function prepareApplication(
  state: AppData,
  account: Account,
  { method, instagram, name, handle, email, bio }: ApplicationInput
): Creator | Failure {
  if (method === 'link' && !validInstagram(instagram))
    return fail('https://www.instagram.com/사용자이름 형식으로 입력해 주세요.')
  const normalized =
    method === 'link' ? new URL(instagram).pathname.split('/')[1].toLowerCase() : handle.trim().toLowerCase()
  if (
    !/^[a-z0-9_.]{1,30}$/.test(normalized) ||
    Object.values(state.creators).some((c) => c.id !== account.id && c.handle === normalized)
  ) {
    return fail('사용 가능한 Instagram 핸들을 입력해 주세요.')
  }
  if (method === 'direct' && (!name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !bio.trim())) {
    return fail('표시 이름, 연락 이메일 및 소개를 입력해 주세요.')
  }
  const display = method === 'link' ? account.name : name.trim()
  if (display.length > 20 || isNameTaken(state, display, account.id)) {
    return fail('중복되지 않는 표시 이름을 입력해 주세요.')
  }
  return {
    id: account.id,
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
  }
}
