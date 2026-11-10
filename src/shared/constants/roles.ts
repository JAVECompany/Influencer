import type { RoleType } from '../types/account'

export const roles: Record<RoleType, string> = {
  admin: '관리자',
  influencer: '인플루언서',
  customer: '고객',
}
