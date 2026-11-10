import type { StateCreator } from 'zustand'
import type { SessionData } from '../types/demoState'
import type { AuthActions } from './auth/auth'
import type { AccountActions } from './account/account'
import type { CreatorActions } from './creator/creator'
import type { SettlementActions } from './settlement/settlement'
import type { ContentActions } from './content/content'
import type { SubscriptionActions } from './subscription/subscription'
import type { WalletActions } from './wallet/wallet'
import type { ProductActions } from './products/product'
import type { RouletteActions } from './roulette/roulette'
import type { ChatActions } from './chat/chat'

export type AppStore = SessionData &
  AuthActions &
  AccountActions &
  CreatorActions &
  SettlementActions &
  ContentActions &
  SubscriptionActions &
  WalletActions &
  ProductActions &
  RouletteActions &
  ChatActions

export type AppStoreSlice<Actions> = StateCreator<
  AppStore,
  [['zustand/persist', unknown], ['zustand/immer', never]],
  [],
  Actions
>
