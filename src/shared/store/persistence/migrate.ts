import { defaultRouletteRewards } from '../../constants/roulette'
import { initialData } from '../../data/initialData'
import type { ISessionData } from '../../types/demoState'

const mergeFixtures = <Entry extends { id: string }>(stored: Entry[], fixtures: Entry[]) => {
  const ids = new Set(stored.map((entry) => entry.id))
  return [...stored, ...fixtures.filter((entry) => !ids.has(entry.id))]
}

export const migrateDemoState = (persisted: unknown, version: number): ISessionData => {
  const stored = persisted as Partial<ISessionData> | undefined
  const state = {
    ...initialData,
    session: null,
    ...stored,
  }
  const products = state.products.map((product) => ({
    ...product,
    reviewStatus:
      product.reviewStatus ??
      (initialData.products.some(({ id, owner }) => id === product.id && owner === product.owner)
        ? 'approved'
        : 'pending'),
  }))
  const roulettes = Object.fromEntries(
    Object.entries(state.roulettes).map(([id, roulette]) => {
      const rewards = roulette.rewards.map(({ name, chance }) => ({ name, chance }))
      const [first, second] = rewards
      const hasOriginalDemoRewards =
        id === 'influencer123' &&
        rewards.length === 2 &&
        first.name === '비공개 사진' &&
        first.chance === 30 &&
        second.name === '다음 기회에' &&
        second.chance === 70
      return [id, { ...roulette, rewards: hasOriginalDemoRewards ? defaultRouletteRewards : rewards }]
    })
  )

  if (version >= 1) {
    return { ...state, products, roulettes }
  }

  return {
    ...state,
    products,
    roulettes,
    creators: Object.fromEntries(
      Object.entries({ ...initialData.creators, ...stored?.creators }).map(([id, creator]) => [
        id,
        { ...initialData.creators[id], ...creator },
      ])
    ),
    posts: mergeFixtures(
      stored?.posts ?? [],
      initialData.posts.filter((post) => post.owner.startsWith('demo-creator-'))
    ),
    transactions: mergeFixtures(stored?.transactions ?? [], initialData.transactions).sort(
      (a, b) => b.at - a.at
    ),
    settlement: initialData.settlement,
  }
}
