import type { IAccount, ProfileChangesType } from '../../types/account'
import type { FailureType } from '../../types/actionResult'
import type { IAppData } from '../../types/demoState'
import { fail } from '../actions/actionResults'
import { isPasswordLengthValid } from '../auth/credentials'
import { isNameTaken } from './accountName'

export function prepareProfileChanges(
  state: IAppData,
  account: IAccount,
  changes: ProfileChangesType
): Omit<ProfileChangesType, 'current'> | FailureType {
  const update: Omit<ProfileChangesType, 'current'> = {}
  if (typeof changes.name === 'string') {
    const name = changes.name.trim()
    if (!name || name.length > 20 || isNameTaken(state, name, account.id)) {
      return fail('중복되지 않는 닉네임을 입력해 주세요.')
    }

    update.name = name
  }
  if (typeof changes.avatar === 'string') {
    if (
      changes.avatar.length > 400_000 ||
      (changes.avatar && !/^data:image\/(png|jpeg|webp);base64,/.test(changes.avatar))
    ) {
      return fail('PNG, JPG 또는 WEBP 이미지를 280 KB 이하로 선택해 주세요.')
    }

    update.avatar = changes.avatar
  }
  if (typeof changes.notifications === 'boolean') {
    update.notifications = changes.notifications
  }
  if (typeof changes.payment === 'string') {
    update.payment = changes.payment.trim().slice(0, 24)
  }
  if (changes.password) {
    if (account.password !== changes.current) {
      return fail('현재 비밀번호를 확인해 주세요.')
    }
    if (!isPasswordLengthValid(changes.password)) {
      return fail('비밀번호는 6~72자로 입력해 주세요.')
    }

    update.password = changes.password
  }
  return update
}
