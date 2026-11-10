import type { Account, Creator } from './account'
import type { Message } from './chat'
import type { Product, Roulette, SettlementConfig, Transaction } from './commerce'
import type { Content } from './content'

export interface AppData {
  accounts: Record<string, Account>
  creators: Record<string, Creator>
  posts: Content[]
  subscriptions: Record<string, string[]>
  balances: Record<string, number>
  transactions: Transaction[]
  settlement: SettlementConfig
  products: Product[]
  roulettes: Record<string, Roulette>
  messages: Message[]
}

export interface SessionData extends AppData {
  session: string | null
}
