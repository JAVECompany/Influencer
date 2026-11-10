import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { initialData } from '../data/initialData'
import { createAuthSlice } from './auth/auth'
import { createAccountSlice } from './account/account'
import { createCreatorSlice } from './creator/creator'
import { createSettlementSlice } from './settlement/settlement'
import { createContentSlice } from './content/content'
import { createSubscriptionSlice } from './subscription/subscription'
import { createWalletSlice } from './wallet/wallet'
import { createProductSlice } from './products/product'
import { createRouletteSlice } from './roulette/roulette'
import { createChatSlice } from './chat/chat'
import { demoStoreOptions } from './persistence/options'
import type { AppStore } from './types'

export const useAppStore = create<AppStore>()(
  persist(
    immer((...args) => ({
      ...initialData,
      session: null,
      ...createAuthSlice(...args),
      ...createAccountSlice(...args),
      ...createCreatorSlice(...args),
      ...createSettlementSlice(...args),
      ...createContentSlice(...args),
      ...createSubscriptionSlice(...args),
      ...createWalletSlice(...args),
      ...createProductSlice(...args),
      ...createRouletteSlice(...args),
      ...createChatSlice(...args),
    })),
    demoStoreOptions
  )
)
