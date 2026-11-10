import type { Reward } from '../../types/commerce'

export interface WheelSegment {
  name: string
  start: number
  end: number
}

const degrees = (angle: number) => ((angle % 360) + 360) % 360

export function drawRewardIndex(rewards: Reward[], random = Math.random()) {
  let remaining = random * 100
  const index = rewards.findIndex(({ chance }) => {
    remaining -= chance
    return remaining < 0
  })
  return index < 0 ? rewards.length - 1 : index
}

export function wheelSegments(rewards: Reward[]): WheelSegment[] {
  let cumulativeChance = 0
  return rewards.map(({ name, chance }) => {
    const start = (cumulativeChance / 100) * 360
    cumulativeChance += chance
    return { name, start, end: (cumulativeChance / 100) * 360 }
  })
}

export function stopRotation(rotation: number, { start, end }: WheelSegment, position = Math.random()) {
  const width = end - start
  const margin = Math.min(1.5, width * 0.2)
  const landing = start + margin + position * (width - margin * 2)
  return rotation + 360 * 5 + degrees(-landing - rotation)
}
