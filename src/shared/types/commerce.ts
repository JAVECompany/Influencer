type MediaKind = 'image' | 'video'

export interface Product {
  id: string
  owner: string
  name: string
  detail: string
  cost: number
  art: number
  media?: string
  kind?: MediaKind
  archived?: boolean
}

export interface Reward {
  name: string
  chance: number
  displayChance?: number
}

export interface Roulette {
  cost: number
  topPrizeCost?: number | null
  rewards: Reward[]
}

export type TransactionType = 'subscribe' | 'unsubscribe' | 'topup' | 'product' | 'roulette'

export interface Transaction {
  id: string
  type: TransactionType
  owner: string | null
  customer: string
  at: number
  won?: number
  coins?: number
  productId?: string
  reward?: string
  guaranteed?: boolean
}

export interface SettlementConfig {
  coinWon: number
  feeBps: number
  overrides: Record<string, Record<string, number>>
}

export type SpendType = 'product' | 'roulette' | 'roulette-guaranteed'
