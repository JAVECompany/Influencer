import { useState } from 'react'
import { defaultRouletteRewards } from '../../../shared/constants/roulette'
import type { Roulette } from '../../../shared/types/commerce'
import { rouletteConfigurationError } from '../../../shared/utils/roulette/roulette'
import type { DraftReward } from '../types/rouletteDraft'

export function useRouletteDraft(roulette?: Roulette) {
  const [cost, setCost] = useState(roulette?.cost ?? '')
  const [topPrice, setTopPrice] = useState(roulette?.topPrizeCost ?? '')
  const [rows, setRows] = useState<DraftReward[]>(() =>
    (roulette?.rewards ?? defaultRouletteRewards).map(({ name, chance }) => ({
      name,
      chance: String(chance),
    }))
  )
  const [preview, setPreview] = useState<Roulette | null>(null)
  const [error, setError] = useState('')
  const totalChance = rows.reduce((total, row) => total + Number(row.chance), 0)
  const draft = (): Roulette => ({
    cost: Number(cost),
    topPrizeCost: topPrice === '' ? null : Number(topPrice),
    rewards: rows.map((row) => ({
      name: row.name.trim(),
      chance: Number(row.chance),
    })),
  })
  const update = (index: number, changes: Partial<DraftReward>) => {
    setError('')
    setRows((old) => old.map((row, i) => (i === index ? { ...row, ...changes } : row)))
  }

  const addReward = () => setRows([...rows, { name: '', chance: '' }])
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
    totalChance,
    draft,
    update,
    addReward,
    removeReward,
    openPreview,
    closePreview,
  }
}
