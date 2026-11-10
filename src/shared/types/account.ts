export type RoleType = 'admin' | 'influencer' | 'customer'

type ReviewStatusType = 'pending' | 'approved' | 'rejected'

export type ApplicationMethodType = 'link' | 'direct'

export interface IAccount {
  id: string
  role: RoleType
  name: string
  password: string
  avatar: string
  notifications: boolean
  payment: string
  disabled: boolean
}

export interface ICreator {
  id: string
  name: string
  handle: string
  bio: string
  fans: number
  price: number
  art: number
  status: ReviewStatusType
  reason: string
  disabled?: boolean
  instagram?: string
  email?: string
  method?: ApplicationMethodType
  avatar?: string
  portrait?: number
  gender?: 'female' | 'male'
}

export interface ISignUpInput {
  id: string
  password: string
  name: string
  terms: boolean
  adult: boolean
  role: string
}

export interface IApplicationInput {
  method: ApplicationMethodType
  instagram: string
  name: string
  handle: string
  email: string
  bio: string
}

export type ProfileChangesType = Partial<
  Pick<IAccount, 'name' | 'avatar' | 'notifications' | 'payment' | 'password'>
> & { current?: string }
