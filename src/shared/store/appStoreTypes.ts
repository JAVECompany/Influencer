import type { ApplicationInput, ProfileChanges, SignUpInput } from '../types/account'
import type { ActionResult, SpendResult } from '../types/actionResult'
import type { Reward, SpendType } from '../types/commerce'
import type { PostAction, PublishInput } from '../types/content'
import type { SessionData } from '../types/demoState'

export interface AppStore extends SessionData {
  signIn: (id: string, password: string) => ActionResult
  signOut: () => void
  signUp: (input: SignUpInput) => ActionResult
  profile: (changes: ProfileChanges) => ActionResult
  apply: (input: ApplicationInput) => ActionResult
  review: (id: string, status: 'approved' | 'rejected', reason?: string) => ActionResult
  configureSettlement: (coinWon: number, feeBps: number) => ActionResult
  overrideSettlementCoins: (periodKey: string, id: string, coins: number | null) => ActionResult
  toggleAccount: (id: string) => ActionResult
  editCreator: (price: number, bio: string) => ActionResult
  publish: (input: PublishInput) => ActionResult
  recordAudience: (id: string) => void
  managePost: (id: string, action: PostAction) => ActionResult
  subscribe: (id: string) => ActionResult
  unsubscribe: (id: string) => ActionResult
  topUp: (coins: number) => ActionResult
  addProduct: (name: string, detail: string, cost: number, media?: string) => ActionResult
  removeProduct: (id: string) => ActionResult
  saveRoulette: (cost: number, rewards: Reward[], topPrizeCost?: number | null) => ActionResult
  spend: (creator: string, type: SpendType, productId?: string) => SpendResult
  sendMessage: (counterpart: string, text: string) => ActionResult
}
