export type Role = 'admin' | 'influencer' | 'customer'
export type ContentKind = 'post' | 'story' | 'live'
export type ReviewStatus = 'pending' | 'approved' | 'rejected'
export type ApplicationMethod = 'link' | 'direct'
export type MediaKind = 'image' | 'video'

export interface Account {
  id: string
  role: Role
  name: string
  password: string
  avatar: string
  notifications: boolean
  payment: string
  disabled: boolean
}

export interface Creator {
  id: string
  name: string
  handle: string
  bio: string
  fans: number
  price: number
  art: number
  status: ReviewStatus
  reason: string
  instagram?: string
  email?: string
  method?: ApplicationMethod
  avatar?: string
  portrait?: number
  gender?: 'female' | 'male'
}

export interface Content {
  id: string
  owner: string
  kind: ContentKind
  title: string
  body: string
  art: number
  at: number
  media?: string
  hidden: boolean
  likes: string[]
  reports: string[]
  viewers?: string[]
}

export interface Product {
  id: string
  owner: string
  name: string
  detail: string
  cost: number
  art: number
  media?: string
  kind?: MediaKind
  archived?: boolean
}

export interface Reward {
  name: string
  chance: number
  displayChance?: number
}

export interface Roulette {
  cost: number
  topPrizeCost?: number | null
  rewards: Reward[]
}

export type TransactionType = 'subscribe' | 'unsubscribe' | 'topup' | 'product' | 'roulette'

export interface Transaction {
  id: string
  type: TransactionType
  owner: string | null
  customer: string
  at: number
  won?: number
  coins?: number
  productId?: string
  reward?: string
  guaranteed?: boolean
}

export interface Message {
  id: string
  customer: string
  creator: string
  from: string
  text: string
  at: number
}

export interface SettlementConfig {
  coinWon: number
  feeBps: number
  overrides: Record<string, Record<string, number>>
}

export interface AppData {
  accounts: Record<string, Account>
  creators: Record<string, Creator>
  posts: Content[]
  subscriptions: Record<string, string[]>
  balances: Record<string, number>
  transactions: Transaction[]
  settlement: SettlementConfig
  products: Product[]
  roulettes: Record<string, Roulette>
  messages: Message[]
}

export interface SessionData extends AppData {
  session: string | null
}

export interface SignUpInput {
  id: string
  password: string
  name: string
  terms: boolean
  adult: boolean
  role: string
}

export interface ApplicationInput {
  method: ApplicationMethod
  instagram: string
  name: string
  handle: string
  email: string
  bio: string
}

export type ProfileChanges = Partial<Pick<Account, 'name' | 'avatar' | 'notifications' | 'payment' | 'password'>> & { current?: string }
export type PublishInput = Pick<Content, 'title' | 'body' | 'kind' | 'media'>
export type SpendType = 'product' | 'roulette' | 'roulette-guaranteed'
export type PostAction = 'remove' | 'hide' | 'like' | 'report'

export type Failure = { error: string }
export type Success = { success: true; error?: never }
export type ActionResult = Success | Failure
export type SpendResult = (Success & { reward: string; rewardIndex?: number }) | (Failure & { reward?: never; rewardIndex?: never })

export type Notify = (result: { error?: string }, success?: string) => void
export type PageKey = 'home' | 'search' | 'chat' | 'store' | 'profile' | 'studio' | 'catalog' | 'earnings' | 'settlement' | 'ops' | 'review' | 'moderate' | 'apply'

export interface PageProps {
  account: Account
  notify: Notify
  go: (id: PageKey) => void
  openCreator: (id: string) => void
  openChat: (id: string) => void
  initial: string | null
}
