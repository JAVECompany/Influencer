export type Setter<T> = <K extends keyof T>(key: K, value: T[K]) => void
export type KeysSetter = (value: any, ...keys: string[]) => void

export function createSetDataImmer<T>(set: (fn: (state: T) => void) => void) {
  return <K extends keyof T>(key: K, value: T[K]) => {
    set((state) => {
      state[key] = value
    })
  }
}

export function createSetDataKeysImmer<T>(set: (fn: (state: T) => void) => void): KeysSetter {
  return (value: any, ...keys: string[]) => {
    set((state) => {
      let target: Record<string, any> = state as Record<string, any>

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

export type FormSetter<T> = <K1 extends keyof T, K2 extends keyof NonNullable<T[K1]>>(
  key1: K1,
  key2: K2,
  value: NonNullable<T[K1]>[K2]
) => void

export function createSetFormDataImmer<T>(set: (fn: (state: T) => void) => void): FormSetter<T> {
  return (key1, key2, value) => {
    set((state) => {
      const target = state[key1]

      if (target) {
        ;(target as any)[key2] = value
      } else {
        console.warn(`[FormSetter] target object '${String(key1)}' is null or undefined.`)
      }
    })
  }
}
export function createSetFormData<T>(set: (fn: (state: T) => T) => void): FormSetter<T> {
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
