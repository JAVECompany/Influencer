import type { Product } from '../../../shared/types/commerce'

export type ShopOffer =
  | (Product & { type: 'owned' })
  | (Product & { type: 'product' })
  | { type: 'subscribe'; name: string }
  | { type: 'roulette' }
