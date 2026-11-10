import { initialData } from '../data/initialData'
import type { SessionData } from '../types/demoState'

const mergeFixtures = <Entry extends { id: string }>(stored: Entry[], fixtures: Entry[]) => {
  const ids = new Set(stored.map((entry) => entry.id))
  return [...stored, ...fixtures.filter((entry) => !ids.has(entry.id))]
}

export const migrateDemoState = (persisted: unknown): SessionData => {
  const stored = persisted as Partial<SessionData> | undefined
  return {
    ...initialData,
    session: null,
    ...stored,
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
