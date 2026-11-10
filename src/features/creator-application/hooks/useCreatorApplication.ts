import { useState } from 'react'
import type { FormEvent } from 'react'
import { useAppStore } from '../../../shared/store/app'
import type { ApplicationMethod } from '../../../shared/types/account'
import type { OperatorProps } from '../../../shared/types/navigation'
import { readFormValue } from '../../../shared/utils/forms/formData'

export function useCreatorApplication({ account, notify }: OperatorProps) {
  const state = useAppStore()
  const [method, setMethod] = useState<ApplicationMethod>('link')
  const creator = state.creators[account.id]
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    notify(
      state.apply({
        method,
        instagram: readFormValue(data, 'instagram'),
        name: readFormValue(data, 'name'),
        handle: readFormValue(data, 'handle'),
        email: readFormValue(data, 'email'),
        bio: readFormValue(data, 'bio'),
      }),
      '심사 요청을 보냈어요.'
    )
  }

  return { creator, method, setMethod, submit }
}
