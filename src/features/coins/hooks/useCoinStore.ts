import { useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { coinPacks } from '../../../shared/constants/coinPacks'
import { useWalletStore } from '../../../shared/store/wallet/wallet'
import type { IPageProps } from '../../../shared/types/navigation'

export function useCoinStore({ account, notify }: Pick<IPageProps, 'account' | 'notify'>) {
  const { balance, transactions: allTransactions } = useWalletStore(
    useShallow((s) => ({ balance: s.balances[account.id] ?? 0, transactions: s.transactions }))
  )
  const topUpCoins = useWalletStore((s) => s.topUpCoins)
  const [pack, setPack] = useState<(typeof coinPacks)[number] | null>(null)
  const transactions = allTransactions.filter((item) => item.customer === account.id)
  const close = () => setPack(null)
  const topUp = () => {
    if (!pack) {
      return
    }

    notify(topUpCoins(pack.coins), '코인을 충전했어요.')
    close()
  }

  return { balance, transactions, pack, setPack, close, topUp }
}
