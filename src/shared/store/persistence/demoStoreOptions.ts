import type { PersistOptions } from 'zustand/middleware'
import type { SessionData } from '../../types/demoState'
import type { AppStore } from '../core/appStoreTypes'
import { migrateDemoState } from './migrateDemoState'

export const demoStoreOptions = {
  name: 'bamgyeol-demo-v1',
  version: 2,
  migrate: migrateDemoState,
  partialize: ({
    accounts,
    creators,
    posts,
    subscriptions,
    balances,
    transactions,
    products,
    roulettes,
    messages,
    session,
    settlement,
  }) => ({
    accounts,
    creators,
    posts,
    subscriptions,
    balances,
    transactions,
    products,
    roulettes,
    messages,
    session,
    settlement,
  }),
} satisfies PersistOptions<AppStore, SessionData>
