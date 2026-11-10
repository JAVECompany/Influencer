import { useState } from 'react'
import type { FormEvent } from 'react'
import { useCreatorStore } from '../../../shared/store/creator/creator'
import type { ApplicationMethod } from '../../../shared/types/account'
import type { OperatorProps } from '../../../shared/types/navigation'
import { readFormValue } from '../../../shared/utils/forms/formData'

export function useCreatorApplication({ account, notify }: OperatorProps) {
  const creator = useCreatorStore((state) => state.creators[account.id])
  const apply = useCreatorStore((state) => state.apply)
  const [method, setMethod] = useState<ApplicationMethod>('link')
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    notify(
      apply({
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
