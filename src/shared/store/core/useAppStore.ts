import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { initialData } from '../../data/initialData'
import { createAuthSlice } from '../auth/createAuthSlice'
import { createAccountSlice } from '../account/createAccountSlice'
import { createCreatorSlice } from '../creator/createCreatorSlice'
import { createSettlementSlice } from '../settlement/createSettlementSlice'
import { createContentSlice } from '../content/createContentSlice'
import { createSubscriptionSlice } from '../subscription/createSubscriptionSlice'
import { createWalletSlice } from '../wallet/createWalletSlice'
import { createProductSlice } from '../products/createProductSlice'
import { createRouletteSlice } from '../roulette/createRouletteSlice'
import { createChatSlice } from '../chat/createChatSlice'
import { demoStoreOptions } from '../persistence/demoStoreOptions'
import type { AppStore } from './appStoreTypes'

export const useAppStore = create<AppStore>()(
  persist(
    (...args) => ({
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
    }),
    demoStoreOptions
  )
)
