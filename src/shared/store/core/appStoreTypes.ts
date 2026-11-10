import type { StateCreator } from 'zustand'
import type { SessionData } from '../../types/demoState'
import type { AuthActions } from '../auth/createAuthSlice'
import type { AccountActions } from '../account/createAccountSlice'
import type { CreatorActions } from '../creator/createCreatorSlice'
import type { SettlementActions } from '../settlement/createSettlementSlice'
import type { ContentActions } from '../content/createContentSlice'
import type { SubscriptionActions } from '../subscription/createSubscriptionSlice'
import type { WalletActions } from '../wallet/createWalletSlice'
import type { ProductActions } from '../products/createProductSlice'
import type { RouletteActions } from '../roulette/createRouletteSlice'
import type { ChatActions } from '../chat/createChatSlice'

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

export type AppStoreSlice<Actions> = StateCreator<AppStore, [], [], Actions>
