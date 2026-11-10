import type { Account } from '../types/account'

export const demoAccounts: Pick<Account, 'id' | 'role' | 'name'>[] = [
  { id: 'user123', role: 'customer', name: '나의 궤도' },
  { id: 'influencer123', role: 'influencer', name: '서린' },
  { id: 'admin123', role: 'admin', name: '밤결 운영팀' },
]
