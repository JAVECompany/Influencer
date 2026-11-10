import type { Failure } from '../../types/actionResult'
import type { Reward, Roulette } from '../../types/commerce'
import { fail } from '../actions/actionResults'

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

export function prepareRoulette(
  cost: number,
  rewards: Reward[],
  topPrizeCost: number | null
): Roulette | Failure {
  const error = rouletteConfigurationError(cost, rewards, topPrizeCost)
  if (error) {
    return fail(error)
  }

  return {
    cost,
    topPrizeCost,
    rewards: rewards.map(({ name, chance }) => ({ name: name.trim().slice(0, 60), chance })),
  }
}
