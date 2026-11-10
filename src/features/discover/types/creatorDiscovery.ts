import type { Account, Creator } from '../../../shared/types/account'

export interface ExploreItem {
  creator: Creator
  account?: Account
  count: number
  subscribed: boolean
}

export type Angles = { yaw: number; pitch: number }

export type Box = [number, number, number, number]
