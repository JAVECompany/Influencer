import type { Reward } from '../types/commerce'

interface WheelSegment {
  start: number
  end: number
  center: number
}

const degrees = (angle: number) => ((angle % 360) + 360) % 360

export const displayShare = (reward: Reward) => reward.displayChance ?? reward.chance

export function rouletteConfigurationError(cost: number, rewards: Reward[], topPrizeCost?: number | null) {
  const valid = (n: number, max: number) => Number.isInteger(n) && n > 0 && n <= max
  if (!valid(cost, 10000) || (topPrizeCost != null && !valid(topPrizeCost, 10000))) {
    return '룰렛과 1등 확정 구매 가격은 1~10,000 코인으로 입력해 주세요.'
  }
  if (
    rewards.length < 2 ||
    rewards.length > 8 ||
    rewards.some((r) => !r.name.trim() || !valid(r.chance, 99) || !valid(displayShare(r), 99)) ||
    rewards.reduce((sum, r) => sum + r.chance, 0) !== 100 ||
    rewards.reduce((sum, r) => sum + displayShare(r), 0) !== 100
  ) {
    return '상품명을 입력하고 원판 표시 비중과 실제 확률의 합을 각각 100%로 맞춰 주세요.'
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
  const total = rewards.reduce((sum, reward) => sum + displayShare(reward), 0)
  let start = 0
  return rewards.map((reward) => {
    const end = start + (displayShare(reward) / total) * 360
    const segment = { start, end, center: (start + end) / 2 }
    start = end
    return segment
  })
}

export function stopRotation(rotation: number, segment: WheelSegment) {
  return rotation + 360 * 5 + degrees(-segment.center - rotation)
}
