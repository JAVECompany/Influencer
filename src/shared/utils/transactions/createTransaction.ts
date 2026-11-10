import type { Transaction, TransactionType } from '../../types/commerce'

type TransactionChanges = Partial<
  Pick<Transaction, 'won' | 'coins' | 'productId' | 'reward' | 'guaranteed' | 'shipping'>
>

export const createTransaction = (
  type: TransactionType,
  owner: string | null,
  customer: string,
  changes: TransactionChanges
): Transaction => ({ id: crypto.randomUUID(), type, owner, customer, at: Date.now(), ...changes })
