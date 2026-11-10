import { useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { coinPacks } from '../../../shared/constants/coinPacks'
import { useWalletStore } from '../../../shared/store/wallet/wallet'
import type { PageProps } from '../../../shared/types/navigation'

export function useCoinStore({ account, notify }: Pick<PageProps, 'account' | 'notify'>) {
  const { balances, transactions: allTransactions } = useWalletStore(
    useShallow(({ balances, transactions }) => ({ balances, transactions }))
  )
  const topUpCoins = useWalletStore((state) => state.topUp)
  const [pack, setPack] = useState<(typeof coinPacks)[number] | null>(null)
  const balance = balances[account.id] ?? 0
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
