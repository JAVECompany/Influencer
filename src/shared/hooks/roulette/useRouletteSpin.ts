import { useEffect, useRef, useState } from 'react'
import type { SpendResultType } from '../../types/actionResult'
import type { IRoulette } from '../../types/commerce'
import { drawRewardIndex, stopRotation, calculateWheelSegments } from '../../utils/roulette/roulette'

type WheelResultType = { reward: string; guaranteed: boolean }

export function useRouletteSpin(
  roulette: IRoulette,
  mode: 'customer' | 'preview' | 'review',
  onPlay?: (guaranteed: boolean) => SpendResultType
) {
  const disc = useRef<HTMLDivElement>(null)
  const rotation = useRef(0)
  const motion = useRef<Animation | null>(null)
  const busy = useRef(false)
  const [spinning, setSpinning] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [result, setResult] = useState<WheelResultType | null>(null)
  const [error, setError] = useState('')
  const { rewards } = roulette
  const segments = calculateWheelSegments(rewards)
  const preview = mode === 'preview'
  const review = mode === 'review'

  useEffect(
    () => () => {
      motion.current?.cancel()
      motion.current = null
    },
    []
  )

  const play = async (guaranteed: boolean) => {
    const wheel = disc.current
    if (!wheel || busy.current || review) {
      return
    }

    setResult(null)
    const sample = guaranteed ? 0 : preview ? drawRewardIndex(rewards) : 0
    const draw: SpendResultType | undefined = preview
      ? { success: true, rewardIndex: sample, reward: rewards[sample].name }
      : onPlay?.(guaranteed)
    if (!draw) {
      return
    }
    if ('error' in draw && draw.error) {
      setError(draw.error)
      return
    }
    if (draw.rewardIndex === undefined || draw.reward === undefined) {
      return
    }

    setError('')
    setConfirm(false)
    const segment = segments[draw.rewardIndex]
    const from = rotation.current
    const to = guaranteed ? stopRotation(from, segment, 0.5) : stopRotation(from, segment)
    const getWheelTransform = (angle: number) => 'rotate(' + angle + 'deg)'
    let animation: Animation | null = null
    if (!guaranteed && !matchMedia('(prefers-reduced-motion: reduce)').matches && wheel.animate) {
      busy.current = true
      setSpinning(true)
      animation = wheel.animate(
        [{ transform: getWheelTransform(from) }, { transform: getWheelTransform(to) }],
        {
          duration: 4600,
          easing: 'cubic-bezier(0.18, 0.62, 0.34, 1)',
          fill: 'forwards',
        }
      )
      motion.current = animation
      try {
        await animation.finished
      } catch {
        if (motion.current !== animation) {
          return
        }
      }
    }
    wheel.style.transform = getWheelTransform(to)
    rotation.current = to
    if (animation) {
      motion.current = null
      animation.cancel()
      busy.current = false
      setSpinning(false)
    }
    setResult({ reward: draw.reward, guaranteed })
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
