import { Sparkles } from 'lucide-react'
import Button from '../../../shared/components/ui/Button'
import { panel } from '../../../shared/styles/controlStyles'
import type { Roulette } from '../../../shared/types/commerce'
import { formatNumber } from '../../../shared/utils/format'

export default function CreatorRouletteSettings({
  roulette,
  onPreview,
  onEdit,
}: {
  roulette?: Roulette
  onPreview: () => void
  onEdit: () => void
}) {
  return (
    <div className={`${panel} p-5`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-black">
          <Sparkles size={17} className="text-mint" /> 룰렛
        </h2>
        <div className="flex flex-wrap gap-2">
          {roulette && (
            <Button tone="subtle" onClick={onPreview}>
              미리보기
            </Button>
          )}
          <Button tone="subtle" onClick={onEdit}>
            {roulette ? '설정 수정' : '룰렛 등록'}
          </Button>
        </div>
      </div>
      {roulette ? (
        <div className="mt-3 grid gap-2 text-sm text-dim">
          <p>{formatNumber(roulette.cost)} 코인 / 1회</p>
          {roulette.topPrizeCost != null && <p>1등 확정 구매 · {formatNumber(roulette.topPrizeCost)} 코인</p>}
          {roulette.rewards.map((r, i) => (
            <p key={i} className="flex flex-wrap justify-between gap-3 rounded-lg bg-night px-3 py-2">
              <span>{r.name}</span>
              <span>{r.chance}%</span>
            </p>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm text-dim">설정된 룰렛이 없어요.</p>
      )}
    </div>
  )
}
