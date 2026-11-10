type MediaKindType = 'image' | 'video'

export type ProductFulfillmentType = 'digital' | 'shipping'
export type ProductReviewStatusType = 'pending' | 'approved' | 'rejected'

export interface IProduct {
  id: string
  owner: string
  name: string
  detail: string
  cost: number
  art: number
  media?: string
  kind?: MediaKindType
  fulfillment?: ProductFulfillmentType
  reviewStatus: ProductReviewStatusType
  archived?: boolean
}

export interface IProductSubmission {
  name: string
  detail: string
  cost: number
  media: string
  fulfillment: ProductFulfillmentType
}

export interface IShippingAddress {
  recipient: string
  phone: string
  postalCode: string
  address: string
  addressDetail: string
}

export interface IReward {
  name: string
  chance: number
}

export interface IRoulette {
  cost: number
  topPrizeCost?: number | null
  rewards: IReward[]
}

export type TransactionType = 'subscribe' | 'unsubscribe' | 'topup' | 'product' | 'roulette'

export interface ITransaction {
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
  shipping?: IShippingAddress & { shippedAt?: number }
}

export interface ISettlementConfig {
  coinWon: number
  feeBps: number
  overrides: Record<string, Record<string, number>>
}

export type SpendType = 'product' | 'roulette' | 'roulette-guaranteed'
