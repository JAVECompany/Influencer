import type { IAccount } from './account'
import type { NotifyType } from './actionResult'

export type PageKeyType =
  | 'home'
  | 'search'
  | 'chat'
  | 'store'
  | 'profile'
  | 'studio'
  | 'catalog'
  | 'earnings'
  | 'settlement'
  | 'ops'
  | 'review'
  | 'moderate'
  | 'apply'

export interface IPageProps {
  account: IAccount
  notify: NotifyType
  go: (id: PageKeyType) => void
  openCreator: (id: string) => void
  openChat: (id: string) => void
  initial: string | null
}

export type OperatorPropsType = Pick<IPageProps, 'account' | 'notify'>
