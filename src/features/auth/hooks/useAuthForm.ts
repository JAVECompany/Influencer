import { useState } from 'react'
import type { FormEvent } from 'react'
import { useAppStore } from '../../../shared/store/core/useAppStore'
import type { Notify } from '../../../shared/types/actionResult'

export function useAuthForm(notify: Notify) {
  const signIn = useAppStore((state) => state.signIn)
  const signUp = useAppStore((state) => state.signUp)
  const [signup, setSignup] = useState(false)
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [adult, setAdult] = useState(false)
  const [terms, setTerms] = useState(false)

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    if (signup) {
      notify(
        signUp({
          id,
          password,
          terms,
          adult,
          name: String(data.get('name') ?? ''),
          role: String(data.get('role') ?? ''),
        }),
        '데모 계정을 만들었어요.'
      )
    } else notify(signIn(id, password))
  }
  const selectDemo = (id: string) => {
    setId(id)
    setPassword(id)
  }
  const toggleSignup = () => {
    setSignup(!signup)
    setId('')
    setPassword('')
    setAdult(false)
    setTerms(false)
  }

  return {
    signup,
    id,
    setId,
    password,
    setPassword,
    adult,
    setAdult,
    terms,
    setTerms,
    submit,
    selectDemo,
    toggleSignup,
  }
}
