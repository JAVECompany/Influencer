import { useState } from 'react'
import type { Roulette } from '../../../shared/types/commerce'
import { displayShare, rouletteConfigurationError } from '../../../shared/utils/roulette'
import type { DraftReward } from '../types/rouletteDraft'

const emptyReward = (): DraftReward => ({ name: '', chance: '', displayChance: '', manual: false })

export function useRouletteDraft(roulette?: Roulette) {
  const [cost, setCost] = useState(roulette?.cost ?? '')
  const [topPrice, setTopPrice] = useState(roulette?.topPrizeCost ?? '')
  const [rows, setRows] = useState(
    () =>
      roulette?.rewards.map((reward) => ({
        name: reward.name,
        chance: String(reward.chance),
        displayChance: String(displayShare(reward)),
        manual: reward.chance !== displayShare(reward),
      })) ?? [emptyReward(), emptyReward()]
  )
  const [preview, setPreview] = useState<Roulette | null>(null)
  const [error, setError] = useState('')
  const sum = (key: 'chance' | 'displayChance') => rows.reduce((total, row) => total + Number(row[key]), 0)
  const draft = (): Roulette => ({
    cost: Number(cost),
    topPrizeCost: topPrice === '' ? null : Number(topPrice),
    rewards: rows.map((row) => ({
      name: row.name.trim(),
      chance: Number(row.chance),
      displayChance: Number(row.displayChance),
    })),
  })
  const update = (index: number, changes: Partial<DraftReward>) => {
    setError('')
    setRows((old) => old.map((row, i) => (i === index ? { ...row, ...changes } : row)))
  }

  const addReward = () => setRows([...rows, emptyReward()])
  const removeReward = () => setRows(rows.slice(0, -1))
  const openPreview = () => {
    const settings = draft()
    const message = rouletteConfigurationError(settings.cost, settings.rewards, settings.topPrizeCost)
    if (message) setError(message)
    else {
      setError('')
      setPreview(settings)
    }
  }
  const closePreview = () => setPreview(null)

  return {
    cost,
    setCost,
    topPrice,
    setTopPrice,
    rows,
    preview,
    error,
    sum,
    draft,
    update,
    addReward,
    removeReward,
    openPreview,
    closePreview,
  }
}
