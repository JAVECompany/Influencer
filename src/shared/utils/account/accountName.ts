import type { IAppData } from '../../types/demoState'

const areNamesEqual = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase()

export function isNameTaken({ accounts, creators }: IAppData, name: string, exceptId?: string) {
  const matches = (entry: { id: string; name: string }) =>
    (exceptId === undefined || entry.id !== exceptId) && areNamesEqual(entry.name, name)

  return Object.values(accounts).some(matches) || Object.values(creators).some(matches)
}
