import { produce } from 'immer'
import type { Draft } from 'immer'
import { initialData } from '../../data/initialData'
import type { ISessionData } from '../../types/demoState'
import { migrateDemoState } from './migrate'

const key = 'bamgyeol-demo-v1'
const version = 3
const defaults: ISessionData = { ...initialData, session: null }
const persistedFields = Object.keys(defaults) as Array<keyof ISessionData>

function getStorage() {
  try {
    return globalThis.localStorage
  } catch {
    return undefined
  }
}

const storage = getStorage()

function saveDemoState(snapshot: ISessionData) {
  if (storage) {
    const state = Object.fromEntries(persistedFields.map((field) => [field, snapshot[field]]))
    storage.setItem(key, JSON.stringify({ state, version }))
  }
}

function loadDemoState(): ISessionData {
  let state: ISessionData

  try {
    const raw = storage?.getItem(key)
    if (!raw) {
      return defaults
    }

    const saved = JSON.parse(raw) as { state?: Partial<ISessionData>; version?: number }
    if (typeof saved.version !== 'number' || saved.version === version) {
      return { ...defaults, ...saved.state }
    }

    state = migrateDemoState(saved.state, saved.version)
  } catch {
    return defaults
  }

  try {
    saveDemoState(state)
  } catch {
    // Keep the migrated state available when storage cannot be written.
  }

  return state
}

let snapshot = loadDemoState()
const publishers: Array<(previous: ISessionData, next: ISessionData) => void> = []

export const getDemoState = () => snapshot

type DemoStoreType<Fields> = {
  setState: (fields: Partial<Fields>) => void
  subscribe: (listener: (next: Fields) => void) => () => void
}

export function registerDemoStore<Fields extends Partial<ISessionData>>(
  fields: Fields,
  store: DemoStoreType<Fields>
) {
  const keys = Object.keys(fields) as Array<keyof Fields & keyof ISessionData>

  publishers.push((previous, next) => {
    const changed = keys.filter((field) => previous[field] !== next[field])
    if (changed.length) {
      const patch = Object.fromEntries(changed.map((field) => [field, next[field]])) as Partial<Fields>
      store.setState(patch)
    }
  })

  store.subscribe((next) => {
    if (keys.every((field) => Object.is(snapshot[field], next[field]))) {
      return
    }

    const patch = Object.fromEntries(keys.map((field) => [field, next[field]]))
    snapshot = { ...snapshot, ...patch }
    saveDemoState(snapshot)
  })
}

export function updateDemoState(update: (draft: Draft<ISessionData>) => void) {
  const previous = snapshot
  const next = produce(previous, update)
  if (previous === next) {
    return
  }

  // Subscribers can read the complete change while each store receives its fields.
  snapshot = next
  try {
    for (const publish of publishers) {
      publish(previous, next)
    }
  } finally {
    saveDemoState(snapshot)
  }
}
