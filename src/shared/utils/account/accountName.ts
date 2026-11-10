import type { AppData } from '../../types/demoState'

const sameName = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase()

export function isNameTaken({ accounts, creators }: AppData, name: string, exceptId?: string) {
  const matches = (entry: { id: string; name: string }) =>
    (exceptId === undefined || entry.id !== exceptId) && sameName(entry.name, name)

  return Object.values(accounts).some(matches) || Object.values(creators).some(matches)
}
