import { useState } from 'react'
import { defaultRouletteRewards } from '../../../shared/constants/roulette'
import type { IRoulette } from '../../../shared/types/commerce'
import { getRouletteConfigurationError } from '../../../shared/utils/roulette/configuration'
import type { DraftRewardType } from '../types/rouletteDraft'

export function useRouletteDraft(roulette?: IRoulette) {
  const [cost, setCost] = useState(roulette?.cost ?? '')
  const [topPrice, setTopPrice] = useState(roulette?.topPrizeCost ?? '')
  const [rows, setRows] = useState<DraftRewardType[]>(() =>
    (roulette?.rewards ?? defaultRouletteRewards).map(({ name, chance }) => ({
      name,
      chance: String(chance),
    }))
  )
  const [preview, setPreview] = useState<IRoulette | null>(null)
  const [error, setError] = useState('')
  const totalChance = rows.reduce((total, row) => total + Number(row.chance), 0)
  const createRouletteDraft = (): IRoulette => ({
    cost: Number(cost),
    topPrizeCost: topPrice === '' ? null : Number(topPrice),
    rewards: rows.map((row) => ({
      name: row.name.trim(),
      chance: Number(row.chance),
    })),
  })
  const update = (index: number, changes: Partial<DraftRewardType>) => {
    setError('')
    setRows((old) => old.map((row, i) => (i === index ? { ...row, ...changes } : row)))
  }

  const addReward = () => setRows([...rows, { name: '', chance: '' }])
  const removeReward = () => setRows(rows.slice(0, -1))
  const openPreview = () => {
    const settings = createRouletteDraft()
    const message = getRouletteConfigurationError(settings.cost, settings.rewards, settings.topPrizeCost)
    if (message) {
      setError(message)
    } else {
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
    totalChance,
    draft: createRouletteDraft,
    update,
    addReward,
    removeReward,
    openPreview,
    closePreview,
  }
}
