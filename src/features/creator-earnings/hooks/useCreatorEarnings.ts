import { useState } from 'react'
import { useAppStore } from '../../../shared/store/core/useAppStore'

export function useCreatorEarnings(creatorId: string) {
  const state = useAppStore()
  const items = state.transactions.filter((t) => t.owner === creatorId)
  const month = new Intl.DateTimeFormat('sv-SE', {
    year: 'numeric',
    month: '2-digit',
    timeZone: 'Asia/Seoul',
  })
  const [period, setPeriod] = useState(month.format(Date.now()))
  const filtered = items.filter((t) => !period || month.format(t.at) === period)
  const revenue = filtered.filter((t) => t.type === 'subscribe').reduce((sum, t) => sum + (t.won ?? 0), 0)
  const used = filtered
    .filter((t) => ['product', 'roulette'].includes(t.type))
    .reduce((sum, t) => sum + (t.coins ?? 0), 0)

  return { period, setPeriod, filtered, revenue, used }
}
