import type { IAccount, ISignUpInput } from '../../types/account'
import type { FailureType } from '../../types/actionResult'
import type { IAppData } from '../../types/demoState'
import { isNameTaken } from '../account/accountName'
import { fail } from '../actions/actionResults'

export const isPasswordLengthValid = (password: string) => password.length >= 6 && password.length <= 72

export function authenticate(
  accounts: IAppData['accounts'],
  id: string,
  password: string
): IAccount | FailureType {
  const account = accounts[id.trim().toLowerCase()]
  if (!account || account.password !== password) {
    return fail('아이디와 비밀번호를 확인해 주세요.')
  }
  if (account.disabled) {
    return fail('이용이 정지된 계정입니다.')
  }

  return account
}

export function prepareSignUp(
  state: IAppData,
  { id, password, name, terms, adult, role }: ISignUpInput
): IAccount | FailureType {
  const key = id.trim().toLowerCase()
  const nickname = name.trim()
  if (!terms || !adult) {
    return fail('약관 동의와 모의 성인 확인이 필요합니다.')
  }
  if (
    !/^[a-z0-9_]{4,24}$/.test(key) ||
    Object.hasOwn(state.accounts, key) ||
    Object.hasOwn(state.creators, key)
  ) {
    return fail('사용할 수 없는 아이디입니다.')
  }
  if (!isPasswordLengthValid(password)) {
    return fail('비밀번호는 6~72자로 입력해 주세요.')
  }
  if (!nickname || nickname.length > 20 || isNameTaken(state, nickname)) {
    return fail('중복되지 않는 닉네임을 입력해 주세요.')
  }
  if (role !== 'customer' && role !== 'influencer') {
    return fail('가입 유형을 선택해 주세요.')
  }

  return {
    id: key,
    name: nickname,
    password,
    role,
    avatar: '',
    payment: '',
    notifications: true,
    disabled: false,
  }
}
