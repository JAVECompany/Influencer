import { setData } from './utils'

export type SetterType<T> = <K extends keyof T>(key: K, value: T[K]) => void
export type KeysSetterType = (value: any, ...keys: string[]) => void

export function createSetDataImmer<T>(set: (fn: (state: T) => void) => void): SetterType<T> {
  return <K extends keyof T>(key: K, value: T[K]) => {
    set((state) => {
      state[key] = value
    })
  }
}

export function createSetDataKeysImmer<T>(set: (fn: (state: T) => void) => void): KeysSetterType {
  return (value: any, ...keys: string[]) => {
    set((draft) => {
      setData(draft as Record<string, any>, { payload: { keys, value } })
    })
  }
}

export function createSetData<T>(set: (fn: (state: T) => T) => void) {
  return <K extends keyof T>(key: K, value: T[K]) => {
    set((state) => ({
      ...state,
      [key]: value,
    }))
  }
}

export type FormSetterType<T> = <K1 extends keyof T, K2 extends keyof NonNullable<T[K1]>>(
  key1: K1,
  key2: K2,
  value: NonNullable<T[K1]>[K2]
) => void

export function createSetFormDataImmer<T>(set: (fn: (state: T) => void) => void): FormSetterType<T> {
  return (key1, key2, value) => {
    set((state) => {
      const target = state[key1]

      if (!target) {
        console.warn(`[FormSetter] target object '${String(key1)}' is null or undefined.`)
        return
      }

      target[key2] = value
    })
  }
}

export function createSetFormData<T>(set: (fn: (state: T) => T) => void): FormSetterType<T> {
  return (key1, key2, value) => {
    set((state) => ({
      ...state,
      [key1]: {
        ...state[key1],
        [key2]: value,
      },
    }))
  }
}
