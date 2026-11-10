import { useState } from 'react'
import { coinPacks } from '../../../shared/constants/coinPacks'
import { useAppStore } from '../../../shared/store/core/useAppStore'
import type { PageProps } from '../../../shared/types/navigation'

export function useCoinStore({ account, notify }: Pick<PageProps, 'account' | 'notify'>) {
  const state = useAppStore()
  const [pack, setPack] = useState<(typeof coinPacks)[number] | null>(null)
  const balance = state.balances[account.id] ?? 0
  const transactions = state.transactions.filter((item) => item.customer === account.id)
  const close = () => setPack(null)
  const topUp = () => {
    if (!pack) return
    notify(state.topUp(pack.coins), '코인을 충전했어요.')
    close()
  }

  return { balance, transactions, pack, setPack, close, topUp }
}
