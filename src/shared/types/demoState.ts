import type { IAccount, ICreator } from './account'
import type { IMessage } from './chat'
import type { IProduct, IRoulette, ISettlementConfig, ITransaction } from './commerce'
import type { IContent } from './content'

export interface IAppData {
  accounts: Record<string, IAccount>
  creators: Record<string, ICreator>
  posts: IContent[]
  subscriptions: Record<string, string[]>
  balances: Record<string, number>
  transactions: ITransaction[]
  settlement: ISettlementConfig
  products: IProduct[]
  roulettes: Record<string, IRoulette>
  messages: IMessage[]
}

export interface ISessionData extends IAppData {
  session: string | null
}
