import type { IAccount, ICreator } from '../../../shared/types/account'

export interface IExploreItem {
  creator: ICreator
  account?: IAccount
  count: number
  subscribed: boolean
}

export type AnglesType = { yaw: number; pitch: number }

export type BoxType = [number, number, number, number]
