import { Coins, Gift } from 'lucide-react'
import { useRouletteSpin } from '../../hooks/useRouletteSpin'
import type { SpendResult } from '../../types/actionResult'
import type { Roulette } from '../../types/commerce'
import { formatNumber } from '../../utils/format'
import { displayShare } from '../../utils/roulette'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import Modal from '../ui/Modal'
import RouletteWheel from './RouletteWheel'

interface RouletteWheelProps {
  roulette: Roulette
  onClose: () => void
  balance?: number
  mode?: 'customer' | 'preview' | 'review'
  onPlay?: (guaranteed: boolean) => SpendResult
}

export default function RouletteWheelDialog({
  roulette,
  onClose,
  balance = 0,
  mode = 'customer',
  onPlay,
}: RouletteWheelProps) {
  const { rewards, cost, topPrizeCost } = roulette
  const {
    disc,
    segments,
    spinning,
    confirm,
    setConfirm,
    cancelPurchase,
    result,
    error,
    preview,
    review,
    play,
  } = useRouletteSpin(roulette, mode, onPlay)

  return (
    <Modal title="크리에이터 룰렛" onClose={onClose}>
      <div className="grid gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-dim">
          <p className="flex items-center gap-1.5">
            <Coins size={16} className="text-mint" />
            {formatNumber(cost)} 코인 / 1회
          </p>
          {mode === 'customer' ? (
            <span>보유 {formatNumber(balance)} 코인</span>
          ) : (
            <Badge>{preview ? '고객 화면 미리보기' : '관리자 검수'}</Badge>
          )}
        </div>
        {topPrizeCost != null && (
          <section className="rounded-xl border border-mint/25 bg-[#142d30] p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-sm font-black">
                  <Gift size={17} className="shrink-0 text-mint" />
                  1등 확정 구매
                </p>
                <p className="mt-1 text-xs break-words text-dim">
                  {rewards[0].name} · {formatNumber(topPrizeCost)} 코인
                </p>
              </div>
              {!review && !confirm && (
                <Button tone="subtle" disabled={spinning} onClick={() => setConfirm(true)}>
                  확정 구매
                </Button>
              )}
            </div>
            {confirm && (
              <div className="mt-3 flex flex-wrap gap-2">
                <Button onClick={() => play(true)}>{formatNumber(topPrizeCost)} 코인으로 확정 구매</Button>
                <Button tone="plain" onClick={cancelPurchase}>
                  취소
                </Button>
              </div>
            )}
          </section>
        )}
        <RouletteWheel segments={segments} disc={disc} />
        <p className="text-center text-xs text-dim">
          원판 구간 크기는 시각 연출용이며 실제 당첨 확률을 뜻하지 않습니다.
        </p>
        {review && (
          <ul className="grid gap-1 rounded-xl bg-night p-3 text-xs text-dim">
            {rewards.map((reward, i) => (
              <li key={i} className="flex flex-wrap justify-between gap-x-2 gap-y-1">
                <span>
                  {i + 1}번 · {reward.name}
                </span>
                <span>
                  표시 {displayShare(reward)}% · 실제 {reward.chance}%
                </span>
              </li>
            ))}
          </ul>
        )}
        {result && (
          <p
            role="status"
            className="rounded-xl bg-[#162e32] px-3 py-2.5 text-center text-sm font-bold break-words text-mint"
          >
            {result.guaranteed ? '1등 확정 구매' : result.rewardIndex + 1 + '번 결과'} · {result.reward}
          </p>
        )}
        {error && (
          <p role="alert" className="text-center text-sm text-red-200">
            {error}
          </p>
        )}
        {!review && (
          <Button className="w-full" disabled={spinning || confirm} onClick={() => play(false)}>
            {spinning ? '원판이 돌고 있어요' : '원판 돌리기'}
          </Button>
        )}
      </div>
    </Modal>
  )
}
