import type { ITransaction, TransactionType } from '../../types/commerce'

type TransactionChangesType = Partial<
  Pick<ITransaction, 'won' | 'coins' | 'productId' | 'reward' | 'guaranteed' | 'shipping'>
>

export const createTransaction = (
  type: TransactionType,
  owner: string | null,
  customer: string,
  changes: TransactionChangesType
): ITransaction => ({ id: crypto.randomUUID(), type, owner, customer, at: Date.now(), ...changes })
