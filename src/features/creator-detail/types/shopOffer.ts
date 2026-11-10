import type { IProduct } from '../../../shared/types/commerce'

export type ShopOfferType =
  | (IProduct & { type: 'owned' })
  | (IProduct & { type: 'product' })
  | { type: 'subscribe'; name: string }
  | { type: 'roulette' }
