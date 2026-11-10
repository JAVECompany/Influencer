import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { Coins, Gift } from 'lucide-react'
import { number } from './data'
import { displayShare, drawRewardIndex, stopRotation, wheelSegments } from './roulette'
import { Badge, Button, Modal } from './ui'
import type { Roulette, SpendResult } from './types'

const colors = ['#66e8c4', '#6189b4', '#d7ae73', '#8b8fc4', '#62a497', '#b88495', '#7aa1bb', '#96b179']
const center = 144
const rim = 130
const at = (angle: number, radius: number) => {
  const radians = angle * Math.PI / 180
  return [center + radius * Math.sin(radians), center - radius * Math.cos(radians)]
}

function Wheel({ segments, disc }: { segments: ReturnType<typeof wheelSegments>; disc: RefObject<HTMLDivElement | null> }) {
  return <div className="relative mx-auto aspect-square w-full max-w-[292px]" aria-hidden="true">
    <div ref={disc} data-roulette-disc className="size-full">
      <svg viewBox="0 0 288 288" className="size-full drop-shadow-[0_10px_16px_#03090c99]">
        <circle cx={center} cy={center} r="139" fill="#0a1119" stroke="#53716f" strokeWidth="2" />
        {segments.map(({ start, end, center: middle }, i) => {
          const [x, y] = at(middle, rim * 0.75)
          const path = 'M144 144L' + at(start, rim).join(' ') + 'A130 130 0 ' + Number(end - start > 180) + ' 1 ' + at(end, rim).join(' ') + 'Z'
          return <g key={i}>
            <path d={path} fill={colors[i]} stroke="#182630" strokeWidth="1.4" />
            <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fill="#101b23" fontSize={end - start < 14 ? '9' : '17'} fontWeight="900">{i + 1}</text>
          </g>
        })}
        <circle cx={center} cy={center} r={rim} fill="none" stroke="#d6fff01a" strokeWidth="3" />
        <circle cx={center} cy={center} r="25" fill="#13272e" stroke="#a6f2dd" strokeWidth="2" />
        <circle cx={center} cy={center} r="7" fill="#62e8c4" />
      </svg>
    </div>
    <svg viewBox="0 0 32 34" className="pointer-events-none absolute -top-1 left-1/2 h-9 w-8 -translate-x-1/2 drop-shadow-md">
      <path d="M6 2h20a3 3 0 0 1 3 3v9a5 5 0 0 1-1 3L18 31a2.5 2.5 0 0 1-4 0L4 17a5 5 0 0 1-1-3V5a3 3 0 0 1 3-3Z" fill="#e1fff6" stroke="#203a38" strokeWidth="2" />
    </svg>
  </div>
}

interface RouletteWheelProps {
  roulette: Roulette
  onClose: () => void
  balance?: number
  mode?: 'customer' | 'preview' | 'review'
  onPlay?: (guaranteed: boolean) => SpendResult
}

type WheelResult = { rewardIndex: number; reward: string; guaranteed: boolean }
export function RouletteWheelDialog({ roulette, onClose, balance = 0, mode = 'customer', onPlay }: RouletteWheelProps) {
  const disc = useRef<HTMLDivElement>(null)
  const rotation = useRef(0)
  const motion = useRef<Animation | null>(null)
  const busy = useRef(false)
  const [spinning, setSpinning] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [result, setResult] = useState<WheelResult | null>(null)
  const [error, setError] = useState('')
  const { rewards, cost, topPrizeCost } = roulette
  const segments = wheelSegments(rewards)
  const preview = mode === 'preview'
  const review = mode === 'review'

  useEffect(() => () => motion.current?.cancel(), [])

  const play = async (guaranteed: boolean) => {
    const wheel = disc.current
    if (!wheel || busy.current || review) return
    setResult(null)
    const sample = guaranteed ? 0 : preview ? drawRewardIndex(rewards) : 0
    const draw: SpendResult | undefined = preview
      ? { success: true, rewardIndex: sample, reward: rewards[sample].name }
      : onPlay?.(guaranteed)
    if (!draw) return
    if ('error' in draw && draw.error) {
      setError(draw.error)
      return
    }
    if (draw.rewardIndex === undefined || draw.reward === undefined) return
    setError('')
    setConfirm(false)
    const segment = segments[draw.rewardIndex]
    const from = rotation.current
    const to = stopRotation(from, segment)
    rotation.current = to
    const transform = (angle: number) => 'rotate(' + angle + 'deg)'
    wheel.style.transform = transform(to)
    if (!guaranteed && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      busy.current = true
      setSpinning(true)
      motion.current = wheel.animate([
        { transform: transform(from), offset: 0, easing: 'cubic-bezier(0.12, 0.6, 0.35, 1)' },
        { transform: transform(to - 210), offset: 0.61, easing: 'cubic-bezier(0.12, 0.42, 0.36, 1)' },
        { transform: transform(to - 26), offset: 0.84, easing: 'cubic-bezier(0.2, 0.56, 0.3, 1)' },
        { transform: transform(to), offset: 1 },
      ], { duration: 4800 })
      try {
        await motion.current.finished
      } catch {
        if (!disc.current) return
      }
      busy.current = false
      setSpinning(false)
    }
    setResult({ reward: draw.reward, rewardIndex: draw.rewardIndex, guaranteed })
  }

  return <Modal title="크리에이터 룰렛" onClose={onClose}>
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-dim">
        <p className="flex items-center gap-1.5"><Coins size={16} className="text-mint" />{number(cost)} 코인 / 1회</p>
        {mode === 'customer' ? <span>보유 {number(balance)} 코인</span> : <Badge>{preview ? '고객 화면 미리보기' : '관리자 검수'}</Badge>}
      </div>
      {topPrizeCost != null && <section className="rounded-xl border border-mint/25 bg-[#142d30] p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-sm font-black"><Gift size={17} className="shrink-0 text-mint" />1등 확정 구매</p>
            <p className="mt-1 text-xs break-words text-dim">{rewards[0].name} · {number(topPrizeCost)} 코인</p>
          </div>
          {!review && !confirm && <Button tone="subtle" disabled={spinning} onClick={() => setConfirm(true)}>확정 구매</Button>}
        </div>
        {confirm && <div className="mt-3 flex flex-wrap gap-2">
          <Button onClick={() => play(true)}>{number(topPrizeCost)} 코인으로 확정 구매</Button>
          <Button tone="plain" onClick={() => { setConfirm(false); setError('') }}>취소</Button>
        </div>}
      </section>}
      <Wheel segments={segments} disc={disc} />
      <p className="text-center text-xs text-dim">원판 구간 크기는 시각 연출용이며 실제 당첨 확률을 뜻하지 않습니다.</p>
      {review && <ul className="grid gap-1 rounded-xl bg-night p-3 text-xs text-dim">
        {rewards.map((reward, i) => <li key={i} className="flex flex-wrap justify-between gap-x-2 gap-y-1">
          <span>{i + 1}번 · {reward.name}</span><span>표시 {displayShare(reward)}% · 실제 {reward.chance}%</span>
        </li>)}
      </ul>}
      {result && <p role="status" className="rounded-xl bg-[#162e32] px-3 py-2.5 text-center text-sm font-bold break-words text-mint">
        {result.guaranteed ? '1등 확정 구매' : (result.rewardIndex + 1) + '번 결과'} · {result.reward}
      </p>}
      {error && <p role="alert" className="text-center text-sm text-red-200">{error}</p>}
      {!review && <Button className="w-full" disabled={spinning || confirm} onClick={() => play(false)}>{spinning ? '원판이 돌고 있어요' : '원판 돌리기'}</Button>}
    </div>
  </Modal>
}
