export type SetDataPayload = {
  keys: Array<string>
  value: any
}
export type SetDataAtKeys = (value: any, ...keys: string[]) => void
type PayloadAction<T> = {
  payload: T
}

export function setData(state: Record<string, any>, { payload }: PayloadAction<SetDataPayload>) {
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
