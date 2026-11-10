type MediaKind = 'image' | 'video'

export type ProductFulfillment = 'digital' | 'shipping'
export type ProductReviewStatus = 'pending' | 'approved' | 'rejected'

export interface Product {
  id: string
  owner: string
  name: string
  detail: string
  cost: number
  art: number
  media?: string
  kind?: MediaKind
  fulfillment?: ProductFulfillment
  reviewStatus: ProductReviewStatus
  archived?: boolean
}

export interface ProductSubmission {
  name: string
  detail: string
  cost: number
  media: string
  fulfillment: ProductFulfillment
}

export interface ShippingAddress {
  recipient: string
  phone: string
  postalCode: string
  address: string
  addressDetail: string
}

export interface Reward {
  name: string
  chance: number
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
  shipping?: ShippingAddress & { shippedAt?: number }
}

export interface SettlementConfig {
  coinWon: number
  feeBps: number
  overrides: Record<string, Record<string, number>>
}

export type SpendType = 'product' | 'roulette' | 'roulette-guaranteed'
