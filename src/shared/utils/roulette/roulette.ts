import type { Reward } from '../../types/commerce'

export interface WheelSegment {
  name: string
  start: number
  end: number
}

const degrees = (angle: number) => ((angle % 360) + 360) % 360

export function rouletteConfigurationError(cost: number, rewards: Reward[], topPrizeCost?: number | null) {
  const valid = (n: number, max: number) => Number.isInteger(n) && n > 0 && n <= max
  if (!valid(cost, 10000) || (topPrizeCost != null && !valid(topPrizeCost, 10000))) {
    return '룰렛과 1등 확정 구매 가격은 1~10,000 코인으로 입력해 주세요.'
  }
  if (
    rewards.length < 2 ||
    rewards.length > 8 ||
    rewards.some((r) => !r.name.trim() || !valid(r.chance, 99)) ||
    rewards.reduce((sum, r) => sum + r.chance, 0) !== 100
  ) {
    return '상품명을 입력하고 당첨 확률의 합을 100%로 맞춰 주세요.'
  }
  return ''
}

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
