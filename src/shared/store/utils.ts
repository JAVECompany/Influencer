export function writeEntry<Value>(record: Record<string, Value>, key: string, value: Value) {
  // Account IDs can match the inherited prototype setter.
  if (key === '__proto__') {
    return { ...record, [key]: value }
  }

  record[key] = value
  return record
}

export type SetDataPayloadType = {
  keys: Array<string>
  value: any
}
export type SetDataAtKeysType = (value: any, ...keys: string[]) => void
type PayloadActionType<T> = {
  payload: T
}

export function setData(state: Record<string, any>, { payload }: PayloadActionType<SetDataPayloadType>) {
  const { keys, value } = payload

  let target = state
  keys.forEach((key, index) => {
    if (index === keys.length - 1) {
      target[key] = value
    } else {
      if (!target[key] || typeof target[key] !== 'object') {
        target[key] = {}
      }
      target = target[key]
    }
  })
}
