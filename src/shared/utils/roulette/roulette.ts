import type { IReward } from '../../types/commerce'

export interface IWheelSegment {
  name: string
  start: number
  end: number
}

const normalizeAngle = (angle: number) => ((angle % 360) + 360) % 360

export function drawRewardIndex(rewards: IReward[], random = Math.random()) {
  let remaining = random * 100
  const index = rewards.findIndex(({ chance }) => {
    remaining -= chance
    return remaining < 0
  })
  return index < 0 ? rewards.length - 1 : index
}

export function calculateWheelSegments(rewards: IReward[]): IWheelSegment[] {
  let cumulativeChance = 0
  return rewards.map(({ name, chance }) => {
    const start = (cumulativeChance / 100) * 360
    cumulativeChance += chance
    return { name, start, end: (cumulativeChance / 100) * 360 }
  })
}

export function stopRotation(rotation: number, { start, end }: IWheelSegment, position = Math.random()) {
  const width = end - start
  const margin = Math.min(1.5, width * 0.2)
  const landing = start + margin + position * (width - margin * 2)
  return rotation + 360 * 5 + normalizeAngle(-landing - rotation)
}
