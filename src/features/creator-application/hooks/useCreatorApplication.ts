import { useState } from 'react'
import type { FormEvent } from 'react'
import { useCreatorStore } from '../../../shared/store/creator/creator'
import type { ApplicationMethodType } from '../../../shared/types/account'
import type { OperatorPropsType } from '../../../shared/types/navigation'
import { readFormValue } from '../../../shared/utils/forms/formData'

export function useCreatorApplication({ account, notify }: OperatorPropsType) {
  const creator = useCreatorStore((s) => s.creators[account.id])
  const applyForCreator = useCreatorStore((s) => s.applyForCreator)
  const [method, setMethod] = useState<ApplicationMethodType>('link')
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    notify(
      applyForCreator({
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
