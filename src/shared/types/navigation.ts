import type { Account } from './account'
import type { Notify } from './actionResult'

export type PageKey =
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

export interface PageProps {
  account: Account
  notify: Notify
  go: (id: PageKey) => void
  openCreator: (id: string) => void
  openChat: (id: string) => void
  initial: string | null
}

export type OperatorProps = Pick<PageProps, 'account' | 'notify'>
