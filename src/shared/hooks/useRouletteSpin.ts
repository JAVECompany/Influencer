import { useEffect, useRef, useState } from 'react'
import type { SpendResult } from '../types/actionResult'
import type { Roulette } from '../types/commerce'
import { drawRewardIndex, stopRotation, wheelSegments } from '../utils/roulette'

type WheelResult = { rewardIndex: number; reward: string; guaranteed: boolean }

export function useRouletteSpin(
  roulette: Roulette,
  mode: 'customer' | 'preview' | 'review',
  onPlay?: (guaranteed: boolean) => SpendResult
) {
  const disc = useRef<HTMLDivElement>(null)
  const rotation = useRef(0)
  const motion = useRef<Animation | null>(null)
  const busy = useRef(false)
  const [spinning, setSpinning] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [result, setResult] = useState<WheelResult | null>(null)
  const [error, setError] = useState('')
  const { rewards } = roulette
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
      motion.current = wheel.animate(
        [
          { transform: transform(from), offset: 0, easing: 'cubic-bezier(0.12, 0.6, 0.35, 1)' },
          { transform: transform(to - 210), offset: 0.61, easing: 'cubic-bezier(0.12, 0.42, 0.36, 1)' },
          { transform: transform(to - 26), offset: 0.84, easing: 'cubic-bezier(0.2, 0.56, 0.3, 1)' },
          { transform: transform(to), offset: 1 },
        ],
        { duration: 4800 }
      )
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

  const cancelPurchase = () => {
    setConfirm(false)
    setError('')
  }

  return {
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
  }
}
