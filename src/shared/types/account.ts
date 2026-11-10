export type Role = 'admin' | 'influencer' | 'customer'

type ReviewStatus = 'pending' | 'approved' | 'rejected'

export type ApplicationMethod = 'link' | 'direct'

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
  disabled?: boolean
  instagram?: string
  email?: string
  method?: ApplicationMethod
  avatar?: string
  portrait?: number
  gender?: 'female' | 'male'
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

export type ProfileChanges = Partial<
  Pick<Account, 'name' | 'avatar' | 'notifications' | 'payment' | 'password'>
> & { current?: string }
