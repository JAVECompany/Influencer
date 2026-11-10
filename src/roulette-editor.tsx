import { useState } from 'react'
import { RouletteWheelDialog } from './roulette-wheel'
import { displayShare, rouletteConfigurationError } from './roulette'
import { Button, field, Label, Modal } from './ui'
import type { Roulette } from './types'

type DraftReward = { name: string; chance: string; displayChance: string; manual: boolean }
const emptyReward = (): DraftReward => ({ name: '', chance: '', displayChance: '', manual: false })

export function RouletteEditor({ roulette, onClose, onSave }: {
  roulette?: Roulette; onClose: () => void; onSave: (settings: Roulette) => void
}) {
  const [cost, setCost] = useState(roulette?.cost ?? '')
  const [topPrice, setTopPrice] = useState(roulette?.topPrizeCost ?? '')
  const [rows, setRows] = useState(() => roulette?.rewards.map((reward) => ({
    name: reward.name, chance: String(reward.chance), displayChance: String(displayShare(reward)),
    manual: reward.chance !== displayShare(reward),
  })) ?? [emptyReward(), emptyReward()])
  const [preview, setPreview] = useState<Roulette | null>(null)
  const [error, setError] = useState('')
  const sum = (key: 'chance' | 'displayChance') => rows.reduce((total, row) => total + Number(row[key]), 0)
  const draft = (): Roulette => ({
    cost: Number(cost), topPrizeCost: topPrice === '' ? null : Number(topPrice),
    rewards: rows.map((row) => ({ name: row.name.trim(), chance: Number(row.chance), displayChance: Number(row.displayChance) })),
  })
  const update = (index: number, changes: Partial<DraftReward>) => {
    setError('')
    setRows((old) => old.map((row, i) => i === index ? { ...row, ...changes } : row))
  }

  if (preview) return <RouletteWheelDialog roulette={preview} mode="preview" onClose={() => setPreview(null)} />
  return <Modal title="룰렛 설정" onClose={onClose}>
    <form className="grid gap-4" onSubmit={(event) => {
      event.preventDefault()
      const settings = draft()
      onSave(settings)
    }}>
      <div className="grid gap-3 sm:grid-cols-2">
        <Label title="1회 이용 (코인)"><input type="number" min={1} max={10000} required className={field} value={cost} onChange={(e) => setCost(e.target.value)} /></Label>
        <Label title="1등 확정 구매 (코인)"><input type="number" min={1} max={10000} className={field} placeholder="미설정 시 숨김" value={topPrice} onChange={(e) => setTopPrice(e.target.value)} /></Label>
      </div>
      <p className="text-xs leading-relaxed text-dim">첫 상품이 1등입니다. 원판 표시 비중을 입력하면 실제 확률에 같은 값이 들어가며, 실제 확률은 직접 수정할 수 있어요.</p>
      {rows.map((row, i) => <fieldset key={i} className="grid grid-cols-2 gap-2 rounded-xl bg-night p-3 sm:grid-cols-[minmax(0,1.4fr)_1fr_1fr]">
        <legend className="px-1 text-xs font-bold text-mint">{i + 1}번 상품{i === 0 ? ' · 1등' : ''}</legend>
        <div className="col-span-2 sm:col-span-1"><Label title="상품명"><input required maxLength={60} className={field} value={row.name} onChange={(e) => update(i, { name: e.target.value })} /></Label></div>
        <Label title="표시 비중 (%)"><input type="number" required min={1} max={99} className={field} value={row.displayChance}
          onChange={(e) => update(i, { displayChance: e.target.value, ...(row.manual ? {} : { chance: e.target.value }) })} /></Label>
        <Label title="실제 확률 (%)"><input type="number" required min={1} max={99} className={field} value={row.chance}
          onChange={(e) => update(i, { chance: e.target.value, manual: e.target.value !== row.displayChance })} /></Label>
      </fieldset>)}
      <p className="text-xs text-dim">합계 · 표시 비중 {sum('displayChance')}% / 실제 확률 {sum('chance')}%</p>
      {error && <p role="alert" className="text-sm text-red-200">{error}</p>}
      <div className="flex flex-wrap gap-2">
        <Button tone="plain" disabled={rows.length === 8} onClick={() => setRows([...rows, emptyReward()])}>상품 추가</Button>
        <Button tone="plain" disabled={rows.length === 2} onClick={() => setRows(rows.slice(0, -1))}>마지막 상품 제거</Button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button tone="subtle" onClick={() => {
          const settings = draft()
          const message = rouletteConfigurationError(settings.cost, settings.rewards, settings.topPrizeCost)
          if (message) setError(message)
          else { setError(''); setPreview(settings) }
        }}>미리보기</Button>
        <Button type="submit">룰렛 저장</Button>
      </div>
    </form>
  </Modal>
}
